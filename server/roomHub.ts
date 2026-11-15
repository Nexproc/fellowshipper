import fs from 'node:fs';
import type { IncomingMessage } from 'node:http';
import path from 'node:path';
import type { Duplex } from 'node:stream';
import { WebSocket, WebSocketServer } from 'ws';
import { BUILT_IN_ROUTES, createDefaultPartyState } from '../src/domain/catalog.ts';
import { parseCombatLogLine, reduceCombatEvent } from '../src/domain/combatLogParser.ts';
import { applyCombatClearToPartyState } from '../src/domain/dungeonScore.ts';
import { selectBestRoute } from '../src/domain/punchList.ts';
import type { MapPing, OnlinePresence, PartySyncState } from '../src/domain/types.ts';

interface ConnectedPeer {
  ws: WebSocket;
  roomId: string;
  presence: OnlinePresence;
}

export type ClientWireMessage =
  | { type: 'SYNC_STATE'; state: PartySyncState }
  | { type: 'PRESENCE_UPDATE'; memberId: string; displayName: string; isWatchingLogs: boolean }
  | { type: 'ADD_PING'; ping: MapPing }
  | { type: 'INGEST_LOG_LINES'; lines: string[] }
  | { type: 'RESET_DEFAULT' };

export type ServerWireMessage =
  | { type: 'ROOM_SNAPSHOT'; state: PartySyncState; online: OnlinePresence[] }
  | { type: 'PRESENCE_LIST'; online: OnlinePresence[] };

function sanitizeRoomId(raw: string | null | undefined): string {
  const cleaned = (raw ?? 'stronghold')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 32);
  return cleaned || 'stronghold';
}

export class PartyRoomHub {
  private readonly rooms = new Map<string, PartySyncState>();
  private readonly peers = new Set<ConnectedPeer>();
  private readonly wss = new WebSocketServer({ noServer: true });
  private readonly storageDir: string;

  constructor(storageDir = path.resolve(process.cwd(), '.fellowshipper-data/rooms')) {
    this.storageDir = storageDir;
    fs.mkdirSync(this.storageDir, { recursive: true });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      this.handleConnection(ws, req);
    });
  }

  public shouldHandleUpgrade(req: IncomingMessage): boolean {
    const url = new URL(req.url ?? '/', 'http://localhost');
    return url.pathname === '/ws/party';
  }

  public handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void {
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      this.wss.emit('connection', ws, req);
    });
  }

  public getOrLoadRoom(rawRoomId: string): PartySyncState {
    const roomId = sanitizeRoomId(rawRoomId);
    const existing = this.rooms.get(roomId);
    if (existing) return existing;

    const diskPath = path.join(this.storageDir, `${roomId}.json`);
    if (fs.existsSync(diskPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(diskPath, 'utf-8')) as PartySyncState;
        if (parsed && parsed.roomId && Array.isArray(parsed.members)) {
          const normalized: PartySyncState = {
            ...parsed,
            ownerUids: Array.isArray(parsed.ownerUids) ? parsed.ownerUids : [],
          };
          this.rooms.set(roomId, normalized);
          return normalized;
        }
      } catch {
        // Ignore corrupted snapshot and recreate default
      }
    }

    const fresh = createDefaultPartyState(roomId);
    this.rooms.set(roomId, fresh);
    this.persistRoom(roomId, fresh);
    return fresh;
  }

  public ingestRawLogLines(rawRoomId: string, lines: readonly string[]): PartySyncState {
    const roomId = sanitizeRoomId(rawRoomId);
    let room = this.getOrLoadRoom(roomId);
    let liveRun = room.liveRun;
    let activeDungeonSlug = room.activeDungeonSlug;
    let activeVariant = room.activeVariant;
    let activeRouteId = room.activeRouteId;
    let activeRouteR5 = room.activeRouteR5 ?? null;
    let activeRoutePulls = room.activeRoutePulls ?? null;
    let plannedEternalLevel = room.plannedEternalLevel;
    let members = room.members;
    let eternalChecklist = room.eternalChecklist;

    const allRoutes = [...room.customRoutes, ...BUILT_IN_ROUTES];

    for (const line of lines) {
      const parsed = parseCombatLogLine(line);
      if (!parsed) continue;
      const reduced = reduceCombatEvent(liveRun, parsed);
      liveRun = reduced.nextRun;

      if (reduced.autoRouteTrigger && room.autoFollowLogLead) {
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

      if (reduced.completedClearTrigger) {
        const applied = applyCombatClearToPartyState(
          {
            ...room,
            members,
            eternalChecklist,
          },
          reduced.completedClearTrigger
        );
        members = applied.members;
        eternalChecklist = applied.eternalChecklist;
      }
    }

    room = {
      ...room,
      revision: room.revision + 1,
      activeDungeonSlug,
      activeVariant,
      activeRouteId,
      activeRouteR5,
      activeRoutePulls,
      plannedEternalLevel,
      members,
      eternalChecklist,
      liveRun,
    };
    this.rooms.set(roomId, room);
    this.persistRoom(roomId, room);
    this.broadcastSnapshot(roomId);
    return room;
  }

  private persistRoom(roomId: string, state: PartySyncState): void {
    try {
      const diskPath = path.join(this.storageDir, `${roomId}.json`);
      fs.writeFileSync(diskPath, JSON.stringify(state, null, 2), 'utf-8');
    } catch {
      // Non-fatal in read-only environments
    }
  }

  private getOnlineForRoom(roomId: string): OnlinePresence[] {
    const list: OnlinePresence[] = [];
    for (const p of this.peers) {
      if (p.roomId === roomId && p.ws.readyState === WebSocket.OPEN) {
        list.push(p.presence);
      }
    }
    return list;
  }

  private broadcastSnapshot(roomId: string): void {
    const state = this.getOrLoadRoom(roomId);
    const online = this.getOnlineForRoom(roomId);
    const payload = JSON.stringify({
      type: 'ROOM_SNAPSHOT',
      state,
      online,
    } satisfies ServerWireMessage);

    for (const peer of this.peers) {
      if (peer.roomId === roomId && peer.ws.readyState === WebSocket.OPEN) {
        peer.ws.send(payload);
      }
    }
  }

  private broadcastPresence(roomId: string): void {
    const online = this.getOnlineForRoom(roomId);
    const payload = JSON.stringify({
      type: 'PRESENCE_LIST',
      online,
    } satisfies ServerWireMessage);

    for (const peer of this.peers) {
      if (peer.roomId === roomId && peer.ws.readyState === WebSocket.OPEN) {
        peer.ws.send(payload);
      }
    }
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const roomId = sanitizeRoomId(url.searchParams.get('room'));
    const clientId = url.searchParams.get('clientId') ?? `c-${Date.now()}`;
    const memberId = url.searchParams.get('memberId') ?? 'nick';
    const displayName = url.searchParams.get('name') ?? 'Nick';

    const peer: ConnectedPeer = {
      ws,
      roomId,
      presence: {
        clientId,
        memberId,
        displayName,
        isWatchingLogs: false,
        lastHeartbeatMs: Date.now(),
      },
    };
    this.peers.add(peer);

    const initialState = this.getOrLoadRoom(roomId);
    ws.send(
      JSON.stringify({
        type: 'ROOM_SNAPSHOT',
        state: initialState,
        online: this.getOnlineForRoom(roomId),
      } satisfies ServerWireMessage)
    );
    this.broadcastPresence(roomId);

    ws.on('message', (rawBuf) => {
      try {
        const msg = JSON.parse(String(rawBuf)) as ClientWireMessage;
        this.handlePeerMessage(peer, msg);
      } catch {
        // Ignore malformed client frames
      }
    });

    ws.on('close', () => {
      this.peers.delete(peer);
      this.broadcastPresence(roomId);
    });
  }

  private handlePeerMessage(peer: ConnectedPeer, msg: ClientWireMessage): void {
    peer.presence.lastHeartbeatMs = Date.now();
    const roomId = peer.roomId;

    if (msg.type === 'PRESENCE_UPDATE') {
      peer.presence = {
        ...peer.presence,
        memberId: msg.memberId,
        displayName: msg.displayName,
        isWatchingLogs: msg.isWatchingLogs,
        lastHeartbeatMs: Date.now(),
      };
      this.broadcastPresence(roomId);
      return;
    }

    if (msg.type === 'SYNC_STATE') {
      const current = this.getOrLoadRoom(roomId);
      const next: PartySyncState = {
        ...msg.state,
        roomId,
        revision: Math.max(current.revision + 1, msg.state.revision),
      };
      this.rooms.set(roomId, next);
      this.persistRoom(roomId, next);
      this.broadcastSnapshot(roomId);
      return;
    }

    if (msg.type === 'ADD_PING') {
      const current = this.getOrLoadRoom(roomId);
      const cutoff = Date.now() - 25_000;
      const pings = [...current.pings.filter((p) => p.createdAtMs > cutoff), msg.ping].slice(-8);
      const next: PartySyncState = {
        ...current,
        revision: current.revision + 1,
        pings,
      };
      this.rooms.set(roomId, next);
      this.broadcastSnapshot(roomId);
      return;
    }

    if (msg.type === 'INGEST_LOG_LINES') {
      this.ingestRawLogLines(roomId, msg.lines);
      return;
    }

    if (msg.type === 'RESET_DEFAULT') {
      const fresh = createDefaultPartyState(roomId);
      this.rooms.set(roomId, fresh);
      this.persistRoom(roomId, fresh);
      this.broadcastSnapshot(roomId);
    }
  }
}
