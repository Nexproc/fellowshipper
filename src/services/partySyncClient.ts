import {
  onDisconnect,
  onValue,
  ref as rtdbRef,
  remove as rtdbRemove,
  set as rtdbSet,
} from 'firebase/database';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BUILT_IN_ROUTES,
  createDefaultPartyState,
  createOwnedPartyState,
  DUNGEONS,
  formatPartyNameFromRoomId,
} from '../domain/catalog';
import { parseCombatLogLine, reduceCombatEvent } from '../domain/combatLogParser';
import { selectBestRoute } from '../domain/punchList';
import type {
  AuthUserInfo,
  BossVariant,
  EternalChecklistRow,
  HeroId,
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
  partyName: string;
  ownerUids: string[];
  createdByUid: string | null;
  createdByName: string | null;
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

function sanitizeRoutePulls(
  dungeonSlug: string,
  pulls: PullNode[] | null | undefined
): PullNode[] | null {
  const dungeon = DUNGEONS.find((d) => d.slug === dungeonSlug);
  if (!dungeon?.levelId) return null;
  if (!Array.isArray(pulls) || pulls.length === 0) return null;
  const hasRealGameData = pulls.some(
    (p) => (p.packTags?.length ?? 0) > 0 || (p.enemySummary?.length ?? 0) > 0
  );
  return hasRealGameData ? pulls : null;
}

function extractSharedDoc(state: PartySyncState): SharedRoomDoc {
  return {
    roomId: state.roomId,
    partyName: state.partyName ?? formatPartyNameFromRoomId(state.roomId),
    ownerUids: Array.isArray(state.ownerUids) ? state.ownerUids : [],
    createdByUid: state.createdByUid ?? null,
    createdByName: state.createdByName ?? null,
    revision: state.revision,
    leadMemberId: state.leadMemberId,
    autoFollowLogLead: state.autoFollowLogLead,
    activeDungeonSlug: state.activeDungeonSlug,
    activeVariant: state.activeVariant,
    activeRouteId: state.activeRouteId,
    activeRouteR5: state.activeRouteR5 ?? null,
    activeRoutePulls: sanitizeRoutePulls(
      state.activeDungeonSlug,
      state.activeRoutePulls
    ),
    activePullIndex: state.activePullIndex,
    plannedEternalLevel: state.plannedEternalLevel,
    customRoutes: state.customRoutes,
    eternalChecklist: state.eternalChecklist,
    memberOrder: state.members.map((m) => m.id),
  };
}

function isUnownedLegacySeedCache(parsed: Partial<PartySyncState>): boolean {
  const owners = Array.isArray(parsed.ownerUids) ? parsed.ownerUids : [];
  if (owners.length > 0) return false;
  const members = Array.isArray(parsed.members) ? parsed.members : [];
  const hasAnyClaimed = members.some((m) => Boolean(m.ownerUid));
  if (hasAnyClaimed) return false;
  const ids = members.map((m) => m.id).join(',');
  return ids === 'nick,andy,ting,duncan';
}

function sortMembersByOrder(
  members: readonly MemberProfile[],
  order: readonly string[]
): MemberProfile[] {
  return [...members].sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

function loadCachedState(roomId: string): PartySyncState {
  const seed = createDefaultPartyState(roomId);
  try {
    const storageKey = `fellowshipper:room:${roomId}`;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PartySyncState>;
      if (parsed && parsed.roomId && Array.isArray(parsed.members)) {
        if (isUnownedLegacySeedCache(parsed)) {
          localStorage.removeItem(storageKey);
          return seed;
        }
        const activeDungeonSlug =
          parsed.activeDungeonSlug ?? seed.activeDungeonSlug;
        const cachedDungeon = DUNGEONS.find((d) => d.slug === activeDungeonSlug);
        return {
          ...seed,
          ...parsed,
          roomId,
          partyName: parsed.partyName ?? formatPartyNameFromRoomId(roomId),
          ownerUids: Array.isArray(parsed.ownerUids) ? parsed.ownerUids : [],
          createdByUid: parsed.createdByUid ?? null,
          createdByName: parsed.createdByName ?? null,
          activeDungeonSlug: cachedDungeon?.levelId
            ? activeDungeonSlug
            : seed.activeDungeonSlug,
          activeRoutePulls: sanitizeRoutePulls(
            cachedDungeon?.levelId ? activeDungeonSlug : seed.activeDungeonSlug,
            parsed.activeRoutePulls
          ),
          members: parsed.members,
        };
      }
    }
  } catch {
    // Ignore storage read failure
  }
  return seed;
}

function saveCachedState(state: PartySyncState): void {
  try {
    localStorage.setItem(
      `fellowshipper:room:${state.roomId}`,
      JSON.stringify(state)
    );
  } catch {
    // Ignore quota failure
  }
}

function clearCachedState(roomId: string): void {
  try {
    localStorage.removeItem(`fellowshipper:room:${roomId}`);
  } catch {
    // Ignore storage failure
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

export interface CreatePartyRoomInput {
  partyName: string;
  displayName: string;
  heroId: HeroId;
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
  const [roomExistsInCloud, setRoomExistsInCloud] = useState<boolean | null>(
    services ? null : true
  );
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isWatchingLogs, setIsWatchingLogs] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef<PartySyncState>(state);
  const memberIdRef = useRef<string>(myMemberId);
  const authUserRef = useRef<AuthUserInfo | null>(authUser);
  const clientIdRef = useRef<string>(getOrCreateClientId());
  const roomExistsRef = useRef<boolean | null>(services ? null : true);
  const memberOrderRef = useRef<string[]>([]);

  if (state.roomId !== roomId) {
    const cached = loadCachedState(roomId);
    setState(cached);
    setRoomExistsInCloud(services ? null : true);
  }

  useEffect(() => {
    roomExistsRef.current = services ? null : true;
    memberOrderRef.current = stateRef.current.members.map((m) => m.id);
  }, [roomId, services]);

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
          roomExistsRef.current = false;
          memberOrderRef.current = [];
          setRoomExistsInCloud(false);
          const clean = createDefaultPartyState(roomId);
          clearCachedState(roomId);
          stateRef.current = clean;
          setState(clean);
          return;
        }

        roomExistsRef.current = true;
        setRoomExistsInCloud(true);

        const data = snap.data() as Partial<SharedRoomDoc>;
        const order = Array.isArray(data.memberOrder) ? data.memberOrder : [];
        memberOrderRef.current = order;

        setState((prev) => {
          const sortedMembers = sortMembersByOrder(
            prev.members,
            order.length > 0 ? order : prev.members.map((m) => m.id)
          );

          const nextDungeonSlug =
            data.activeDungeonSlug ?? prev.activeDungeonSlug;
          const rawPulls =
            data.activeRoutePulls !== undefined
              ? data.activeRoutePulls
              : (prev.activeRoutePulls ?? null);

          const merged: PartySyncState = {
            ...prev,
            roomId,
            partyName:
              data.partyName ??
              prev.partyName ??
              formatPartyNameFromRoomId(roomId),
            ownerUids: Array.isArray(data.ownerUids) ? data.ownerUids : [],
            createdByUid:
              data.createdByUid !== undefined
                ? data.createdByUid
                : (prev.createdByUid ?? null),
            createdByName:
              data.createdByName !== undefined
                ? data.createdByName
                : (prev.createdByName ?? null),
            revision: data.revision ?? prev.revision,
            leadMemberId: data.leadMemberId ?? prev.leadMemberId,
            autoFollowLogLead: data.autoFollowLogLead ?? prev.autoFollowLogLead,
            activeDungeonSlug: nextDungeonSlug,
            activeVariant: data.activeVariant ?? prev.activeVariant,
            activeRouteId: data.activeRouteId ?? prev.activeRouteId,
            activeRouteR5:
              data.activeRouteR5 !== undefined
                ? data.activeRouteR5
                : (prev.activeRouteR5 ?? null),
            activeRoutePulls: sanitizeRoutePulls(nextDungeonSlug, rawPulls),
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
        if (disposed) return;
        if (roomExistsRef.current === false && snap.empty) return;

        const remoteMembers: MemberProfile[] = [];
        for (const d of snap.docs) {
          const member = d.data() as MemberProfile;
          if (member && member.id) {
            remoteMembers.push(member);
          }
        }

        setState((prev) => {
          const order =
            memberOrderRef.current.length > 0
              ? memberOrderRef.current
              : prev.members.map((m) => m.id);
          const sorted = sortMembersByOrder(remoteMembers, order);
          const next: PartySyncState = { ...prev, members: sorted };
          if (roomExistsRef.current) {
            saveCachedState(next);
          }
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
        memberId: myMemberId || authUser.uid,
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
      const activeId = memberIdRef.current || 'player';
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
              const incoming: PartySyncState = {
                ...msg.state,
                ownerUids: Array.isArray(msg.state.ownerUids)
                  ? msg.state.ownerUids
                  : [],
              };
              setState(incoming);
              saveCachedState(incoming);
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
        memberId: myMemberId || 'player',
        displayName: myMember?.displayName ?? (myMemberId || 'Player'),
        isWatchingLogs,
      })
    );
  }, [services, myMemberId, isWatchingLogs]);

  const createPartyRoom = useCallback(
    (input: CreatePartyRoomInput): string | null => {
      if (services) {
        const currentUser = authUserRef.current;
        if (!currentUser) {
          setSyncError('Sign in with Discord or Google first so your party has an authenticated owner.');
          return null;
        }
        const owned = createOwnedPartyState({
          roomId,
          partyName: input.partyName,
          owner: currentUser,
          memberDisplayName: input.displayName,
          heroId: input.heroId,
        });

        roomExistsRef.current = true;
        memberOrderRef.current = owned.members.map((m) => m.id);
        setRoomExistsInCloud(true);
        stateRef.current = owned;
        setState(owned);
        saveCachedState(owned);

        const batch = writeBatch(services.firestore);
        batch.set(
          doc(services.firestore, 'rooms', roomId),
          stripUndefined(extractSharedDoc(owned))
        );
        for (const member of owned.members) {
          batch.set(
            doc(services.firestore, 'rooms', roomId, 'members', member.id),
            stripUndefined(member)
          );
        }
        void batch.commit().catch((err: Error) => setSyncError(err.message));
        return owned.members[0]?.id ?? null;
      }

      const localOwner = {
        uid: authUserRef.current?.uid ?? 'local-owner',
        displayName: input.displayName.trim() || 'Party Owner',
        provider: 'oidc' as const,
        photoUrl: null,
      };
      const owned = createOwnedPartyState({
        roomId,
        partyName: input.partyName,
        owner: localOwner,
        memberDisplayName: input.displayName,
        heroId: input.heroId,
      });
      stateRef.current = owned;
      setState(owned);
      saveCachedState(owned);
      bcRef.current?.postMessage({ type: 'LOCAL_SYNC', state: owned });
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'SYNC_STATE', state: owned }));
      }
      return owned.members[0]?.id ?? null;
    },
    [services, roomId]
  );

  const commitState = useCallback(
    (updater: (prev: PartySyncState) => PartySyncState) => {
      const prev = stateRef.current;
      const updated = updater(prev);
      if (updated === prev) return;

      const next: PartySyncState = {
        ...updated,
        revision: prev.revision + 1,
      };

      if (services) {
        if (!authUserRef.current) {
          setSyncError(
            'Sign in with Discord or Google to save changes to your cloud party room.'
          );
          return;
        }
        if (next.ownerUids.length === 0) {
          setSyncError(
            'Every party must be owned by at least one member. Create or claim this party first.'
          );
          return;
        }
      }

      stateRef.current = next;
      memberOrderRef.current = next.members.map((m) => m.id);
      setState(next);
      saveCachedState(next);

      if (services) {
        roomExistsRef.current = true;
        setRoomExistsInCloud(true);
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
        const nextIds = new Set(next.members.map((m) => m.id));

        for (const member of next.members) {
          const oldMember = prevById.get(member.id);
          if (JSON.stringify(oldMember) !== JSON.stringify(member)) {
            void setDoc(
              doc(firestore, 'rooms', roomId, 'members', member.id),
              stripUndefined(member)
            ).catch((err: Error) => setSyncError(err.message));
          }
        }

        for (const oldMember of prev.members) {
          if (!nextIds.has(oldMember.id)) {
            void deleteDoc(
              doc(firestore, 'rooms', roomId, 'members', oldMember.id)
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
        authorName: myMember?.displayName ?? authUserRef.current?.displayName ?? 'Party',
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
        if (routeTriggered && authUserRef.current && next.ownerUids.length >= 1) {
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

  const effectiveStatus: SyncConnectionStatus =
    services && !authUser ? 'local-only' : status;
  const effectiveOnline: OnlinePresence[] =
    services && !authUser ? [] : online;

  return {
    state,
    online: effectiveOnline,
    status: effectiveStatus,
    syncBackend,
    roomExistsInCloud,
    syncError,
    clearSyncError: () => setSyncError(null),
    isWatchingLogs,
    setIsWatchingLogs,
    createPartyRoom,
    commitState,
    sendPing,
    ingestCombatLines,
  };
}
