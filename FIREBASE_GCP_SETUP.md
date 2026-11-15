# Deploying Fellowshipper on GCP (Firebase Hosting + Auth + Firestore + RTDB)

Fellowshipper runs natively inside your existing **Google Cloud Platform (GCP)** project so all resources draw from your free tiers and GCP credits with zero virtual machines to maintain:

- **Firebase Hosting**: Serves the Progressive Web App over global HTTPS CDN.
- **Firebase Auth / GCP Identity Platform**: Handles **Google Sign-In** and **Discord OAuth2 (OpenID Connect)**.
- **Cloud Firestore** ([`firestore.rules`](firestore.rules)): Stores durable party routes, characters, BIS sets, and enforces per-player write ownership (`rooms/{roomId}/members/{memberId}`).
- **Firebase Realtime Database** ([`database.rules.json`](database.rules.json)): Streams `550ms` live `CombatLogs/` player coordinates, map pings, and `onDisconnect()` online presence with zero document-write charges.

---

## 1. Attach Firebase to Your Existing GCP Project (2 minutes)

1. Open the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Select your **existing GCP project** from the dropdown (so it shares your active GCP billing account and free credits).
3. In the left sidebar:
   - **Build -> Firestore Database**: Click **Create database** (Standard edition, choose your nearest US/EU region).
   - **Build -> Realtime Database**: Click **Create Database** (choose your nearest region) and copy the `https://<project-id>-default-rtdb.firebaseio.com` URL.
   - **Project Settings (gear icon) -> General -> Your apps**: Click the Web icon (`</>`), register `fellowshipper`, and copy the `firebaseConfig` values.

---

## 2. Enable Google Sign-In & Discord OAuth2 (4 minutes)

1. Go to **Build -> Authentication -> Get started -> Sign-in method**.
2. **Google**: Click **Google -> Enable -> Save**.
3. **Discord (via OpenID Connect)**:
   - Upgrade Authentication to **Identity Platform** when prompted (still free up to **50,000 MAUs/month** on GCP, so 4 players cost \$0.00).
   - Open the [Discord Developer Portal](https://discord.com/developers/applications) -> **New Application** (`Fellowshipper`) -> **OAuth2**:
     - Copy **Client ID** and reset/copy **Client Secret**.
     - Under **Redirects**, add:
       ```text
       https://<YOUR-GCP-PROJECT-ID>.firebaseapp.com/__/auth/handler
       ```
       *(If you also attach a custom domain later, add `https://<custom-domain>/__/auth/handler` as well.)*
   - Back in Firebase Console -> **Authentication -> Sign-in method -> Add new provider -> OpenID Connect**:
     - **Grant type**: `Code flow`
     - **Name**: `Discord`
     - **Provider ID**: `discord` *(Firebase prefixes this automatically as `oidc.discord`, matching `VITE_DISCORD_OIDC_PROVIDER_ID=oidc.discord`)*
     - **Client ID**: *(paste Discord Client ID)*
     - **Issuer (URL)**: `https://discord.com`
     - **Client secret**: *(paste Discord Client Secret)*
     - Click **Save**.

---

## 3. Deploy Security Rules & Auto-Deploy via GitHub Actions (3 minutes)

### Option A: Automated GitHub Actions Deploy (`Nexproc/fellowshipper`)

This repo already includes [`.github/workflows/firebase-deploy.yml`](.github/workflows/firebase-deploy.yml). Every push to `main` runs `npm test`, `npm run lint`, `npm run build`, and deploys to Firebase Hosting.

1. On your machine, run once to push the Firestore & Realtime Database security rules and generate a GitHub deploy secret:
   ```bash
   npm install -g firebase-tools
   firebase login
   git clone https://github.com/Nexproc/fellowshipper.git
   cd fellowshipper
   firebase use --add <YOUR-GCP-PROJECT-ID>
   firebase deploy --only firestore:rules,database
   firebase init hosting:github
   ```
2. Add your Web App keys under **GitHub -> `Nexproc/fellowshipper` -> Settings -> Secrets and variables -> Actions**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT` *(created automatically by `firebase init hosting:github`, or create a Firebase Hosting Admin JSON key in GCP IAM -> Service Accounts)*

### Option B: Direct One-Command CLI Deploy from Your Laptop

1. Copy `.env.example` to `.env.local` and fill in your `VITE_FIREBASE_*` values.
2. Run:
   ```bash
   npm install
   npm run build
   npx firebase-tools deploy --project <YOUR-GCP-PROJECT-ID>
   ```
3. Share `https://<YOUR-GCP-PROJECT-ID>.web.app/?room=stronghold` in Discord!

---

## 4. Claiming Your 4 Party Slots (`Nick`, `Andy`, `Ting`, `Duncan`)

1. Open `https://<YOUR-GCP-PROJECT-ID>.web.app/?room=stronghold`.
2. Click **Sign In (Google / Discord)** in the top right.
3. Click **Claim Nick** (or **Andy**, **Ting**, **Duncan**).
4. Once claimed, [`firestore.rules`](firestore.rules) locks character creation and BIS gear edits on that slot exclusively to your account UID while letting all 4 friends view every build and see live Dungeon Punch List totals.

### Optional Hard Lock to Only Your 4 Accounts

Once all four of you have signed in and claimed your slots, you can optionally copy the 4 UIDs from **Firebase Console -> Authentication -> Users** into [`firestore.rules`](firestore.rules) (`isAllowedPartyAccount()`) so no outside Google/Discord account can even read a room URL.
