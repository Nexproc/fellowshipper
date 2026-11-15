import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import type { AuthProviderKind, AuthUserInfo } from '../domain/types';
import { getFirebaseServices } from './firebaseClient';

function mapFirebaseUser(user: User): AuthUserInfo {
  let provider: AuthProviderKind = 'oidc';
  for (const entry of user.providerData) {
    const pid = entry.providerId.toLowerCase();
    if (pid.includes('google')) {
      provider = 'google';
      break;
    }
    if (pid.includes('discord')) {
      provider = 'discord';
      break;
    }
  }
  if (user.isAnonymous) {
    provider = 'anonymous';
  }

  const fallbackName =
    user.displayName ||
    user.providerData.find((p) => p.displayName)?.displayName ||
    user.email?.split('@')[0] ||
    'Party Member';

  return {
    uid: user.uid,
    displayName: fallbackName,
    email: user.email,
    photoUrl: user.photoURL,
    provider,
  };
}

export interface AuthController {
  isFirebaseConfigured: boolean;
  isRuntimeOverride: boolean;
  projectId: string | null;
  user: AuthUserInfo | null;
  authLoading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signOutAccount: () => Promise<void>;
  clearAuthError: () => void;
}

export function useFirebaseAuth(): AuthController {
  const services = getFirebaseServices();
  const [user, setUser] = useState<AuthUserInfo | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(Boolean(services));
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!services) return;
    const unsubscribe = onAuthStateChanged(
      services.auth,
      (fbUser) => {
        setUser(fbUser ? mapFirebaseUser(fbUser) : null);
        setAuthLoading(false);
      },
      (err) => {
        setAuthError(err.message);
        setAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, [services]);

  const signInWithGoogle = useCallback(async () => {
    if (!services) return;
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(services.auth, provider);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-blocked') {
        await signInWithRedirect(services.auth, provider);
        return;
      }
      if (code !== 'auth/popup-closed-by-user') {
        setAuthError(
          (err as Error)?.message ?? 'Google sign-in failed. Check Firebase Auth settings.'
        );
      }
    }
  }, [services]);

  const signInWithDiscord = useCallback(async () => {
    if (!services) return;
    setAuthError(null);
    const provider = new OAuthProvider(services.discordProviderId);
    provider.addScope('openid');
    provider.addScope('identify');
    provider.addScope('email');
    try {
      await signInWithPopup(services.auth, provider);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-blocked') {
        await signInWithRedirect(services.auth, provider);
        return;
      }
      if (code !== 'auth/popup-closed-by-user') {
        setAuthError(
          `Discord sign-in failed (${code || 'error'}). Verify OIDC provider "${services.discordProviderId}" is enabled in GCP Identity Platform.`
        );
      }
    }
  }, [services]);

  const signOutAccount = useCallback(async () => {
    if (!services) return;
    setAuthError(null);
    await signOut(services.auth);
  }, [services]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return {
    isFirebaseConfigured: Boolean(services),
    isRuntimeOverride: services?.isRuntimeOverride ?? false,
    projectId: services?.projectId ?? null,
    user,
    authLoading,
    authError,
    signInWithGoogle,
    signInWithDiscord,
    signOutAccount,
    clearAuthError,
  };
}
