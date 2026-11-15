import { useCallback, useEffect, useRef, useState } from 'react';
import { BUILT_IN_ROUTES, createDefaultPartyState } from '../domain/catalog';
import { parseCombatLogLine, reduceCombatEvent } from '../domain/combatLogParser';
import { selectBestRoute } from '../domain/punchList';
import type { MapPing, OnlinePresence, PartySyncState } from '../domain/types';

export type SyncConnectionStatus = 'connected' | 'local-only' | 'connecting';

function loadCachedState(roomId: string): PartySyncState {
  try {
    const raw = localStorage.getItem(`fellowshipper:room:${roomId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as PartySyncState;
      if (parsed && parsed.roomId && Array.isArray(parsed.members)) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read failure
  }
  return createDefaultPartyState(roomId);
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

export function usePartyRoom(roomId: string, myMemberId: string) {
  const [state, setState] = useState<PartySyncState>(() => loadCachedState(roomId));
  const [online, setOnline] = useState<OnlinePresence[]>([]);
  const [status, setStatus] = useState<SyncConnectionStatus>('connecting');
  const [isWatchingLogs, setIsWatchingLogs] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef<PartySyncState>(state);
  const memberIdRef = useRef<string>(myMemberId);
  const clientIdRef = useRef<string>(getOrCreateClientId());

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
        };

        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(String(ev.data)) as
              | { type: 'ROOM_SNAPSHOT'; state: PartySyncState; online: OnlinePresence[] }
              | { type: 'PRESENCE_LIST'; online: OnlinePresence[] };

            if (msg.type === 'ROOM_SNAPSHOT') {
              setState(msg.state);
              saveCachedState(msg.state);
              setOnline(msg.online);
            } else if (msg.type === 'PRESENCE_LIST') {
              setOnline(msg.online);
            }
          } catch {
            // Ignore malformed payloads
          }
        };

        ws.onclose = () => {
          if (disposed) return;
          setStatus('local-only');
          reconnectTimer = window.setTimeout(connectWs, 2500);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        setStatus('local-only');
      }
    };

    connectWs();

    return () => {
      disposed = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
      bcRef.current?.close();
      bcRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
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
  }, [myMemberId, isWatchingLogs, status]);

  const commitState = useCallback(
    (updater: (prev: PartySyncState) => PartySyncState) => {
      setState((prev) => {
        const computed = updater(prev);
        const next: PartySyncState = {
          ...computed,
          roomId,
          revision: prev.revision + 1,
        };
        saveCachedState(next);
        bcRef.current?.postMessage({ type: 'LOCAL_SYNC', state: next });

        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'SYNC_STATE', state: next }));
        }
        return next;
      });
    },
    [roomId]
  );

  const sendPing = useCallback(
    (x: number, y: number, label: string) => {
      const myMember = stateRef.current.members.find((m) => m.id === myMemberId);
      const ping: MapPing = {
        id: `ping-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        authorName: myMember?.displayName ?? 'Lead',
        x,
        y,
        label,
        createdAtMs: Date.now(),
      };

      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ADD_PING', ping }));
        return;
      }

      commitState((prev) => ({
        ...prev,
        pings: [...prev.pings.slice(-7), ping],
      }));
    },
    [myMemberId, commitState]
  );

  const ingestCombatLines = useCallback(
    (lines: string[]) => {
      if (lines.length === 0) return;

      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'INGEST_LOG_LINES', lines }));
        return;
      }

      commitState((prev) => {
        let liveRun = prev.liveRun;
        let activeDungeonSlug = prev.activeDungeonSlug;
        let activeVariant = prev.activeVariant;
        let activeRouteId = prev.activeRouteId;
        let plannedEternalLevel = prev.plannedEternalLevel;
        const allRoutes = [...prev.customRoutes, ...BUILT_IN_ROUTES];

        for (const line of lines) {
          const parsed = parseCombatLogLine(line);
          if (!parsed) continue;
          const reduced = reduceCombatEvent(liveRun, parsed);
          liveRun = reduced.nextRun;
          if (reduced.autoRouteTrigger && prev.autoFollowLogLead) {
            activeDungeonSlug = reduced.autoRouteTrigger.dungeonSlug;
            activeVariant = reduced.autoRouteTrigger.variant;
            if (reduced.autoRouteTrigger.eternalLevel !== null) {
              plannedEternalLevel = reduced.autoRouteTrigger.eternalLevel;
            }
            const best = selectBestRoute(allRoutes, activeDungeonSlug, activeVariant);
            if (best) activeRouteId = best.id;
          }
        }

        return {
          ...prev,
          activeDungeonSlug,
          activeVariant,
          activeRouteId,
          plannedEternalLevel,
          liveRun,
        };
      });
    },
    [commitState]
  );

  const resetRoomToSeed = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'RESET_DEFAULT' }));
      return;
    }
    const fresh = createDefaultPartyState(roomId);
    saveCachedState(fresh);
    setState(fresh);
    bcRef.current?.postMessage({ type: 'LOCAL_SYNC', state: fresh });
  }, [roomId]);

  return {
    state,
    online,
    status,
    isWatchingLogs,
    setIsWatchingLogs,
    commitState,
    sendPing,
    ingestCombatLines,
    resetRoomToSeed,
  };
}
