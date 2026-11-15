import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import { PartyRoomHub } from './server/roomHub.ts';

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function attachRoomApiMiddleware(
  hub: PartyRoomHub,
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const match = /^\/api\/rooms\/([a-zA-Z0-9-_]+)(\/combat-lines)?$/.exec(url.pathname);
  if (!match) {
    next();
    return;
  }

  const roomId = match[1];
  const isLogEndpoint = Boolean(match[2]);

  if (req.method === 'GET' && !isLogEndpoint) {
    const state = hub.getOrLoadRoom(roomId);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(state));
    return;
  }

  if (req.method === 'POST' && isLogEndpoint) {
    void readJsonBody(req)
      .then((body) => {
        const lines = Array.isArray((body as { lines?: unknown })?.lines)
          ? ((body as { lines: string[] }).lines ?? [])
          : [];
        const updated = hub.ingestRawLogLines(roomId, lines);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, revision: updated.revision }));
      })
      .catch(() => {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }));
      });
    return;
  }

  next();
}

function partySyncVitePlugin(): Plugin {
  const hub = new PartyRoomHub();

  return {
    name: 'fellowshipper-party-sync',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        attachRoomApiMiddleware(hub, req, res, next);
      });
      server.httpServer?.on('upgrade', (req, socket, head) => {
        if (hub.shouldHandleUpgrade(req)) {
          hub.handleUpgrade(req, socket, head);
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        attachRoomApiMiddleware(hub, req, res, next);
      });
      server.httpServer?.on('upgrade', (req, socket, head) => {
        if (hub.shouldHandleUpgrade(req)) {
          hub.handleUpgrade(req, socket, head);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), partySyncVitePlugin()],
});
