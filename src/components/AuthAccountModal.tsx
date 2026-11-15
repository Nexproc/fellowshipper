import {
  CheckCircle2,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  Trash2,
  Unlock,
  UserPlus,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  evaluateMemberPermissions,
  evaluatePartyPermissions,
  type OwnershipContext,
} from '../domain/ownership';
import type { MemberProfile } from '../domain/types';
import type { AuthController } from '../services/authService';

interface AuthAccountModalProps {
  open: boolean;
  onClose: () => void;
  auth: AuthController;
  partyName: string;
  members: readonly MemberProfile[];
  ownershipCtx: OwnershipContext;
  onRenameParty: (nextName: string) => void;
  onClaimPartyOwnership: () => void;
  onPromoteCoOwner: (memberId: string) => void;
  onRelinquishCoOwner: (uid: string) => void;
  onClaimMember: (memberId: string) => void;
  onReleaseMember: (memberId: string) => void;
  onRemoveMember: (memberId: string) => void;
  onToggleAllowLeadLoot: (memberId: string) => void;
}

export function AuthAccountModal({
  open,
  onClose,
  auth,
  partyName,
  members,
  ownershipCtx,
  onRenameParty,
  onClaimPartyOwnership,
  onPromoteCoOwner,
  onRelinquishCoOwner,
  onClaimMember,
  onReleaseMember,
  onRemoveMember,
  onToggleAllowLeadLoot,
}: AuthAccountModalProps) {
  const [nameDraft, setNameDraft] = useState(partyName);

  if (!open) return null;

  const partyPerms = evaluatePartyPermissions(ownershipCtx);
  const ownerUids = partyPerms.ownerUids;

  const ownerLabels = ownerUids.map((uid) => {
    const matchedMember = members.find((m) => m.ownerUid === uid);
    if (matchedMember) {
      return `${matchedMember.displayName}${
        matchedMember.ownerDisplayName &&
        matchedMember.ownerDisplayName !== matchedMember.displayName
          ? ` (${matchedMember.ownerDisplayName})`
          : ''
      }`;
    }
    if (auth.user?.uid === uid) return auth.user.displayName;
    return `Owner (${uid.slice(0, 8)})`;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Party Ownership and Account Settings"
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
              <h2 className="panel-title">Party Ownership &amp; Account</h2>
              <p className="panel-subtitle">
                Manage authenticated party owners, roster slots, and loot permissions
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
                    <div
                      style={{
                        fontWeight: 700,
                        display: 'flex',
                        gap: 6,
                        alignItems: 'center',
                      }}
                    >
                      {auth.user.displayName}
                      <span className="lead-tag" style={{ textTransform: 'uppercase' }}>
                        {auth.user.provider}
                      </span>
                      {partyPerms.isPartyOwner && (
                        <span
                          className="lead-tag"
                          style={{
                            background: 'rgba(16, 185, 129, 0.16)',
                            color: 'var(--jade-400)',
                          }}
                        >
                          Party Owner
                        </span>
                      )}
                    </div>
                    {auth.user.email && (
                      <div
                        className="mono"
                        style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}
                      >
                        {auth.user.email}
                      </div>
                    )}
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
                  Sign in with Discord{auth.isGoogleAuthEnabled ? ' or Google' : ''} to
                  create or claim a party room and bind your character slot.
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    id="btn-login-discord"
                    className="btn"
                    style={{
                      background: '#5865F2',
                      borderColor: '#5865F2',
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                    onClick={() => void auth.signInWithDiscord()}
                  >
                    <KeyRound size={14} /> Sign in with Discord
                  </button>
                  {auth.isGoogleAuthEnabled && (
                    <button
                      type="button"
                      id="btn-login-google"
                      className="btn"
                      onClick={() => void auth.signInWithGoogle()}
                    >
                      <KeyRound size={14} /> Sign in with Google
                    </button>
                  )}
                </div>
              </div>
            )
          ) : null}

          {/* Party Ownership Summary & Rename */}
          <div
            style={{
              padding: 14,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                }}
              >
                Party Ownership (Min 1 Owner Required)
              </div>
              <span className="mono" style={{ fontSize: '0.73rem', color: 'var(--jade-400)' }}>
                {ownerUids.length} {ownerUids.length === 1 ? 'owner' : 'owners'}
              </span>
            </div>

            {partyPerms.canManageParty && members.length > 0 && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="text-input"
                  style={{ flex: 1 }}
                  aria-label="Party Display Name"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Party Name"
                />
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    if (nameDraft.trim()) onRenameParty(nameDraft.trim());
                  }}
                >
                  Save Name
                </button>
              </div>
            )}

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {ownerLabels.length > 0 ? (
                <>
                  Owned by <strong>{ownerLabels.join(', ')}</strong>. At least one owner
                  must remain bound to the party at all times.
                </>
              ) : members.length === 0 ? (
                'Create the party on the main screen to become its initial Party Owner.'
              ) : (
                'This legacy room does not yet have an owner assigned.'
              )}
            </div>

            {partyPerms.canClaimUnownedParty && members.length > 0 && (
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onClaimPartyOwnership}
                >
                  <ShieldCheck size={13} /> Claim Party Ownership
                </button>
              </div>
            )}
          </div>

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
              Roster Slot Bindings ({members.length})
            </div>
            {members.length === 0 ? (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
              >
                No roster members yet. Create the party from the roster banner to add
                your character.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {members.map((m) => {
                  const perms = evaluateMemberPermissions(m, ownershipCtx);
                  const canMakeCoOwner =
                    partyPerms.canAddCoOwner &&
                    Boolean(m.ownerUid) &&
                    !perms.isPartyOwnerSlot;
                  const canStepDownOwner =
                    perms.isOwnedByCurrentUser &&
                    perms.isPartyOwnerSlot &&
                    partyPerms.canRelinquishOwnership &&
                    Boolean(m.ownerUid);

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
                        <div
                          style={{
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            flexWrap: 'wrap',
                          }}
                        >
                          {m.ownerUid ? (
                            <Lock size={13} style={{ color: 'var(--jade-400)' }} />
                          ) : (
                            <Unlock size={13} style={{ color: 'var(--text-muted)' }} />
                          )}
                          {m.displayName}
                          {perms.isOwnedByCurrentUser && auth.isFirebaseConfigured && (
                            <span className="lead-tag">Yours</span>
                          )}
                          {perms.isPartyOwnerSlot && (
                            <span
                              className="lead-tag"
                              style={{
                                background: 'rgba(16, 185, 129, 0.16)',
                                color: 'var(--jade-400)',
                              }}
                            >
                              Owner
                            </span>
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

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexWrap: 'wrap',
                        }}
                      >
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

                        {canMakeCoOwner && (
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="Grant Party Co-Owner permissions to this member"
                            onClick={() => onPromoteCoOwner(m.id)}
                          >
                            <UserPlus size={12} /> Co-Owner
                          </button>
                        )}

                        {canStepDownOwner && m.ownerUid && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            title="Step down as Party Co-Owner (another owner remains)"
                            onClick={() => onRelinquishCoOwner(m.ownerUid!)}
                          >
                            Step Down
                          </button>
                        )}

                        {auth.isFirebaseConfigured && auth.user && !m.ownerUid && (
                          <button
                            type="button"
                            id={`btn-claim-${m.id}`}
                            className="btn btn-primary btn-sm"
                            onClick={() => onClaimMember(m.id)}
                          >
                            <CheckCircle2 size={13} /> Claim
                          </button>
                        )}

                        {auth.isFirebaseConfigured &&
                          perms.canReleaseClaim &&
                          m.ownerUid && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => onReleaseMember(m.id)}
                            >
                              Unbind
                            </button>
                          )}

                        {perms.canRemoveSlot && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            title="Remove roster slot from party"
                            onClick={() => onRemoveMember(m.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
