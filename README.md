# Fellowshipper

Fellowshipper is a Single-Page Progressive Web App (SPWA) built for 4-player *Fellowship* groups. Pick a route once. Every open screen updates right away.

| Feature | How It Works |
| :--- | :--- |
| **Splash-Page Dungeon Punch List** | Aggregates unacquired Best-in-Slot (BIS) drops across every `In Party` player's active hero and sorts all 15 dungeons by group need. Checking off a looted drop updates the list for the whole room. |
| **Synchronized Routes & Radar** | Ships with 55+ Method route links across `Regular`, `Ghorn`, `Krumbug`, `Eira`, and `Empowered` rotations, pull-by-pull callout stepping, and click-to-ping map markers over WebSockets (`/ws/party`). |
| **Multi-Character BIS Sets** | Supports all 12 *Fellowship* heroes and 14 gear slots (`Head` through `Weapon`), with multiple named BIS sets saved per character. |
| **Live `CombatLogs` Auto-Sync** | Watches `Fellowship/fellowship/Saved/CombatLogs/CombatLog*.txt` via `showDirectoryPicker` (or the CLI tailer). When `DUNGEON_START` fires, it decodes zone ID, Eternal tier, and affix IDs (`20 = Ghorn`, `21 = Krumbug`, `22 = Eira`, `12 = Empowered`), switches the room's active route, and maps live `(x, y, facing)` coordinates plus Kill Score. |
| **10,000 Eternal Score Tracker** | Computes timed targets (`615 + 15 * (level - 1)`) and predicts Emissary rotations toward the Spider Mount goal. |
| **Google & Discord Login + Ownership** | Integrates GCP **Firebase Auth / Identity Platform** (`Google Sign-In` + `Discord OIDC`), **Cloud Firestore** (`rooms/{roomId}/members/{memberId}` per-player write rules), and **Firebase Realtime Database** (`550ms` live radar telemetry & presence). |

## Cloud Deployment on GCP (Recommended — Zero Servers to Maintain)

See [**FIREBASE_GCP_SETUP.md**](FIREBASE_GCP_SETUP.md) for the full 10-minute setup linking your existing GCP project (and free GCP credits) to:
- **Firebase Hosting** + GitHub Actions CI/CD ([`.github/workflows/firebase-deploy.yml`](.github/workflows/firebase-deploy.yml))
- **Google Sign-In** & **Discord OAuth2** via OpenID Connect (`oidc.discord`)
- **Firestore** character/BIS ownership security rules ([`firestore.rules`](firestore.rules))
- **Realtime Database** live `CombatLogs` radar & presence rules ([`database.rules.json`](database.rules.json))

## Local Development

Install dependencies and launch the local Vite + WebSocket fallback server (works offline without Firebase keys):

```bash
npm install
npm run dev
```

## Self-Hosted Node Server (Optional Alternative)

Build the client bundle first. Then start `server/prodServer.ts`, which serves static assets alongside `/ws/party` and `/api/rooms/:roomId` on `PORT` (default `4173`):

```bash
npm run build
npm start
```

## Optional CLI `CombatLogs` Tailer

Chrome and Edge watch `Saved/CombatLogs` directly inside the browser. If the lead player runs Firefox or prefers a background terminal script while playing on Windows, run the companion tailer instead:

```bash
npm run tail-logs -- \
  --dir "C:\Program Files (x86)\Steam\steamapps\common\Fellowship\fellowship\Saved\CombatLogs" \
  --room stronghold \
  --server http://localhost:5173
```

## Verification

```bash
npm test
npm run lint
npm run build
```
