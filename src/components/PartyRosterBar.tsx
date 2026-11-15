import {
  Crown,
  KeyRound,
  Lock,
  Plus,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { HEROES } from '../domain/catalog';
import {
  evaluateMemberPermissions,
  evaluatePartyPermissions,
  resolveMemberIdForUser,
  type OwnershipContext,
} from '../domain/ownership';
import { resolveActiveCharacter } from '../domain/punchList';
import type { HeroId, MemberProfile, OnlinePresence } from '../domain/types';
import type { AuthController } from '../services/authService';

interface PartyRosterBarProps {
  roomId: string;
  partyName: string;
  members: readonly MemberProfile[];
  leadMemberId: string;
  myMemberId: string;
  online: readonly OnlinePresence[];
  ownershipCtx: OwnershipContext;
  auth: AuthController;
  onCreateParty: (input: {
    partyName: string;
    displayName: string;
    heroId: HeroId;
  }) => void;
  onClaimUnownedParty: () => void;
  onJoinParty: (displayName: string, heroId: HeroId) => void;
  onOpenAuthModal: () => void;
  onToggleInParty: (memberId: string) => void;
  onSelectCharacter: (memberId: string, characterId: string) => void;
  onSetLead: (memberId: string) => void;
}

export function PartyRosterBar({
  roomId,
  partyName,
  members,
  leadMemberId,
  myMemberId,
  online,
  ownershipCtx,
  auth,
  onCreateParty,
  onClaimUnownedParty,
  onJoinParty,
  onOpenAuthModal,
  onToggleInParty,
  onSelectCharacter,
  onSetLead,
}: PartyRosterBarProps) {
  const [draftPartyName, setDraftPartyName] = useState(partyName);
  const [draftDisplayName, setDraftDisplayName] = useState(
    auth.user?.displayName ?? ''
  );
  const [draftHeroId, setDraftHeroId] = useState<HeroId>('helena');

  const [joinName, setJoinName] = useState('');
  const [joinHeroId, setJoinHeroId] = useState<HeroId>('sylvie');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const partyPerms = evaluatePartyPermissions(ownershipCtx);
  const currentUsersSlotId = resolveMemberIdForUser(members, auth.user?.uid);

  if (members.length === 0) {
    const effectiveName = draftDisplayName || auth.user?.displayName || '';
    return (
      <section
        className="panel"
        aria-label="Create Owned Party Room"
        style={{
          border: '1px solid var(--border-strong)',
          background:
            'linear-gradient(135deg, rgba(245, 180, 60, 0.07), rgba(16, 24, 36, 0.96))',
        }}
      >
        <div
          className="panel-body"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.73rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--gold-400)',
                marginBottom: 4,
              }}
            >
              <Sparkles size={13} /> New Party Room · {roomId}
            </div>
            <h2 className="panel-title" style={{ fontSize: '1.12rem' }}>
              Create &amp; Own This Party
            </h2>
            <p className="panel-subtitle" style={{ marginTop: 4 }}>
              Every party is owned by at least one authenticated member and starts with a
              clean Season 2 roster and 0-point Eternal tracker. Create the party to add
              your first hero, then share the Invite link with your group.
            </p>
          </div>

          {auth.isFirebaseConfigured && !auth.user ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                id="btn-create-party-discord"
                className="btn"
                style={{
                  background: '#5865F2',
                  borderColor: '#5865F2',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
                onClick={() => void auth.signInWithDiscord()}
              >
                <KeyRound size={14} /> Sign in with Discord to Create Party
              </button>
              {auth.isGoogleAuthEnabled && (
                <button
                  type="button"
                  id="btn-create-party-google"
                  className="btn"
                  onClick={() => void auth.signInWithGoogle()}
                >
                  <KeyRound size={14} /> Sign in with Google
                </button>
              )}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const chosenName =
                  effectiveName.trim() || auth.user?.displayName || 'Leader';
                onCreateParty({
                  partyName: draftPartyName.trim() || partyName,
                  displayName: chosenName,
                  heroId: draftHeroId,
                });
              }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <input
                id="input-create-party-name"
                aria-label="Party Name"
                className="text-input"
                style={{ width: 170 }}
                placeholder="Party Name"
                value={draftPartyName}
                onChange={(e) => setDraftPartyName(e.target.value)}
              />
              <input
                id="input-create-member-name"
                aria-label="Your Display Name"
                className="text-input"
                style={{ width: 155 }}
                placeholder="Your Name"
                value={effectiveName}
                onChange={(e) => setDraftDisplayName(e.target.value)}
              />
              <select
                id="select-create-hero"
                aria-label="Starting Hero"
                className="select-control"
                value={draftHeroId}
                onChange={(e) => setDraftHeroId(e.target.value as HeroId)}
              >
                {HEROES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.role})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                id="btn-create-owned-party"
                className="btn btn-primary"
              >
                <ShieldCheck size={14} /> Create Party as Owner
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }

  const showJoinCard =
    members.length < 4 &&
    (!ownershipCtx.authEnforced || !auth.user || currentUsersSlotId === null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {!partyPerms.hasPartyOwner && (
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 180, 60, 0.12)',
            border: '1px solid rgba(245, 180, 60, 0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={16} style={{ color: 'var(--gold-400)', flexShrink: 0 }} />
            <span>
              <strong>Unowned Legacy Party:</strong> Every party must have at least one
              assigned Party Owner. Claim ownership to manage the roster and co-owners.
            </span>
          </div>
          {auth.isFirebaseConfigured && !auth.user ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenAuthModal}
            >
              <KeyRound size={13} /> Sign In to Claim Party
            </button>
          ) : (
            <button
              type="button"
              id="btn-claim-party-ownership"
              className="btn btn-primary btn-sm"
              onClick={onClaimUnownedParty}
            >
              <ShieldCheck size={13} /> Claim Party Ownership
            </button>
          )}
        </div>
      )}

      <section className="party-strip" aria-label="Active 4-Player Party Roster">
        {members.map((member) => {
          const resolved = resolveActiveCharacter(member);
          const perms = evaluateMemberPermissions(member, ownershipCtx);
          const memberPeers = online.filter((p) => p.memberId === member.id);
          const isOnline = memberPeers.length > 0;
          const isStreamingLogs = memberPeers.some((p) => p.isWatchingLogs);
          const isLead = leadMemberId === member.id;
          const unacquiredCount =
            resolved?.bisSet.items.filter(
              (i) => !i.acquired && i.dungeonSlug !== 'any-dungeon'
            ).length ?? 0;

          return (
            <article
              key={member.id}
              id={`party-card-${member.id}`}
              className={`member-slot ${member.inParty ? '' : 'is-benched'}`}
            >
              <div className="member-slot-header">
                <div className="member-identity">
                  <span
                    className={`status-dot ${isOnline ? 'is-online' : ''}`}
                    title={isOnline ? 'Online in room' : 'Offline'}
                  />
                  <span className="member-name">
                    {member.displayName}
                    {member.id === myMemberId ? ' (You)' : ''}
                  </span>
                  {perms.isPartyOwnerSlot ? (
                    <span
                      className="lead-tag"
                      title={`Party Owner (${member.ownerDisplayName ?? member.displayName})`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        background: 'rgba(16, 185, 129, 0.16)',
                        color: 'var(--jade-400)',
                      }}
                    >
                      <ShieldCheck size={10} /> OWNER
                    </span>
                  ) : (
                    member.ownerUid && (
                      <span
                        title={`Claimed by ${member.ownerDisplayName ?? member.displayName}${
                          member.ownerProvider ? ` (${member.ownerProvider})` : ''
                        }`}
                        style={{ display: 'inline-flex', color: 'var(--jade-400)' }}
                      >
                        <Lock size={11} />
                      </span>
                    )
                  )}
                  {resolved && (
                    <span className={`role-tag role-${resolved.hero.role}`}>
                      {resolved.hero.role}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isStreamingLogs && (
                    <span className="lead-tag" title="Streaming live CombatLogs">
                      <Radio size={11} style={{ verticalAlign: '-1px', marginRight: 3 }} />
                      LIVE LOG
                    </span>
                  )}
                  {isLead ? (
                    <span className="lead-tag" title="Current Route Lead">
                      <Crown size={11} style={{ verticalAlign: '-1px', marginRight: 3 }} />
                      LEAD
                    </span>
                  ) : (
                    <button
                      type="button"
                      id={`btn-make-lead-${member.id}`}
                      className="btn btn-ghost btn-sm"
                      onClick={() => onSetLead(member.id)}
                      title="Promote to Route Lead"
                    >
                      Set Lead
                    </button>
                  )}
                </div>
              </div>

              <div className="member-slot-controls">
                <select
                  id={`select-char-${member.id}`}
                  aria-label={`${member.displayName} active character`}
                  className="select-control"
                  style={{ flex: 1, minWidth: 0 }}
                  disabled={!perms.canEditBuilds && ownershipCtx.authEnforced}
                  title={perms.lockReason ?? undefined}
                  value={resolved?.character.id ?? ''}
                  onChange={(e) => onSelectCharacter(member.id, e.target.value)}
                >
                  {member.characters.map((ch) => {
                    const heroLabel =
                      ch.heroId.charAt(0).toUpperCase() + ch.heroId.slice(1);
                    return (
                      <option key={ch.id} value={ch.id}>
                        {heroLabel}
                        {ch.title ? ` · ${ch.title}` : ''}
                      </option>
                    );
                  })}
                </select>

                <label className="party-toggle">
                  <input
                    id={`toggle-in-party-${member.id}`}
                    type="checkbox"
                    disabled={!perms.canToggleLootAndParty && ownershipCtx.authEnforced}
                    checked={member.inParty}
                    onChange={() => onToggleInParty(member.id)}
                  />
                  <span>In Party</span>
                </label>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>{resolved?.bisSet.name ?? 'No BIS set'}</span>
                <span className="mono" style={{ color: 'var(--text-secondary)' }}>
                  {unacquiredCount} dungeon drops left
                </span>
              </div>
            </article>
          );
        })}

        {showJoinCard && (
          <article
            className="member-slot"
            style={{
              borderStyle: 'dashed',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {auth.isFirebaseConfigured && !auth.user ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Open Party Slot ({4 - members.length} remaining)
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onOpenAuthModal}
                >
                  <KeyRound size={13} /> Sign In to Join Party
                </button>
              </div>
            ) : !showJoinForm ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                    Open Party Slot
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Add a player to {partyName}
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-join-party-slot"
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setJoinName(auth.user?.displayName ?? '');
                    setShowJoinForm(true);
                  }}
                >
                  <Plus size={13} /> Join
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleaned =
                    joinName.trim() || auth.user?.displayName || 'Player';
                  onJoinParty(cleaned, joinHeroId);
                  setJoinName('');
                  setShowJoinForm(false);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    className="text-input"
                    style={{ flex: 1, minWidth: 0, padding: '5px 8px' }}
                    placeholder="Display Name"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                  />
                  <select
                    className="select-control"
                    style={{ padding: '5px 8px' }}
                    value={joinHeroId}
                    onChange={(e) => setJoinHeroId(e.target.value as HeroId)}
                  >
                    {HEROES.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowJoinForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Add Hero
                  </button>
                </div>
              </form>
            )}
          </article>
        )}
      </section>
    </div>
  );
}
