import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { PartyRoomHub } from './roomHub.ts';

const PORT = Number.parseInt(process.env.PORT ?? '4173', 10);
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const hub = new PartyRoomHub();

const MIME_BY_EXT: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const match = /^\/api\/rooms\/([a-zA-Z0-9-_]+)(\/combat-lines)?$/.exec(url.pathname);

  if (match) {
    const roomId = match[1];
    if (req.method === 'GET' && !match[2]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(hub.getOrLoadRoom(roomId)));
      return;
    }
    if (req.method === 'POST' && match[2]) {
      const chunks: Buffer[] = [];
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => {
        try {
          const parsed = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as {
            lines?: string[];
          };
          const updated = hub.ingestRawLogLines(roomId, parsed.lines ?? []);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, revision: updated.revision }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false }));
        }
      });
      return;
    }
  }

  const safeRel = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
  let candidate = path.join(DIST_DIR, safeRel === '/' ? 'index.html' : safeRel);
  if (!fs.existsSync(candidate) || fs.statSync(candidate).isDirectory()) {
    candidate = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(candidate)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Run `npm run build` before starting prodServer.');
    return;
  }

  const ext = path.extname(candidate);
  res.writeHead(200, {
    'Content-Type': MIME_BY_EXT[ext] ?? 'application/octet-stream',
  });
  fs.createReadStream(candidate).pipe(res);
});

server.on('upgrade', (req, socket, head) => {
  if (hub.shouldHandleUpgrade(req)) {
    hub.handleUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Fellowshipper server listening on http://localhost:${PORT}`);
});
