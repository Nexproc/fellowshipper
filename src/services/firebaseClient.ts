import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore, type Firestore } from 'firebase/firestore';

const LEGACY_STORAGE_OVERRIDE_KEY = 'fellowshipper:firebaseConfigOverride';

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  rtdb: Database | null;
  projectId: string;
  discordProviderId: string;
  isGoogleAuthEnabled: boolean;
}

let cachedServices: FirebaseServices | null | undefined;

function resolveEnvFirebaseConfig(): FirebaseOptions | null {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_OVERRIDE_KEY);
    } catch {
      // Ignore localStorage failure
    }
  }

  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
  const apiKey = env.VITE_FIREBASE_API_KEY?.trim();
  const projectId = env.VITE_FIREBASE_PROJECT_ID?.trim();

  if (!apiKey || !projectId) {
    return null;
  }

  return {
    apiKey,
    authDomain:
      env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || `${projectId}.firebaseapp.com`,
    projectId,
    databaseURL:
      env.VITE_FIREBASE_DATABASE_URL?.trim() ||
      `https://${projectId}-default-rtdb.firebaseio.com`,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: env.VITE_FIREBASE_APP_ID?.trim(),
  };
}

export function getDiscordProviderId(): string {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
  return env.VITE_DISCORD_OIDC_PROVIDER_ID?.trim() || 'oidc.discord';
}

export function getIsGoogleAuthEnabled(): boolean {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
  return env.VITE_GOOGLE_AUTH_ENABLED?.trim().toLowerCase() !== 'false';
}

export function getFirebaseServices(): FirebaseServices | null {
  if (cachedServices !== undefined) {
    return cachedServices;
  }

  const options = resolveEnvFirebaseConfig();
  if (!options || !options.projectId) {
    cachedServices = null;
    return null;
  }

  try {
    const existing = getApps();
    const app = existing.length > 0 ? existing[0] : initializeApp(options);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    let rtdb: Database | null = null;
    if (options.databaseURL) {
      try {
        rtdb = getDatabase(app, options.databaseURL);
      } catch {
        rtdb = null;
      }
    }

    cachedServices = {
      app,
      auth,
      firestore,
      rtdb,
      projectId: options.projectId,
      discordProviderId: getDiscordProviderId(),
      isGoogleAuthEnabled: getIsGoogleAuthEnabled(),
    };
    return cachedServices;
  } catch {
    cachedServices = null;
    return null;
  }
}
