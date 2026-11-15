/**
 * Optional headless Fellowship CombatLogs folder tailer (for Firefox or secondary monitors).
 * Watches Saved/CombatLogs/CombatLog*.txt and streams telemetry to either:
 *   1) Firebase Realtime Database (--rtdb https://<project>-default-rtdb.firebaseio.com --token <firebaseIdToken>)
 *   2) Local Fellowshipper Node server (--server http://localhost:5173)
 *
 * Note: On Chrome / Edge, you do NOT need this script — click "Watch CombatLogs/" directly in the web app.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createIdleLiveRunState } from '../src/domain/catalog.ts';
import { parseCombatLogLine, reduceCombatEvent } from '../src/domain/combatLogParser.ts';

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
const rtdbBase = parseCliFlag('--rtdb', process.env.VITE_FIREBASE_DATABASE_URL ?? '').replace(
  /\/$/,
  ''
);
const firebaseToken = parseCliFlag('--token', process.env.FIREBASE_ID_TOKEN ?? '');
const serverBase = parseCliFlag('--server', 'http://localhost:5173').replace(/\/$/, '');

let trackedFile: string | null = null;
let byteOffset = 0;
let carryLine = '';
let liveRun = createIdleLiveRunState();

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
    const statInitial = fs.statSync(latest);
    byteOffset = Math.max(0, statInitial.size - 64 * 1024);
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

  if (rtdbBase) {
    for (const line of nonEmpty) {
      const parsed = parseCombatLogLine(line);
      if (!parsed) continue;
      liveRun = reduceCombatEvent(liveRun, parsed).nextRun;
    }
    const query = firebaseToken ? `?auth=${encodeURIComponent(firebaseToken)}` : '';
    const rtdbUrl = `${rtdbBase}/rooms/${encodeURIComponent(roomId)}/liveRun.json${query}`;
    const resp = await fetch(rtdbUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(liveRun),
    });
    if (!resp.ok) {
      console.warn(`[fellowshipper] Firebase RTDB PUT returned HTTP ${resp.status}`);
    }
    return;
  }

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
console.log(
  rtdbBase
    ? `[fellowshipper] Streaming to GCP Firebase RTDB room "${roomId}" at ${rtdbBase}`
    : `[fellowshipper] Streaming to local room "${roomId}" at ${serverBase}`
);
setInterval(() => {
  void pollOnce();
}, 600);
