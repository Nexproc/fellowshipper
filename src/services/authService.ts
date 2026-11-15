import {
  GoogleAuthProvider,
  OAuthProvider,
  getAdditionalUserInfo,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import type { AuthProviderKind, AuthUserInfo } from '../domain/types';
import { getFirebaseServices } from './firebaseClient';

function mapFirebaseUser(
  user: User,
  overrideName?: string | null,
  overridePhoto?: string | null
): AuthUserInfo {
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
    overrideName ||
    user.displayName ||
    user.providerData.find((p) => p.displayName)?.displayName ||
    user.email?.split('@')[0] ||
    'Party Member';

  return {
    uid: user.uid,
    displayName: fallbackName,
    email: user.email,
    photoUrl: overridePhoto || user.photoURL,
    provider,
  };
}

async function hydrateOidcProfile(
  cred: UserCredential | null,
  onHydrated: (info: AuthUserInfo) => void
): Promise<void> {
  if (!cred) return;
  const info = getAdditionalUserInfo(cred);
  const profile = (info?.profile ?? {}) as Record<string, unknown>;
  const candidateName = [
    profile.global_name,
    profile.preferred_username,
    profile.name,
    profile.username,
  ].find((v): v is string => typeof v === 'string' && v.trim().length > 0);
  const candidatePhoto =
    typeof profile.picture === 'string' && profile.picture.startsWith('http')
      ? profile.picture
      : null;

  const needsName = !cred.user.displayName && Boolean(candidateName);
  const needsPhoto = !cred.user.photoURL && Boolean(candidatePhoto);
  if (needsName || needsPhoto) {
    try {
      await updateProfile(cred.user, {
        displayName: cred.user.displayName || candidateName || undefined,
        photoURL: cred.user.photoURL || candidatePhoto || undefined,
      });
    } catch {
      // Ignore profile update failure
    }
    onHydrated(mapFirebaseUser(cred.user, candidateName, candidatePhoto));
  }
}

export interface AuthController {
  isFirebaseConfigured: boolean;
  isGoogleAuthEnabled: boolean;
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
    void getRedirectResult(services.auth)
      .then((cred) => hydrateOidcProfile(cred, setUser))
      .catch((err: { code?: string; message?: string }) => {
        const code = err?.code ?? '';
        if (code && code !== 'auth/popup-closed-by-user') {
          setAuthError('Sign-in could not complete. Please try again.');
        }
      });

    const unsubscribe = onAuthStateChanged(
      services.auth,
      (fbUser) => {
        setUser(fbUser ? mapFirebaseUser(fbUser) : null);
        setAuthLoading(false);
      },
      () => {
        setAuthError('Unable to verify sign-in session. Please try again.');
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
      const cred = await signInWithPopup(services.auth, provider);
      await hydrateOidcProfile(cred, setUser);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        await signInWithRedirect(services.auth, provider);
        return;
      }
      if (code === 'auth/operation-not-allowed') {
        setAuthError('Google sign-in is not enabled for this room. Please sign in with Discord.');
        return;
      }
      if (code !== 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in could not complete. Please try again.');
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
      const cred = await signInWithPopup(services.auth, provider);
      await hydrateOidcProfile(cred, setUser);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        await signInWithRedirect(services.auth, provider);
        return;
      }
      if (code !== 'auth/popup-closed-by-user') {
        setAuthError('Discord sign-in could not complete. Please try again.');
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
    isGoogleAuthEnabled: services?.isGoogleAuthEnabled ?? true,
    user,
    authLoading,
    authError,
    signInWithGoogle,
    signInWithDiscord,
    signOutAccount,
    clearAuthError,
  };
}
