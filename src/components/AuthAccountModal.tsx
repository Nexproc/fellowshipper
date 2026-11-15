import {
  CheckCircle2,
  Cloud,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  Unlock,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { evaluateMemberPermissions, type OwnershipContext } from '../domain/ownership';
import type { MemberProfile } from '../domain/types';
import type { AuthController } from '../services/authService';
import {
  clearRuntimeFirebaseConfigSnippet,
  saveRuntimeFirebaseConfigSnippet,
} from '../services/firebaseClient';

interface AuthAccountModalProps {
  open: boolean;
  onClose: () => void;
  auth: AuthController;
  members: readonly MemberProfile[];
  ownershipCtx: OwnershipContext;
  onClaimMember: (memberId: string) => void;
  onReleaseMember: (memberId: string) => void;
  onToggleAllowLeadLoot: (memberId: string) => void;
}

export function AuthAccountModal({
  open,
  onClose,
  auth,
  members,
  ownershipCtx,
  onClaimMember,
  onReleaseMember,
  onToggleAllowLeadLoot,
}: AuthAccountModalProps) {
  const [configSnippet, setConfigSnippet] = useState('');
  const [configError, setConfigError] = useState<string | null>(null);
  const [showPasteBox, setShowPasteBox] = useState(!auth.isFirebaseConfigured);

  if (!open) return null;

  const handleSaveConfig = () => {
    const res = saveRuntimeFirebaseConfigSnippet(configSnippet);
    if (!res.ok) {
      setConfigError(res.error ?? 'Invalid Firebase config.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Party Account and GCP Cloud Settings"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: 'rgba(6, 9, 14, 0.78)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={18} style={{ color: 'var(--amber-400)' }} />
            <div>
              <h2 className="panel-title">Party Login &amp; Character Ownership</h2>
              <p className="panel-subtitle">
                {auth.isFirebaseConfigured
                  ? `Connected to GCP Firebase project: ${auth.projectId}`
                  : 'Local Preview Mode — connect GCP Firebase to enforce Google & Discord logins'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        <div
          className="panel-body"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {auth.authError && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.14)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '0.8rem',
              }}
            >
              {auth.authError}
            </div>
          )}

          {auth.isFirebaseConfigured ? (
            auth.user ? (
              <div
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {auth.user.photoUrl ? (
                    <img
                      src={auth.user.photoUrl}
                      alt=""
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '1px solid var(--border-strong)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--bg-canvas)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                      }}
                    >
                      {auth.user.displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}>
                      {auth.user.displayName}
                      <span className="lead-tag" style={{ textTransform: 'uppercase' }}>
                        {auth.user.provider}
                      </span>
                    </div>
                    <div className="mono" style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                      {auth.user.email ?? `UID: ${auth.user.uid.slice(0, 12)}…`}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-sign-out"
                  className="btn btn-sm"
                  onClick={() => void auth.signOutAccount()}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            ) : (
              <div
                style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Sign in with your Google or Discord account to claim your party slot and
                  manage your characters &amp; BIS gear sets.
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    id="btn-login-google"
                    className="btn btn-primary"
                    onClick={() => void auth.signInWithGoogle()}
                  >
                    <KeyRound size={14} /> Sign in with Google
                  </button>
                  <button
                    type="button"
                    id="btn-login-discord"
                    className="btn"
                    style={{
                      background: '#5865F2',
                      borderColor: '#5865F2',
                      color: '#ffffff',
                    }}
                    onClick={() => void auth.signInWithDiscord()}
                  >
                    Sign in with Discord
                  </button>
                </div>
              </div>
            )
          ) : null}

          {/* Roster Slot Ownership Table */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: 8,
              }}
            >
              4-Player Roster Slot Bindings
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {members.map((m) => {
                const perms = evaluateMemberPermissions(m, ownershipCtx);
                return (
                  <div
                    key={m.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {m.ownerUid ? (
                          <Lock size={13} style={{ color: 'var(--jade-400)' }} />
                        ) : (
                          <Unlock size={13} style={{ color: 'var(--text-muted)' }} />
                        )}
                        {m.displayName}
                        {perms.isOwnedByCurrentUser && auth.isFirebaseConfigured && (
                          <span className="lead-tag">Yours</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {m.ownerUid
                          ? `Bound to ${m.ownerDisplayName ?? 'Player'}${
                              m.ownerProvider ? ` via ${m.ownerProvider}` : ''
                            }`
                          : 'Unclaimed — any signed-in party member can claim'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {perms.isOwnedByCurrentUser && auth.isFirebaseConfigured && (
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: '0.74rem',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                          }}
                          title="Allow whoever is Route Lead to check off BIS drops for you during a dungeon run"
                        >
                          <input
                            type="checkbox"
                            checked={m.allowPartyLeadLootCheck ?? true}
                            onChange={() => onToggleAllowLeadLoot(m.id)}
                          />
                          Lead loot check
                        </label>
                      )}

                      {auth.isFirebaseConfigured && auth.user && !m.ownerUid && (
                        <button
                          type="button"
                          id={`btn-claim-${m.id}`}
                          className="btn btn-primary btn-sm"
                          onClick={() => onClaimMember(m.id)}
                        >
                          <CheckCircle2 size={13} /> Claim {m.displayName}
                        </button>
                      )}

                      {auth.isFirebaseConfigured && perms.canReleaseClaim && m.ownerUid && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => onReleaseMember(m.id)}
                        >
                          Unbind
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Runtime GCP Firebase Config Helper (for instant local connect before CI deploy) */}
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cloud size={14} />
                {auth.isRuntimeOverride
                  ? 'Using browser-saved Firebase config override'
                  : auth.isFirebaseConfigured
                    ? 'Configured via VITE_FIREBASE_* environment variables'
                    : 'Connect a GCP Firebase project right now'}
              </span>
              {auth.isRuntimeOverride ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={clearRuntimeFirebaseConfigSnippet}
                >
                  Clear Override
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowPasteBox((v) => !v)}
                >
                  {showPasteBox ? 'Hide Config' : 'Paste Config'}
                </button>
              )}
            </div>

            {showPasteBox && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  For production builds on Firebase Hosting, set <code>VITE_FIREBASE_*</code> in{' '}
                  <code>.env.local</code> or GitHub Actions secrets (see{' '}
                  <code>FIREBASE_GCP_SETUP.md</code>). To test immediately in this browser, paste
                  your Web App <code>firebaseConfig</code> object below:
                </div>
                <textarea
                  className="text-input mono"
                  rows={5}
                  placeholder={`{\n  apiKey: "AIza...",\n  authDomain: "your-gcp-project.firebaseapp.com",\n  projectId: "your-gcp-project",\n  databaseURL: "https://your-gcp-project-default-rtdb.firebaseio.com",\n  appId: "1:123456:web:abcdef"\n}`}
                  value={configSnippet}
                  onChange={(e) => setConfigSnippet(e.target.value)}
                  style={{ width: '100%', resize: 'vertical', fontSize: '0.75rem' }}
                />
                {configError && (
                  <div style={{ color: '#fca5a5', fontSize: '0.76rem' }}>{configError}</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    id="btn-save-firebase-config"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveConfig}
                  >
                    Connect GCP Firebase
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
