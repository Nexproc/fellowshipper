import {
  onDisconnect,
  onValue,
  ref as rtdbRef,
  remove as rtdbRemove,
  set as rtdbSet,
} from 'firebase/database';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BUILT_IN_ROUTES, createDefaultPartyState } from '../domain/catalog';
import { parseCombatLogLine, reduceCombatEvent } from '../domain/combatLogParser';
import { selectBestRoute } from '../domain/punchList';
import type {
  AuthUserInfo,
  BossVariant,
  EternalChecklistRow,
  LiveRunState,
  MapPing,
  MemberProfile,
  OnlinePresence,
  PartySyncState,
  PullNode,
  RoutePlan,
} from '../domain/types';
import { getFirebaseServices } from './firebaseClient';

export type SyncConnectionStatus = 'connected' | 'local-only' | 'connecting';
export type SyncBackendKind = 'firebase' | 'websocket' | 'local';

interface SharedRoomDoc {
  roomId: string;
  revision: number;
  leadMemberId: string;
  autoFollowLogLead: boolean;
  activeDungeonSlug: string;
  activeVariant: BossVariant;
  activeRouteId: string;
  activeRouteR5: string | null;
  activeRoutePulls: PullNode[] | null;
  activePullIndex: number;
  plannedEternalLevel: number;
  customRoutes: RoutePlan[];
  eternalChecklist: EternalChecklistRow[];
  memberOrder: string[];
}

function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function extractSharedDoc(state: PartySyncState): SharedRoomDoc {
  return {
    roomId: state.roomId,
    revision: state.revision,
    leadMemberId: state.leadMemberId,
    autoFollowLogLead: state.autoFollowLogLead,
    activeDungeonSlug: state.activeDungeonSlug,
    activeVariant: state.activeVariant,
    activeRouteId: state.activeRouteId,
    activeRouteR5: state.activeRouteR5 ?? null,
    activeRoutePulls: state.activeRoutePulls ?? null,
    activePullIndex: state.activePullIndex,
    plannedEternalLevel: state.plannedEternalLevel,
    customRoutes: state.customRoutes,
    eternalChecklist: state.eternalChecklist,
    memberOrder: state.members.map((m) => m.id),
  };
}

function loadCachedState(roomId: string): PartySyncState {
  const seed = createDefaultPartyState(roomId);
  try {
    const raw = localStorage.getItem(`fellowshipper:room:${roomId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as PartySyncState;
      if (parsed && parsed.roomId && Array.isArray(parsed.members)) {
        // Migrate pre-Season-2 default cache so returning mobile users open on Stormwatch S2
        if (
          parsed.activeRouteR5 === undefined &&
          parsed.activeDungeonSlug === 'ransack-of-drakheim'
        ) {
          return {
            ...parsed,
            activeDungeonSlug: seed.activeDungeonSlug,
            activeVariant: seed.activeVariant,
            activeRouteId: seed.activeRouteId,
            activeRouteR5: seed.activeRouteR5 ?? null,
            activeRoutePulls: seed.activeRoutePulls ?? null,
            activePullIndex: 1,
          };
        }
        return parsed;
      }
    }
  } catch {
    // Ignore storage read failure
  }
  return seed;
}

function saveCachedState(state: PartySyncState): void {
  try {
    localStorage.setItem(`fellowshipper:room:${state.roomId}`, JSON.stringify(state));
  } catch {
    // Ignore quota failure
  }
}

function getOrCreateClientId(): string {
  try {
    const existing = sessionStorage.getItem('fellowshipper:clientId');
    if (existing) return existing;
    const generated = `fp-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('fellowshipper:clientId', generated);
    return generated;
  } catch {
    return `fp-${Math.random().toString(36).slice(2, 9)}`;
  }
}

export function usePartyRoom(
  roomId: string,
  myMemberId: string,
  authUser: AuthUserInfo | null
) {
  const services = getFirebaseServices();
  const [state, setState] = useState<PartySyncState>(() => loadCachedState(roomId));
  const [online, setOnline] = useState<OnlinePresence[]>([]);
  const [status, setStatus] = useState<SyncConnectionStatus>('connecting');
  const [syncBackend, setSyncBackend] = useState<SyncBackendKind>(
    services ? 'firebase' : 'local'
  );
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isWatchingLogs, setIsWatchingLogs] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef<PartySyncState>(state);
  const memberIdRef = useRef<string>(myMemberId);
  const authUserRef = useRef<AuthUserInfo | null>(authUser);
  const clientIdRef = useRef<string>(getOrCreateClientId());
  const seededRoomRef = useRef<string | null>(null);

  if (state.roomId !== roomId) {
    const cached = loadCachedState(roomId);
    setState(cached);
  }

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    memberIdRef.current = myMemberId;
  }, [myMemberId]);

  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  // Effect 1: Firebase Cloud Sync (Firestore + Realtime Database) when configured & signed in
  useEffect(() => {
    if (!services || !authUser) return;

    let disposed = false;

    const { firestore, rtdb } = services;
    const roomDocRef = doc(firestore, 'rooms', roomId);
    const membersColRef = collection(firestore, 'rooms', roomId, 'members');

    const unsubRoom = onSnapshot(
      roomDocRef,
      (snap) => {
        if (disposed) return;
        setStatus('connected');
        setSyncError(null);

        if (!snap.exists()) {
          // Bootstrap new cloud room once an authenticated party member opens it
          if (authUser && seededRoomRef.current !== roomId) {
            seededRoomRef.current = roomId;
            const initial = createDefaultPartyState(roomId);
            const batch = writeBatch(firestore);
            batch.set(roomDocRef, stripUndefined(extractSharedDoc(initial)));
            for (const member of initial.members) {
              batch.set(
                doc(firestore, 'rooms', roomId, 'members', member.id),
                stripUndefined(member)
              );
            }
            void batch.commit().catch((err: Error) => {
              setSyncError(err.message);
            });
          }
          return;
        }

        const data = snap.data() as Partial<SharedRoomDoc>;
        setState((prev) => {
          const order = data.memberOrder ?? prev.members.map((m) => m.id);
          const sortedMembers = [...prev.members].sort((a, b) => {
            const ia = order.indexOf(a.id);
            const ib = order.indexOf(b.id);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
          });

          const merged: PartySyncState = {
            ...prev,
            roomId,
            revision: data.revision ?? prev.revision,
            leadMemberId: data.leadMemberId ?? prev.leadMemberId,
            autoFollowLogLead: data.autoFollowLogLead ?? prev.autoFollowLogLead,
            activeDungeonSlug: data.activeDungeonSlug ?? prev.activeDungeonSlug,
            activeVariant: data.activeVariant ?? prev.activeVariant,
            activeRouteId: data.activeRouteId ?? prev.activeRouteId,
            activeRouteR5:
              data.activeRouteR5 !== undefined
                ? data.activeRouteR5
                : (prev.activeRouteR5 ?? null),
            activeRoutePulls:
              data.activeRoutePulls !== undefined
                ? data.activeRoutePulls
                : (prev.activeRoutePulls ?? null),
            activePullIndex: data.activePullIndex ?? prev.activePullIndex,
            plannedEternalLevel:
              data.plannedEternalLevel ?? prev.plannedEternalLevel,
            customRoutes: data.customRoutes ?? prev.customRoutes,
            eternalChecklist: data.eternalChecklist ?? prev.eternalChecklist,
            members: sortedMembers,
          };
          saveCachedState(merged);
          return merged;
        });
      },
      (err) => {
        if (!disposed) {
          setStatus('local-only');
          setSyncError(err.message);
        }
      }
    );

    const unsubMembers = onSnapshot(
      membersColRef,
      (snap) => {
        if (disposed || snap.empty) return;
        const remoteMap = new Map<string, MemberProfile>();
        for (const d of snap.docs) {
          const member = d.data() as MemberProfile;
          if (member && member.id) {
            remoteMap.set(member.id, member);
          }
        }

        setState((prev) => {
          const existingIds = new Set(prev.members.map((m) => m.id));
          const updated = prev.members.map((m) => remoteMap.get(m.id) ?? m);
          for (const [id, m] of remoteMap.entries()) {
            if (!existingIds.has(id)) {
              updated.push(m);
            }
          }
          const next: PartySyncState = { ...prev, members: updated };
          saveCachedState(next);
          return next;
        });
      },
      (err) => {
        if (!disposed) {
          setSyncError(err.message);
        }
      }
    );

    const rtdbCleanups: Array<() => void> = [];
    if (rtdb) {
      const liveRunPath = rtdbRef(rtdb, `rooms/${roomId}/liveRun`);
      const pingsPath = rtdbRef(rtdb, `rooms/${roomId}/pings`);
      const presenceListPath = rtdbRef(rtdb, `rooms/${roomId}/presence`);

      rtdbCleanups.push(
        onValue(liveRunPath, (snap) => {
          const val = snap.val() as Partial<LiveRunState> | null;
          if (!val || disposed) return;
          setState((prev) => ({
            ...prev,
            liveRun: {
              ...prev.liveRun,
              ...val,
              affixes: val.affixes ?? [],
              units: val.units ?? {},
              recentEvents: val.recentEvents ?? [],
            },
          }));
        })
      );

      rtdbCleanups.push(
        onValue(pingsPath, (snap) => {
          const val = snap.val() as MapPing[] | Record<string, MapPing> | null;
          if (disposed) return;
          const list = Array.isArray(val)
            ? val
            : val
              ? Object.values(val)
              : [];
          setState((prev) => ({ ...prev, pings: list.slice(-16) }));
        })
      );

      rtdbCleanups.push(
        onValue(presenceListPath, (snap) => {
          if (disposed) return;
          const val = snap.val() as Record<string, OnlinePresence> | null;
          const now = Date.now();
          const list = val
            ? Object.values(val).filter((p) => now - p.lastHeartbeatMs < 90_000)
            : [];
          setOnline(list);
        })
      );
    }

    return () => {
      disposed = true;
      unsubRoom();
      unsubMembers();
      for (const fn of rtdbCleanups) fn();
    };
  }, [services, roomId, authUser]);

  // Effect 1b: Firebase RTDB Presence Heartbeat + onDisconnect cleanup
  useEffect(() => {
    if (!services?.rtdb || !authUser) return;
    const rtdb = services.rtdb;
    const myClientRef = rtdbRef(
      rtdb,
      `rooms/${roomId}/presence/${clientIdRef.current}`
    );

    const publishPresence = () => {
      const myMember = stateRef.current.members.find((m) => m.id === myMemberId);
      const entry: OnlinePresence = {
        clientId: clientIdRef.current,
        memberId: myMemberId,
        displayName: myMember?.displayName ?? authUser.displayName,
        isWatchingLogs,
        lastHeartbeatMs: Date.now(),
      };
      void rtdbSet(myClientRef, entry).catch(() => {});
    };

    void onDisconnect(myClientRef)
      .remove()
      .catch(() => {});
    publishPresence();

    const timer = window.setInterval(publishPresence, 25_000);
    return () => {
      window.clearInterval(timer);
      void rtdbRemove(myClientRef).catch(() => {});
    };
  }, [services, roomId, myMemberId, isWatchingLogs, authUser]);

  // Effect 2: Local WebSocket + BroadcastChannel fallback when Firebase is NOT configured
  useEffect(() => {
    if (services) return;

    let disposed = false;
    let reconnectTimer: number | null = null;

    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(`fellowshipper-room-${roomId}`);
      bc.onmessage = (ev) => {
        const data = ev.data as { type?: string; state?: PartySyncState };
        if (data?.type === 'LOCAL_SYNC' && data.state) {
          setState(data.state);
          saveCachedState(data.state);
        }
      };
      bcRef.current = bc;
    }

    const connectWs = () => {
      if (disposed) return;
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const activeId = memberIdRef.current;
      const myMember = stateRef.current.members.find((m) => m.id === activeId);
      const displayName = myMember?.displayName ?? activeId;
      const wsUrl = `${proto}//${window.location.host}/ws/party?room=${encodeURIComponent(
        roomId
      )}&clientId=${encodeURIComponent(clientIdRef.current)}&memberId=${encodeURIComponent(
        activeId
      )}&name=${encodeURIComponent(displayName)}`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (disposed) return;
          setStatus('connected');
          setSyncBackend('websocket');
        };

        ws.onmessage = (event) => {
          if (disposed) return;
          try {
            const msg = JSON.parse(String(event.data)) as
              | {
                  type: 'ROOM_SNAPSHOT';
                  state: PartySyncState;
                  online: OnlinePresence[];
                }
              | { type: 'PRESENCE_LIST'; online: OnlinePresence[] };

            if (msg.type === 'ROOM_SNAPSHOT') {
              setState(msg.state);
              saveCachedState(msg.state);
              setOnline(msg.online);
            } else if (msg.type === 'PRESENCE_LIST') {
              setOnline(msg.online);
            }
          } catch {
            // Ignore malformed wire message
          }
        };

        ws.onerror = () => {
          if (!disposed) {
            setStatus('local-only');
            setSyncBackend('local');
          }
        };

        ws.onclose = () => {
          if (disposed) return;
          setStatus('local-only');
          setSyncBackend('local');
          reconnectTimer = window.setTimeout(connectWs, 3500);
        };
      } catch {
        setStatus('local-only');
        setSyncBackend('local');
      }
    };

    connectWs();

    return () => {
      disposed = true;
      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
      }
      wsRef.current?.close();
      wsRef.current = null;
      bcRef.current?.close();
      bcRef.current = null;
    };
  }, [services, roomId]);

  useEffect(() => {
    if (services) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const myMember = stateRef.current.members.find((m) => m.id === myMemberId);
    ws.send(
      JSON.stringify({
        type: 'PRESENCE_UPDATE',
        memberId: myMemberId,
        displayName: myMember?.displayName ?? myMemberId,
        isWatchingLogs,
      })
    );
  }, [services, myMemberId, isWatchingLogs]);

  const commitState = useCallback(
    (updater: (prev: PartySyncState) => PartySyncState) => {
      const prev = stateRef.current;
      const updated = updater(prev);
      if (updated === prev) return;

      const next: PartySyncState = {
        ...updated,
        revision: prev.revision + 1,
      };

      stateRef.current = next;
      setState(next);
      saveCachedState(next);

      if (services) {
        if (!authUserRef.current) {
          setSyncError('Sign in with Google or Discord to save changes to your cloud party room.');
          return;
        }
        const { firestore } = services;
        const prevShared = extractSharedDoc(prev);
        const nextShared = extractSharedDoc(next);
        const prevSharedComparable = { ...prevShared, revision: 0 };
        const nextSharedComparable = { ...nextShared, revision: 0 };

        if (
          JSON.stringify(prevSharedComparable) !==
          JSON.stringify(nextSharedComparable)
        ) {
          void setDoc(
            doc(firestore, 'rooms', roomId),
            stripUndefined(nextShared),
            { merge: true }
          ).catch((err: Error) => setSyncError(err.message));
        }

        const prevById = new Map(prev.members.map((m) => [m.id, m]));
        for (const member of next.members) {
          const oldMember = prevById.get(member.id);
          if (JSON.stringify(oldMember) !== JSON.stringify(member)) {
            void setDoc(
              doc(firestore, 'rooms', roomId, 'members', member.id),
              stripUndefined(member)
            ).catch((err: Error) => setSyncError(err.message));
          }
        }
        return;
      }

      bcRef.current?.postMessage({ type: 'LOCAL_SYNC', state: next });
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'SYNC_STATE', state: next }));
      }
    },
    [services, roomId]
  );

  const sendPing = useCallback(
    (x: number, y: number, label: string) => {
      const myMember = stateRef.current.members.find((m) => m.id === myMemberId);
      const ping: MapPing = {
        id: `ping-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        authorName: myMember?.displayName ?? 'Party',
        x,
        y,
        label,
        createdAtMs: Date.now(),
      };

      const nextPings = [...stateRef.current.pings.slice(-15), ping];
      const next: PartySyncState = {
        ...stateRef.current,
        pings: nextPings,
      };
      stateRef.current = next;
      setState(next);

      if (services?.rtdb && authUserRef.current) {
        void rtdbSet(
          rtdbRef(services.rtdb, `rooms/${roomId}/pings`),
          stripUndefined(nextPings)
        ).catch(() => {});
        return;
      }

      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ADD_PING', ping }));
      } else {
        bcRef.current?.postMessage({ type: 'LOCAL_SYNC', state: next });
      }
    },
    [services, roomId, myMemberId]
  );

  const ingestCombatLines = useCallback(
    (lines: string[]) => {
      if (lines.length === 0) return;

      if (!services) {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'INGEST_LOG_LINES', lines }));
          return;
        }
      }

      const prev = stateRef.current;
      let liveRun = prev.liveRun;
      let activeDungeonSlug = prev.activeDungeonSlug;
      let activeVariant = prev.activeVariant;
      let activeRouteId = prev.activeRouteId;
      let activeRouteR5 = prev.activeRouteR5 ?? null;
      let activeRoutePulls = prev.activeRoutePulls ?? null;
      let plannedEternalLevel = prev.plannedEternalLevel;
      let routeTriggered = false;
      const allRoutes = [...prev.customRoutes, ...BUILT_IN_ROUTES];

      for (const line of lines) {
        const parsed = parseCombatLogLine(line);
        if (!parsed) continue;
        const reduced = reduceCombatEvent(liveRun, parsed);
        liveRun = reduced.nextRun;

        if (reduced.autoRouteTrigger && prev.autoFollowLogLead) {
          routeTriggered = true;
          activeDungeonSlug = reduced.autoRouteTrigger.dungeonSlug;
          activeVariant = reduced.autoRouteTrigger.variant;
          if (reduced.autoRouteTrigger.eternalLevel !== null) {
            plannedEternalLevel = reduced.autoRouteTrigger.eternalLevel;
          }
          const matched = selectBestRoute(allRoutes, activeDungeonSlug, activeVariant);
          if (matched) {
            activeRouteId = matched.id;
            activeRouteR5 = matched.r5Code ?? null;
            activeRoutePulls = matched.pulls ?? null;
          } else {
            activeRouteR5 = null;
            activeRoutePulls = null;
          }
        }
      }

      const next: PartySyncState = {
        ...prev,
        revision: prev.revision + 1,
        activeDungeonSlug,
        activeVariant,
        activeRouteId,
        activeRouteR5,
        activeRoutePulls,
        plannedEternalLevel,
        liveRun,
      };

      stateRef.current = next;
      setState(next);
      saveCachedState(next);

      if (services) {
        if (services.rtdb && authUserRef.current) {
          void rtdbSet(
            rtdbRef(services.rtdb, `rooms/${roomId}/liveRun`),
            stripUndefined(liveRun)
          ).catch(() => {});
        }
        if (routeTriggered && authUserRef.current) {
          void setDoc(
            doc(services.firestore, 'rooms', roomId),
            stripUndefined(extractSharedDoc(next)),
            { merge: true }
          ).catch(() => {});
        }
        return;
      }

      bcRef.current?.postMessage({ type: 'LOCAL_SYNC', state: next });
    },
    [services, roomId]
  );

  const resetRoomToSeed = useCallback(() => {
    const fresh = createDefaultPartyState(roomId);

    if (services) {
      const uid = authUserRef.current?.uid;
      if (!uid) return;
      const prevById = new Map(stateRef.current.members.map((m) => [m.id, m]));
      const mergedMembers = fresh.members.map((seedMember) => {
        const existing = prevById.get(seedMember.id);
        if (!existing) return seedMember;
        // Preserve ownership claims; if owned by someone else, leave their doc untouched
        if (existing.ownerUid && existing.ownerUid !== uid) {
          return existing;
        }
        return {
          ...seedMember,
          ownerUid: existing.ownerUid ?? null,
          ownerDisplayName: existing.ownerDisplayName ?? null,
          ownerProvider: existing.ownerProvider ?? null,
          ownerPhotoUrl: existing.ownerPhotoUrl ?? null,
          allowPartyLeadLootCheck: existing.allowPartyLeadLootCheck ?? true,
        };
      });

      const next: PartySyncState = {
        ...fresh,
        members: mergedMembers,
      };
      stateRef.current = next;
      setState(next);
      saveCachedState(next);

      const batch = writeBatch(services.firestore);
      batch.set(
        doc(services.firestore, 'rooms', roomId),
        stripUndefined(extractSharedDoc(next))
      );
      for (const m of mergedMembers) {
        const existing = prevById.get(m.id);
        if (!existing?.ownerUid || existing.ownerUid === uid) {
          batch.set(
            doc(services.firestore, 'rooms', roomId, 'members', m.id),
            stripUndefined(m)
          );
        }
      }
      void batch.commit().catch((err: Error) => setSyncError(err.message));
      if (services.rtdb) {
        void rtdbSet(
          rtdbRef(services.rtdb, `rooms/${roomId}/liveRun`),
          stripUndefined(fresh.liveRun)
        ).catch(() => {});
      }
      return;
    }

    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'RESET_DEFAULT' }));
      return;
    }
    stateRef.current = fresh;
    setState(fresh);
    saveCachedState(fresh);
    bcRef.current?.postMessage({ type: 'LOCAL_SYNC', state: fresh });
  }, [services, roomId]);

  const effectiveStatus: SyncConnectionStatus =
    services && !authUser ? 'local-only' : status;
  const effectiveOnline: OnlinePresence[] =
    services && !authUser ? [] : online;

  return {
    state,
    online: effectiveOnline,
    status: effectiveStatus,
    syncBackend,
    syncError,
    clearSyncError: () => setSyncError(null),
    isWatchingLogs,
    setIsWatchingLogs,
    commitState,
    sendPing,
    ingestCombatLines,
    resetRoomToSeed,
  };
}
