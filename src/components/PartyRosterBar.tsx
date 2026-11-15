import { Crown, Lock, Radio } from 'lucide-react';
import { evaluateMemberPermissions, type OwnershipContext } from '../domain/ownership';
import { resolveActiveCharacter } from '../domain/punchList';
import type { MemberProfile, OnlinePresence } from '../domain/types';

interface PartyRosterBarProps {
  members: readonly MemberProfile[];
  leadMemberId: string;
  myMemberId: string;
  online: readonly OnlinePresence[];
  ownershipCtx: OwnershipContext;
  onToggleInParty: (memberId: string) => void;
  onSelectCharacter: (memberId: string, characterId: string) => void;
  onSetLead: (memberId: string) => void;
}

export function PartyRosterBar({
  members,
  leadMemberId,
  myMemberId,
  online,
  ownershipCtx,
  onToggleInParty,
  onSelectCharacter,
  onSetLead,
}: PartyRosterBarProps) {
  return (
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
                {member.ownerUid && (
                  <span
                    title={`Claimed by ${member.ownerDisplayName ?? member.displayName}${
                      member.ownerProvider ? ` (${member.ownerProvider})` : ''
                    }`}
                    style={{ display: 'inline-flex', color: 'var(--jade-400)' }}
                  >
                    <Lock size={11} />
                  </span>
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
                  const heroLabel = ch.heroId.charAt(0).toUpperCase() + ch.heroId.slice(1);
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
    </section>
  );
}
