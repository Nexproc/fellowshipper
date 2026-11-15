#!/usr/bin/env bash
# ==============================================================================
# Fellowshipper — Turnkey New GCP Project + Firebase Provisioner
# ==============================================================================
# Creates a brand-new Google Cloud Platform project, attaches your active GCP
# billing account (free credits), enables Firebase + Identity Platform +
# Firestore + Realtime Database + Hosting, writes .env.local & .firebaserc,
# builds the SPWA, and deploys live to https://<PROJECT_ID>.web.app
#
# Usage (in Google Cloud Shell or local terminal with gcloud + node):
#   bash scripts/provision-gcp.sh
# ==============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

TEMP_SA_KEY=""
cleanup() {
  if [[ -n "$TEMP_SA_KEY" && -f "$TEMP_SA_KEY" ]]; then
    rm -f "$TEMP_SA_KEY"
  fi
}
trap cleanup EXIT

echo ""
echo "================================================================"
echo "  Fellowshipper · New GCP Project & Firebase Provisioner"
echo "================================================================"
echo ""

if ! command -v gcloud >/dev/null 2>&1; then
  echo "ERROR: 'gcloud' CLI not found."
  echo "Tip: Run this directly in Google Cloud Shell (zero local install):"
  echo "  https://shell.cloud.google.com/?cloudshell_git_repo=https://github.com/Nexproc/fellowshipper"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: 'node' (>=20) is required."
  exit 1
fi

# 1. Verify gcloud authentication
ACTIVE_ACCOUNT="$(gcloud auth list --filter="status:ACTIVE" --format="value(account)" 2>/dev/null | head -n 1 || true)"
if [[ -z "$ACTIVE_ACCOUNT" ]]; then
  echo "-> Signing in to Google Cloud..."
  gcloud auth login
  ACTIVE_ACCOUNT="$(gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -n 1)"
fi
echo "-> Authenticated to GCP as: $ACTIVE_ACCOUNT"

AUTO_YES=0
if [[ "${1:-}" == "--yes" || "${1:-}" == "-y" || "${NON_INTERACTIVE:-}" == "1" ]]; then
  AUTO_YES=1
fi

# 2. Choose globally unique GCP Project ID
RAND_SUFFIX="$(printf '%04d' $((RANDOM % 9000 + 1000)))"
DEFAULT_PROJECT_ID="${PROJECT_ID:-fellowshipper-${RAND_SUFFIX}}"

if [[ "$AUTO_YES" -eq 0 && -t 0 && -z "${PROJECT_ID:-}" ]]; then
  read -r -p "Enter new GCP Project ID [${DEFAULT_PROJECT_ID}]: " INPUT_PID
  PROJECT_ID="${INPUT_PID:-$DEFAULT_PROJECT_ID}"
else
  PROJECT_ID="$DEFAULT_PROJECT_ID"
fi

FIRESTORE_REGION="${FIRESTORE_REGION:-nam5}"
RTDB_REGION="${RTDB_REGION:-us-central1}"

echo "-> Target GCP Project ID: $PROJECT_ID"

# 3. Create the GCP Project (if it doesn't already exist)
if gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  echo "-> GCP project '$PROJECT_ID' already exists; reusing."
else
  echo "-> Creating new GCP project '$PROJECT_ID'..."
  gcloud projects create "$PROJECT_ID" --name="Fellowshipper"
fi

gcloud config set project "$PROJECT_ID" >/dev/null

# 4. Link Billing Account (so your free GCP credits cover Blaze/Identity Platform)
BILLING_ENABLED="$(gcloud billing projects describe "$PROJECT_ID" --format="value(billingEnabled)" 2>/dev/null || echo "False")"
if [[ "$BILLING_ENABLED" != "True" ]]; then
  echo "-> Checking open GCP Billing Accounts (for your free credits)..."
  mapfile -t BILLING_LINES < <(gcloud billing accounts list --filter="open=true" --format="value(ACCOUNT_ID,NAME)")
  if [[ "${#BILLING_LINES[@]}" -eq 0 ]]; then
    echo "ERROR: No open GCP Billing Account found on $ACTIVE_ACCOUNT."
    echo "Activate your free GCP credits at https://console.cloud.google.com/billing first, then re-run."
    exit 1
  elif [[ "${#BILLING_LINES[@]}" -eq 1 ]]; then
    BILLING_ID="$(echo "${BILLING_LINES[0]}" | awk '{print $1}')"
    echo "-> Linking billing account $BILLING_ID to $PROJECT_ID..."
  else
    echo "Multiple open billing accounts found:"
    idx=1
    for line in "${BILLING_LINES[@]}"; do
      echo "  [$idx] $line"
      idx=$((idx + 1))
    done
    read -r -p "Select billing account number [1]: " B_CHOICE
    B_CHOICE="${B_CHOICE:-1}"
    BILLING_ID="$(echo "${BILLING_LINES[$((B_CHOICE - 1))]}" | awk '{print $1}')"
  fi
  gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING_ID" >/dev/null
  echo "-> Billing account linked."
else
  echo "-> Billing already linked on '$PROJECT_ID'."
fi

# 5. Enable required GCP & Firebase APIs
echo "-> Enabling Firebase, Firestore, Realtime Database, Hosting, and Identity Platform APIs..."
gcloud services enable \
  serviceusage.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com \
  firebase.googleapis.com \
  firestore.googleapis.com \
  firebasedatabase.googleapis.com \
  firebasehosting.googleapis.com \
  firebaserules.googleapis.com \
  identitytoolkit.googleapis.com \
  --project="$PROJECT_ID"

TOKEN="$(gcloud auth print-access-token)"

wait_for_lro() {
  local op_name="$1"
  local api_host="$2"
  if [[ -z "$op_name" || "$op_name" == "null" ]]; then
    return 0
  fi
  for _ in {1..30}; do
    local resp
    resp="$(curl -sS -H "Authorization: Bearer $(gcloud auth print-access-token)" \
      -H "X-Goog-User-Project: ${PROJECT_ID}" \
      "https://${api_host}/v1beta1/${op_name}")"
    local is_done
    is_done="$(node -e 'const d = JSON.parse(process.argv[1] || "{}"); console.log(Boolean(d.done));' "$resp")"
    if [[ "$is_done" == "true" ]]; then
      return 0
    fi
    sleep 2
  done
}

# 6. Attach Firebase to the new GCP Project
echo "-> Attaching Firebase to GCP project '$PROJECT_ID'..."
FB_CHECK_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: $PROJECT_ID" \
  "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}")"

if [[ "$FB_CHECK_STATUS" != "200" ]]; then
  ADD_FB_RESP="$(curl -sS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Goog-User-Project: $PROJECT_ID" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}:addFirebase")"
  OP_NAME="$(node -e 'const d = JSON.parse(process.argv[1] || "{}"); console.log(d.name || "");' "$ADD_FB_RESP")"
  wait_for_lro "$OP_NAME" "firebase.googleapis.com"
fi
echo "-> Firebase initialized on '$PROJECT_ID'."

# 7. Ensure default Firebase Hosting site exists
SITE_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: $PROJECT_ID" \
  "https://firebasehosting.googleapis.com/v1beta1/projects/${PROJECT_ID}/sites/${PROJECT_ID}")"

if [[ "$SITE_STATUS" != "200" ]]; then
  echo "-> Provisioning default Firebase Hosting site (${PROJECT_ID}.web.app)..."
  curl -sS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Goog-User-Project: $PROJECT_ID" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "https://firebasehosting.googleapis.com/v1beta1/projects/${PROJECT_ID}/sites?siteId=${PROJECT_ID}" >/dev/null || true
fi

# 8. Provision Cloud Firestore (Standard Native)
if gcloud firestore databases describe --database="(default)" --project="$PROJECT_ID" >/dev/null 2>&1; then
  echo "-> Cloud Firestore (default) already exists."
else
  echo "-> Creating Cloud Firestore Standard Native database (${FIRESTORE_REGION})..."
  gcloud firestore databases create \
    --database="(default)" \
    --location="$FIRESTORE_REGION" \
    --edition=standard \
    --type=firestore-native \
    --project="$PROJECT_ID" >/dev/null
fi

# 9. Provision Default Firebase Realtime Database
RTDB_INSTANCE="${PROJECT_ID}-default-rtdb"
RTDB_URL="https://${RTDB_INSTANCE}.firebaseio.com"
RTDB_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: $PROJECT_ID" \
  "https://firebasedatabase.googleapis.com/v1beta/projects/${PROJECT_ID}/locations/${RTDB_REGION}/instances/${RTDB_INSTANCE}")"

if [[ "$RTDB_STATUS" != "200" ]]; then
  echo "-> Creating Firebase Realtime Database (${RTDB_INSTANCE})..."
  curl -sS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Goog-User-Project: $PROJECT_ID" \
    -H "Content-Type: application/json" \
    -d '{"type":"DEFAULT_DATABASE"}' \
    "https://firebasedatabase.googleapis.com/v1beta/projects/${PROJECT_ID}/locations/${RTDB_REGION}/instances?databaseId=${RTDB_INSTANCE}" >/dev/null || true
fi

# 10. Initialize GCP Identity Platform & Optional Discord OIDC
echo "-> Initializing GCP Identity Platform for Authentication..."
curl -sS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: $PROJECT_ID" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/identityPlatform:initializeAuth" >/dev/null || true

if [[ -t 0 && -z "${DISCORD_CLIENT_ID:-}" ]]; then
  echo ""
  echo "Optional — Configure Discord OAuth2 right now (or press Enter to add later in Console):"
  echo "  Discord Redirect URI to paste in Discord Dev Portal:"
  echo "  https://${PROJECT_ID}.firebaseapp.com/__/auth/handler"
  read -r -p "Discord Application Client ID (leave blank to skip for now): " DISCORD_CLIENT_ID || true
  if [[ -n "${DISCORD_CLIENT_ID:-}" ]]; then
    read -r -s -p "Discord Application Client Secret: " DISCORD_CLIENT_SECRET || true
    echo ""
  fi
fi

if [[ -n "${DISCORD_CLIENT_ID:-}" && -n "${DISCORD_CLIENT_SECRET:-}" ]]; then
  echo "-> Registering Discord OIDC provider (oidc.discord) in Identity Platform..."
  DISCORD_BODY="$(node -e '
    console.log(JSON.stringify({
      name: `projects/${process.argv[1]}/oauthIdpConfigs/oidc.discord`,
      displayName: "Discord",
      enabled: true,
      issuer: "https://discord.com",
      clientId: process.argv[2],
      clientSecret: process.argv[3],
      responseType: { code: true }
    }));
  ' "$PROJECT_ID" "$DISCORD_CLIENT_ID" "$DISCORD_CLIENT_SECRET")"

  curl -sS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Goog-User-Project: $PROJECT_ID" \
    -H "Content-Type: application/json" \
    -d "$DISCORD_BODY" \
    "https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/oauthIdpConfigs?oauthIdpConfigId=oidc.discord" >/dev/null || true
fi

# 11. Register Firebase Web App & Retrieve Web SDK Config
echo "-> Registering Fellowshipper Web App & fetching SDK credentials..."
WEB_APPS_JSON="$(curl -sS \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: $PROJECT_ID" \
  "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps")"

APP_ID="$(node -e '
  const d = JSON.parse(process.argv[1] || "{}");
  console.log((d.apps && d.apps[0] && d.apps[0].appId) || "");
' "$WEB_APPS_JSON")"

if [[ -z "$APP_ID" ]]; then
  CREATE_APP_RESP="$(curl -sS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Goog-User-Project: $PROJECT_ID" \
    -H "Content-Type: application/json" \
    -d '{"displayName":"Fellowshipper"}' \
    "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps")"
  APP_OP="$(node -e 'const d = JSON.parse(process.argv[1] || "{}"); console.log(d.name || "");' "$CREATE_APP_RESP")"
  wait_for_lro "$APP_OP" "firebase.googleapis.com"
  WEB_APPS_JSON="$(curl -sS \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "X-Goog-User-Project: $PROJECT_ID" \
    "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps")"
  APP_ID="$(node -e '
    const d = JSON.parse(process.argv[1] || "{}");
    console.log((d.apps && d.apps[0] && d.apps[0].appId) || "");
  ' "$WEB_APPS_JSON")"
fi

SDK_CONFIG_JSON="$(curl -sS \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "X-Goog-User-Project: $PROJECT_ID" \
  "https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps/${APP_ID}/config")"

node -e '
  const fs = require("node:fs");
  const cfg = JSON.parse(process.argv[1]);
  const projectId = process.argv[2];
  const rtdbFallback = process.argv[3];
  const envLines = [
    `VITE_FIREBASE_API_KEY=${cfg.apiKey}`,
    `VITE_FIREBASE_AUTH_DOMAIN=${cfg.authDomain || projectId + ".firebaseapp.com"}`,
    `VITE_FIREBASE_PROJECT_ID=${cfg.projectId || projectId}`,
    `VITE_FIREBASE_DATABASE_URL=${cfg.databaseURL || rtdbFallback}`,
    `VITE_FIREBASE_STORAGE_BUCKET=${cfg.storageBucket || projectId + ".firebasestorage.app"}`,
    `VITE_FIREBASE_MESSAGING_SENDER_ID=${cfg.messagingSenderId || ""}`,
    `VITE_FIREBASE_APP_ID=${cfg.appId || ""}`,
    `VITE_DISCORD_OIDC_PROVIDER_ID=oidc.discord`,
    ""
  ].join("\n");
  fs.writeFileSync(".env.local", envLines, "utf-8");
  fs.writeFileSync(".firebaserc", JSON.stringify({ projects: { default: projectId } }, null, 2) + "\n", "utf-8");
' "$SDK_CONFIG_JSON" "$PROJECT_ID" "$RTDB_URL"

echo "-> Wrote .env.local and .firebaserc for project '$PROJECT_ID'."

# 12. Prepare Service Account Credentials for Non-Interactive Deploy & CI/CD
DEPLOY_CREDS="${GOOGLE_APPLICATION_CREDENTIALS:-}"
if [[ -z "$DEPLOY_CREDS" || ! -f "$DEPLOY_CREDS" ]]; then
  SA_NAME="fellowshipper-deploy"
  SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
  if ! gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" >/dev/null 2>&1; then
    echo "-> Creating deploy service account ($SA_EMAIL)..."
    gcloud iam service-accounts create "$SA_NAME" \
      --display-name="Fellowshipper Firebase Deployer" \
      --project="$PROJECT_ID" >/dev/null
  fi

  for ROLE in roles/firebase.admin roles/serviceusage.serviceUsageConsumer; do
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
      --member="serviceAccount:${SA_EMAIL}" \
      --role="$ROLE" \
      --quiet >/dev/null
  done

  TEMP_SA_KEY="$(mktemp /tmp/fellowshipper-sa-XXXXXX.json)"
  gcloud iam service-accounts keys create "$TEMP_SA_KEY" \
    --iam-account="$SA_EMAIL" \
    --project="$PROJECT_ID" >/dev/null
  DEPLOY_CREDS="$TEMP_SA_KEY"
  sleep 5
fi

# 13. Install dependencies, build production bundle, and deploy to Firebase!
echo "-> Building Fellowshipper production bundle..."
npm install
npm run build

echo "-> Deploying Firestore rules, Realtime Database rules, and Hosting to GCP..."
GOOGLE_APPLICATION_CREDENTIALS="$DEPLOY_CREDS" npx --yes firebase-tools deploy \
  --project "$PROJECT_ID" \
  --only firestore:rules,database,hosting

# 14. Optional: Push secrets to GitHub Actions if 'gh' is authenticated
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "-> Detected authenticated GitHub CLI ('gh'); syncing repository secrets to Nexproc/fellowshipper..."
  while IFS='=' read -r key val; do
    if [[ -n "$key" && "$key" == VITE_* ]]; then
      gh secret set "$key" --repo Nexproc/fellowshipper --body "$val" || true
    fi
  done < .env.local
  if [[ -n "$TEMP_SA_KEY" && -f "$TEMP_SA_KEY" ]]; then
    gh secret set FIREBASE_SERVICE_ACCOUNT --repo Nexproc/fellowshipper < "$TEMP_SA_KEY" || true
  fi
  echo "-> GitHub Actions auto-deploy secrets configured!"
fi

echo ""
echo "================================================================"
echo "  SUCCESS! Fellowshipper is live on your new GCP project!"
echo "================================================================"
echo "  Live App URL:      https://${PROJECT_ID}.web.app/?room=stronghold"
echo "  Auth Providers:    https://console.firebase.google.com/project/${PROJECT_ID}/authentication/providers"
echo "  Discord Redirect:  https://${PROJECT_ID}.firebaseapp.com/__/auth/handler"
echo ""
echo "  Final 1-click check: Open the Auth Providers URL above and toggle"
echo "  'Google' -> Enable (and 'Discord' OIDC if you skipped it during setup)."
echo "================================================================"
