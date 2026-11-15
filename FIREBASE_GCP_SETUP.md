# Create & Deploy Your New GCP + Firebase Project

Because Google Cloud project creation requires your Google Cloud Billing Account OAuth session, this repository includes a turnkey provisioner ([`scripts/provision-gcp.sh`](scripts/provision-gcp.sh)) that creates a **brand-new GCP project**, links your **free GCP credits**, provisions **Firestore + Realtime Database + Identity Platform + Hosting**, and deploys **Fellowshipper** live in one run.

---

## Option A: Run Directly in Google Cloud Shell (Zero Local Installs — ~3 Minutes)

Google Cloud Shell runs inside your browser with `gcloud`, `node`, `npm`, `firebase`, and `gh` already installed and signed in to your Google account.

1. Open this repository in Cloud Shell:
   - [**Launch Fellowshipper in Google Cloud Shell**](https://shell.cloud.google.com/?cloudshell_git_repo=https://github.com/Nexproc/fellowshipper&cloudshell_tutorial=FIREBASE_GCP_SETUP.md)
2. Run the turnkey provisioner:
   ```bash
   bash scripts/provision-gcp.sh
   ```
3. Follow the 2 prompts:
   - Press **Enter** to accept the generated project ID (e.g. `fellowshipper-4821`) or type a custom ID.
   - *(Optional)* Paste your **Discord Client ID** and **Client Secret** (from [Discord Developer Portal -> Applications -> OAuth2](https://discord.com/developers/applications) with redirect URI `https://<PROJECT-ID>.firebaseapp.com/__/auth/handler`), or press **Enter** to add Discord later.
4. When the script finishes (~2 minutes), open the printed **Auth Providers** URL (`https://console.firebase.google.com/project/<PROJECT-ID>/authentication/providers`) and toggle **Google -> Enable -> Save**.
5. Share `https://<PROJECT-ID>.web.app/?room=stronghold` in Discord!

*(Tip: If you also want future `git push` commits on `Nexproc/fellowshipper` to auto-deploy via GitHub Actions, run `gh auth login` in Cloud Shell before running `bash scripts/provision-gcp.sh`—the script detects `gh` and uploads all `VITE_FIREBASE_*` + `FIREBASE_SERVICE_ACCOUNT` repository secrets automatically.)*

---

## Option B: Manual Click-Through in GCP & Firebase Consoles

If you prefer clicking through the web UI instead of running `provision-gcp.sh`:

1. **Create New GCP Project & Attach Free Credits**:
   - Open [Google Cloud Console -> New Project](https://console.cloud.google.com/projectcreate), name it `Fellowshipper`, and make sure **Billing account** is set to your free-credits billing account.
2. **Add Firebase & Databases**:
   - Open [Firebase Console](https://console.firebase.google.com/) -> **Add project** -> select the `Fellowshipper` GCP project you just created.
   - **Build -> Firestore Database -> Create database** (`Standard` edition, `nam5` / nearest region).
   - **Build -> Realtime Database -> Create Database** (`us-central1` / nearest region).
   - **Project Settings (gear icon) -> General -> Your apps -> Web (`</>`)**: register `Fellowshipper` and copy your `firebaseConfig`.
3. **Enable Google & Discord Login**:
   - **Build -> Authentication -> Get started -> Sign-in method**:
     - Enable **Google**.
     - Click **Add new provider -> OpenID Connect** (upgrades to Identity Platform — free up to 50,000 MAUs/month):
       - **Grant type**: `Code flow` · **Name**: `Discord` · **Provider ID**: `discord` (becomes `oidc.discord`) · **Issuer URL**: `https://discord.com`
       - Paste **Client ID** and **Client Secret** from [Discord Developer Portal](https://discord.com/developers/applications) (Redirect URI: `https://<YOUR-PROJECT-ID>.firebaseapp.com/__/auth/handler`).
4. **Deploy**:
   - Copy `.env.example` to `.env.local` with your `firebaseConfig` values, then run:
     ```bash
     npm install
     npm run build
     npx firebase-tools login
     npx firebase-tools deploy --project <YOUR-PROJECT-ID>
     ```
