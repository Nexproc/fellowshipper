import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore, type Firestore } from 'firebase/firestore';

const STORAGE_OVERRIDE_KEY = 'fellowshipper:firebaseConfigOverride';

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  rtdb: Database | null;
  projectId: string;
  discordProviderId: string;
  isGoogleAuthEnabled: boolean;
  isRuntimeOverride: boolean;
}

let cachedServices: FirebaseServices | null | undefined;

function parseLooseFirebaseConfig(raw: string): FirebaseOptions | null {
  try {
    // Support either strict JSON or pasted JS object snippets from Firebase Console
    const trimmed = raw.trim();
    const objectMatch = /\{[\s\S]*\}/.exec(trimmed);
    const candidate = objectMatch ? objectMatch[0] : trimmed;
    const jsonNormalized = candidate
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
      .replace(/'/g, '"')
      .replace(/,\s*\}/g, '}');
    const parsed = JSON.parse(jsonNormalized) as Record<string, unknown>;
    if (
      typeof parsed.apiKey === 'string' &&
      typeof parsed.projectId === 'string' &&
      parsed.apiKey.length > 5
    ) {
      return {
        apiKey: parsed.apiKey,
        authDomain:
          typeof parsed.authDomain === 'string'
            ? parsed.authDomain
            : `${parsed.projectId}.firebaseapp.com`,
        projectId: parsed.projectId,
        databaseURL:
          typeof parsed.databaseURL === 'string'
            ? parsed.databaseURL
            : `https://${parsed.projectId}-default-rtdb.firebaseio.com`,
        storageBucket:
          typeof parsed.storageBucket === 'string' ? parsed.storageBucket : undefined,
        messagingSenderId:
          typeof parsed.messagingSenderId === 'string'
            ? parsed.messagingSenderId
            : undefined,
        appId: typeof parsed.appId === 'string' ? parsed.appId : undefined,
      };
    }
  } catch {
    // Invalid config snippet
  }
  return null;
}

function resolveEnvFirebaseConfig(): {
  options: FirebaseOptions;
  isRuntimeOverride: boolean;
} | null {
  if (typeof window !== 'undefined') {
    try {
      const rawOverride = window.localStorage.getItem(STORAGE_OVERRIDE_KEY);
      if (rawOverride) {
        const parsed = parseLooseFirebaseConfig(rawOverride);
        if (parsed) {
          return { options: parsed, isRuntimeOverride: true };
        }
      }
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
    isRuntimeOverride: false,
    options: {
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
    },
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

  const resolved = resolveEnvFirebaseConfig();
  if (!resolved || !resolved.options.projectId) {
    cachedServices = null;
    return null;
  }

  try {
    const existing = getApps();
    const app = existing.length > 0 ? existing[0] : initializeApp(resolved.options);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    let rtdb: Database | null = null;
    if (resolved.options.databaseURL) {
      try {
        rtdb = getDatabase(app, resolved.options.databaseURL);
      } catch {
        rtdb = null;
      }
    }

    cachedServices = {
      app,
      auth,
      firestore,
      rtdb,
      projectId: resolved.options.projectId,
      discordProviderId: getDiscordProviderId(),
      isGoogleAuthEnabled: getIsGoogleAuthEnabled(),
      isRuntimeOverride: resolved.isRuntimeOverride,
    };
    return cachedServices;
  } catch {
    cachedServices = null;
    return null;
  }
}

export function saveRuntimeFirebaseConfigSnippet(rawSnippet: string): {
  ok: boolean;
  error?: string;
} {
  const parsed = parseLooseFirebaseConfig(rawSnippet);
  if (!parsed) {
    return {
      ok: false,
      error:
        'Paste a valid Firebase config object containing at least apiKey and projectId.',
    };
  }
  try {
    window.localStorage.setItem(STORAGE_OVERRIDE_KEY, JSON.stringify(parsed));
    window.location.reload();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Unable to save config to localStorage.' };
  }
}

export function clearRuntimeFirebaseConfigSnippet(): void {
  try {
    window.localStorage.removeItem(STORAGE_OVERRIDE_KEY);
    window.location.reload();
  } catch {
    // Ignore storage errors
  }
}
