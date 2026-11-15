/**
 * Optional headless Fellowship CombatLogs folder tailer.
 * Watches Saved/CombatLogs/CombatLog*.txt and streams new lines to a Fellowshipper room.
 *
 * Usage:
 *   npm run tail-logs -- --dir "C:\Program Files (x86)\Steam\steamapps\common\Fellowship\fellowship\Saved\CombatLogs" --room stronghold --server http://localhost:5173
 */
import fs from 'node:fs';
import path from 'node:path';

function parseCliFlag(name: string, fallback: string): string {
  const idx = process.argv.indexOf(name);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return fallback;
}

const logDir = parseCliFlag(
  '--dir',
  'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Fellowship\\fellowship\\Saved\\CombatLogs'
);
const roomId = parseCliFlag('--room', 'stronghold');
const serverBase = parseCliFlag('--server', 'http://localhost:5173').replace(/\/$/, '');

let trackedFile: string | null = null;
let byteOffset = 0;
let carryLine = '';

function pickLatestCombatLog(dir: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const entries = fs
    .readdirSync(dir)
    .filter((f) => /^CombatLog.*\.txt$/i.test(f))
    .map((f) => {
      const full = path.join(dir, f);
      return { full, mtimeMs: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
  return entries[0]?.full ?? null;
}

async function pollOnce(): Promise<void> {
  const latest = pickLatestCombatLog(logDir);
  if (!latest) return;

  if (latest !== trackedFile) {
    trackedFile = latest;
    byteOffset = 0;
    carryLine = '';
    console.log(`[fellowshipper] Watching log file: ${path.basename(latest)}`);
  }

  const stat = fs.statSync(latest);
  if (stat.size <= byteOffset) return;

  const lengthToRead = Math.min(stat.size - byteOffset, 512 * 1024);
  const fd = fs.openSync(latest, 'r');
  const buf = Buffer.alloc(lengthToRead);
  fs.readSync(fd, buf, 0, lengthToRead, byteOffset);
  fs.closeSync(fd);
  byteOffset += lengthToRead;

  const combined = carryLine + buf.toString('utf-8');
  const parts = combined.split(/\r?\n/);
  carryLine = parts.pop() ?? '';

  const nonEmpty = parts.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return;

  const endpoint = `${serverBase}/api/rooms/${encodeURIComponent(roomId)}/combat-lines`;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines: nonEmpty }),
  });
  if (!resp.ok) {
    console.warn(`[fellowshipper] Push returned HTTP ${resp.status}`);
  }
}

console.log(`[fellowshipper] Tailing Fellowship CombatLogs in: ${logDir}`);
console.log(`[fellowshipper] Streaming to room "${roomId}" at ${serverBase}`);
setInterval(() => {
  void pollOnce();
}, 600);
