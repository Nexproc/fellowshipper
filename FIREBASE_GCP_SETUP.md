# Create & Deploy Your New GCP + Firebase Project

This repository includes an unattended GCP + Firebase provisioner ([`scripts/provision-gcp.sh`](scripts/provision-gcp.sh)) and a mobile-friendly GitHub Actions workflow ([`.github/workflows/provision-gcp.yml`](.github/workflows/provision-gcp.yml)) that provision **Firestore**, **Realtime Database**, **Identity Platform (Google + Discord OAuth2)**, and **Firebase Hosting** on your GCP project.

---

## Option A: Mobile Setup via GitHub Actions (No Terminal Needed)

1. **Create Your GCP Project** (with your free-credits billing account selected):
   - Open [Google Cloud Console -> Create Project](https://console.cloud.google.com/projectcreate) and note the **Project ID** (for example `personal-web-apps-4821`).
2. **Create a Deployer Service Account (Modern Predefined Roles — No Legacy `Owner`)**:
   - Open [IAM & Admin -> Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) in that project -> **Create Service Account** (name: `fellowshipper-deploy`).
   - Under **Grant this service account access to project**, add these **2 predefined non-legacy roles**:
     1. **`Firebase Admin`** (`roles/firebase.admin`)
     2. **`Service Usage Admin`** (`roles/serviceusage.serviceUsageAdmin`)
   - Tap **Done** -> open the service account -> **Keys** tab -> **Add Key -> Create new key -> JSON** (saves the `.json` file to your phone).
3. **Save Secret & Run the GitHub Action**:
   - Open [GitHub Actions Secrets for `Nexproc/fellowshipper`](https://github.com/Nexproc/fellowshipper/settings/secrets/actions) -> **New repository secret**:
     - Name: `FIREBASE_SERVICE_ACCOUNT`
     - Secret: paste the contents of the downloaded `.json` key file.
     - *(Optional)* Add `DISCORD_CLIENT_SECRET` if configuring Discord OAuth2 at the same time.
   - Open [Actions -> Provision GCP & Firebase](https://github.com/Nexproc/fellowshipper/actions/workflows/provision-gcp.yml) -> **Run workflow**, enter your **GCP Project ID**, and tap **Run workflow**.
4. **Enable Sign-In Providers**:
   - Open `https://console.firebase.google.com/project/<YOUR-PROJECT-ID>/authentication/providers` and toggle **Google -> Enable -> Save** (plus **Discord** OIDC if skipped during the workflow).

---

## Option B: Run Directly in Google Cloud Shell (~3 Minutes)

1. Open this repository in Cloud Shell:
   - [**Launch Fellowshipper in Google Cloud Shell**](https://shell.cloud.google.com/?cloudshell_git_repo=https://github.com/Nexproc/fellowshipper&cloudshell_tutorial=FIREBASE_GCP_SETUP.md)
2. Run the provisioner:
   ```bash
   bash scripts/provision-gcp.sh
   ```
3. When it finishes, open the printed **Auth Providers** URL (`https://console.firebase.google.com/project/<PROJECT-ID>/authentication/providers`), enable **Google**, and share `https://<PROJECT-ID>.web.app/?room=stronghold` in Discord.

---

## Option C: Manual Click-Through in GCP & Firebase Consoles

1. **Create GCP Project**: [Google Cloud Console -> New Project](https://console.cloud.google.com/projectcreate) with your free-credits billing account attached.
2. **Add Firebase & Databases**:
   - [Firebase Console](https://console.firebase.google.com/) -> **Add project** -> select your GCP project.
   - **Build -> Firestore Database -> Create database** (`Standard` edition, `nam5`).
   - **Build -> Realtime Database -> Create Database** (`us-central1`).
   - **Project Settings -> General -> Your apps -> Web (`</>`)**: register `Fellowshipper` and copy `firebaseConfig`.
3. **Enable Google & Discord Login**:
   - **Build -> Authentication -> Get started -> Sign-in method** -> enable **Google**.
   - **Add new provider -> OpenID Connect**:
     - **Grant type**: `Code flow` · **Name**: `Discord` · **Provider ID**: `discord` (`oidc.discord`) · **Issuer URL**: `https://discord.com`
     - Paste **Client ID** and **Client Secret** from [Discord Developer Portal](https://discord.com/developers/applications) (Redirect URI: `https://<YOUR-PROJECT-ID>.firebaseapp.com/__/auth/handler`).
