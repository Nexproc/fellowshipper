import {
  Check,
  ExternalLink,
  Lock,
  MapPin,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DUNGEONS } from '../domain/catalog';
import {
  clampLevelForLeague,
  computePartyProgressionSummary,
  DIFFICULTY_LEAGUES,
  estimateDungeonClearScore,
  formatDungeonClearLabel,
  maxLevelForLeague,
} from '../domain/dungeonScore';
import {
  evaluateMemberPermissions,
  type OwnershipContext,
} from '../domain/ownership';
import {
  computeEternalSummary,
  computeEternalTargetScore,
  predictEmissaryVariant,
  resolveActiveCharacter,
} from '../domain/punchList';
import type {
  BossVariant,
  DifficultyLeague,
  EternalChecklistRow,
  MemberDungeonClear,
  MemberProfile,
} from '../domain/types';

export interface LogPartyRunInput {
  dungeonSlug: string;
  league: DifficultyLeague;
  level: number;
  timed: boolean;
  score: number;
  /** 'in-party' logs for all permitted active party members; otherwise a single memberId */
  targetScope: 'in-party' | string;
}

interface EternalScoreViewProps {
  members: readonly MemberProfile[];
  ownershipCtx: OwnershipContext;
  checklist: readonly EternalChecklistRow[];
  onUpsertMemberClear: (
    memberId: string,
    dungeonSlug: string,
    clear: MemberDungeonClear | null
  ) => void;
  onLogPartyClear: (input: LogPartyRunInput) => void;
  onToggleFinished: (dungeonSlug: string) => void;
  onUpdateScore: (dungeonSlug: string, score: number) => void;
  onUpdateTargetLevel: (dungeonSlug: string, level: number) => void;
  onSyncRoute: (dungeonSlug: string, variant: BossVariant, level: number) => void;
  onOpenAuthModal: () => void;
}

interface EditingCellState {
  memberId: string;
  dungeonSlug: string;
  league: DifficultyLeague;
  level: number;
  timed: boolean;
  score: number;
  customScore: boolean;
}

export function EternalScoreView({
  members,
  ownershipCtx,
  checklist,
  onUpsertMemberClear,
  onLogPartyClear,
  onToggleFinished,
  onUpdateScore,
  onUpdateTargetLevel,
  onSyncRoute,
  onOpenAuthModal,
}: EternalScoreViewProps) {
  const [seasonOnly, setSeasonOnly] = useState(true);

  // Quick "Log Completed Run" bar state
  const [logTargetScope, setLogTargetScope] = useState<'in-party' | string>(
    'in-party'
  );
  const [logDungeonSlug, setLogDungeonSlug] = useState<string>(
    () => DUNGEONS.find((d) => d.seasonStatus === 'season-2')?.slug ?? DUNGEONS[0].slug
  );
  const [logLeague, setLogLeague] = useState<DifficultyLeague>('Eternal');
  const [logLevel, setLogLevel] = useState<number>(15);
  const [logTimed, setLogTimed] = useState<boolean>(true);
  const [logCustomScore, setLogCustomScore] = useState<number | null>(null);

  // Inline matrix cell editor
  const [editingCell, setEditingCell] = useState<EditingCellState | null>(null);

  const displayedDungeons = useMemo(
    () =>
      seasonOnly
        ? DUNGEONS.filter((d) => d.seasonStatus === 'season-2')
        : DUNGEONS,
    [seasonOnly]
  );

  const partySummary = useMemo(
    () =>
      computePartyProgressionSummary(members, DUNGEONS, {
        seasonOnly,
        goalScore: 10_000,
      }),
    [members, seasonOnly]
  );

  const checklistSummary = useMemo(
    () => computeEternalSummary(checklist, 10_000),
    [checklist]
  );

  const checklistBySlug = useMemo(
    () => new Map(checklist.map((r) => [r.dungeonSlug, r])),
    [checklist]
  );

  const memberSummaryById = useMemo(
    () => new Map(partySummary.memberSummaries.map((s) => [s.memberId, s])),
    [partySummary.memberSummaries]
  );

  const editableMembers = useMemo(
    () =>
      members.filter(
        (m) => evaluateMemberPermissions(m, ownershipCtx).canToggleLootAndParty
      ),
    [members, ownershipCtx]
  );

  const effectiveLogScore =
    logCustomScore ?? estimateDungeonClearScore(logLeague, logLevel, logTimed);

  const handleLogLeagueChange = (nextLeague: DifficultyLeague) => {
    const clamped = clampLevelForLeague(nextLeague, logLevel);
    setLogLeague(nextLeague);
    setLogLevel(clamped);
    setLogCustomScore(null);
  };

  const handleLogLevelChange = (rawLevel: number) => {
    const clamped = clampLevelForLeague(logLeague, rawLevel);
    setLogLevel(clamped);
    setLogCustomScore(null);
  };

  const handleLogTimedChange = (nextTimed: boolean) => {
    setLogTimed(nextTimed);
    setLogCustomScore(null);
  };

  const handleSubmitQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownershipCtx.authEnforced && !ownershipCtx.currentUser) {
      onOpenAuthModal();
      return;
    }
    onLogPartyClear({
      dungeonSlug: logDungeonSlug,
      league: logLeague,
      level: logLevel,
      timed: logTimed,
      score: Math.max(0, Math.round(effectiveLogScore)),
      targetScope: logTargetScope,
    });
  };

  const openCellEditor = (member: MemberProfile, dungeonSlug: string) => {
    const perms = evaluateMemberPermissions(member, ownershipCtx);
    if (!perms.canToggleLootAndParty) {
      if (ownershipCtx.authEnforced && !ownershipCtx.currentUser) {
        onOpenAuthModal();
      }
      return;
    }
    const existing = member.dungeonClears?.[dungeonSlug];
    const defaultRow = checklistBySlug.get(dungeonSlug);
    const initialLeague: DifficultyLeague = existing?.league ?? 'Eternal';
    const initialLevel =
      existing?.level ?? defaultRow?.targetLevel ?? 15;
    const initialTimed = existing?.timed ?? true;
    const initialScore =
      existing?.score ??
      estimateDungeonClearScore(initialLeague, initialLevel, initialTimed);

    setEditingCell({
      memberId: member.id,
      dungeonSlug,
      league: initialLeague,
      level: initialLevel,
      timed: initialTimed,
      score: initialScore,
      customScore: Boolean(
        existing &&
          existing.score !==
            estimateDungeonClearScore(
              existing.league,
              existing.level,
              existing.timed
            )
      ),
    });
  };

  const saveCellEditor = () => {
    if (!editingCell) return;
    onUpsertMemberClear(editingCell.memberId, editingCell.dungeonSlug, {
      dungeonSlug: editingCell.dungeonSlug,
      league: editingCell.league,
      level: clampLevelForLeague(editingCell.league, editingCell.level),
      timed: editingCell.timed,
      score: Math.max(0, Math.round(editingCell.score)),
      updatedAtIso: new Date().toISOString(),
    });
    setEditingCell(null);
  };

  return (
    <section className="panel" aria-label="Party Dungeon Scores and Highest Clears">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            Party Dungeon Score &amp; Highest Cleared Difficulties
          </h2>
          <p className="panel-subtitle">
            Track every party member&apos;s Dungeon Rating and highest cleared tier
            across Contender, Adept, Champion, Paragon, and Eternal — updated
            automatically on live CombatLog clears or logged below.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: 3,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              gap: 3,
            }}
          >
            <button
              type="button"
              id="btn-score-pool-s2"
              className={`btn btn-sm ${seasonOnly ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSeasonOnly(true)}
            >
              Season 2 (11)
            </button>
            <button
              type="button"
              id="btn-score-pool-all"
              className={`btn btn-sm ${!seasonOnly ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSeasonOnly(false)}
            >
              All Maps ({DUNGEONS.length})
            </button>
          </div>

          <div className="room-badge mono">
            <span>Party Avg:</span>
            <strong style={{ color: 'var(--gold-400)' }}>
              {partySummary.averageScore.toLocaleString()} / 10,000
            </strong>
          </div>

          <div className="room-badge mono">
            <span>Party Best:</span>
            <span
              className={`tier-badge ${
                partySummary.partyHighestClear
                  ? `tier-${partySummary.partyHighestClear.league}`
                  : 'tier-none'
              }`}
            >
              {partySummary.partyHighestClear
                ? formatDungeonClearLabel(partySummary.partyHighestClear)
                : 'No Clears'}
            </span>
          </div>

          <div className="room-badge mono" title="Shared 10,000 Eternal Checklist Total">
            <span>10k Plan:</span>
            <strong
              style={{
                color:
                  checklistSummary.pointsRemaining === 0
                    ? 'var(--jade-400)'
                    : 'var(--text-primary)',
              }}
            >
              {checklistSummary.currentTotal.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Per-Member Scoreboard Summary Cards */}
      {members.length === 0 ? (
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-canvas)',
            color: 'var(--text-secondary)',
            fontSize: '0.84rem',
          }}
        >
          Create or join the party above to track each member&apos;s Dungeon Score
          and highest cleared difficulties across all dungeons.
        </div>
      ) : (
        <div className="score-cards-grid">
          {members.map((member) => {
            const summary = memberSummaryById.get(member.id);
            const resolved = resolveActiveCharacter(member);
            const perms = evaluateMemberPermissions(member, ownershipCtx);
            if (!summary) return null;

            return (
              <article
                key={member.id}
                id={`score-summary-card-${member.id}`}
                className="score-member-card"
                style={{ opacity: member.inParty ? 1 : 0.65 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      minWidth: 0,
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                      }}
                    >
                      {member.displayName}
                    </strong>
                    {resolved && (
                      <span className={`role-tag role-${resolved.hero.role}`}>
                        {resolved.hero.name}
                      </span>
                    )}
                    {!perms.canToggleLootAndParty && ownershipCtx.authEnforced && (
                      <span
                        title={perms.lockReason ?? 'View-only'}
                        style={{ color: 'var(--text-muted)', display: 'inline-flex' }}
                      >
                        <Lock size={11} />
                      </span>
                    )}
                  </div>

                  <span
                    className={`tier-badge ${
                      summary.highestClear
                        ? `tier-${summary.highestClear.league}`
                        : 'tier-none'
                    }`}
                    title="Highest cleared difficulty across dungeons"
                  >
                    {summary.highestClear
                      ? formatDungeonClearLabel(summary.highestClear)
                      : 'No Clears'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    <Trophy
                      size={14}
                      style={{
                        color: 'var(--gold-400)',
                        verticalAlign: '-2px',
                        marginRight: 5,
                      }}
                    />
                    <span style={{ color: 'var(--gold-400)' }}>
                      {summary.totalScore.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                      }}
                    >
                      {' '}
                      / 10,000 ({summary.progressPct}%)
                    </span>
                  </div>
                  <span
                    className="mono"
                    style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}
                  >
                    {summary.clearedCount}/{summary.totalDungeons} maps
                    {summary.timedCount > 0 ? ` · ${summary.timedCount}★` : ''}
                  </span>
                </div>

                <div className="score-progress-track" aria-hidden="true">
                  <div
                    className="score-progress-fill"
                    style={{ width: `${summary.progressPct}%` }}
                  />
                </div>

                {summary.lowestDungeon && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.74rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Lowest:{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {summary.lowestDungeon.dungeon.name}
                      </strong>{' '}
                      <span className="mono" style={{ color: 'var(--text-muted)' }}>
                        ({summary.lowestDungeon.currentScore} pts)
                      </span>
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.71rem' }}
                      onClick={() => {
                        const d = summary.lowestDungeon!.dungeon;
                        const row = checklistBySlug.get(d.slug);
                        const lvl = row?.targetLevel ?? 15;
                        const variant =
                          row?.bossVariant ?? predictEmissaryVariant(d, lvl);
                        onSyncRoute(d.slug, variant, lvl);
                      }}
                    >
                      <MapPin size={11} /> Route
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Quick Party Run Logger Bar */}
      {members.length > 0 && (
        <form className="log-run-bar" onSubmit={handleSubmitQuickLog}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: '0.73rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--gold-400)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Sparkles size={13} /> Log Clear:
            </span>

            <select
              id="select-log-scope"
              aria-label="Who cleared the dungeon"
              className="select-control"
              value={logTargetScope}
              onChange={(e) => setLogTargetScope(e.target.value)}
            >
              <option value="in-party">
                Active Party ({members.filter((m) => m.inParty).length || members.length}{' '}
                players)
              </option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  Only {m.displayName}
                </option>
              ))}
            </select>

            <select
              id="select-log-dungeon"
              aria-label="Cleared Dungeon"
              className="select-control"
              value={logDungeonSlug}
              onChange={(e) => setLogDungeonSlug(e.target.value)}
            >
              {DUNGEONS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                  {d.seasonStatus === 'legacy-s1' ? ' (Legacy S1)' : ''}
                </option>
              ))}
            </select>

            <select
              id="select-log-league"
              aria-label="Difficulty League"
              className="select-control"
              value={logLeague}
              onChange={(e) =>
                handleLogLeagueChange(e.target.value as DifficultyLeague)
              }
            >
              {DIFFICULTY_LEAGUES.map((lg) => (
                <option key={lg} value={lg}>
                  {lg}
                </option>
              ))}
            </select>

            <input
              id="input-log-level"
              aria-label="Difficulty Level"
              type="number"
              min={1}
              max={maxLevelForLeague(logLeague)}
              className="select-control mono"
              style={{ width: 64 }}
              value={logLevel}
              onChange={(e) =>
                handleLogLevelChange(Number.parseInt(e.target.value || '1', 10))
              }
            />

            <label className="party-toggle" title="Completed within dungeon timer">
              <input
                id="toggle-log-timed"
                type="checkbox"
                checked={logTimed}
                onChange={(e) => handleLogTimedChange(e.target.checked)}
              />
              <span>Timed ★</span>
            </label>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Score
              </span>
              <input
                id="input-log-score"
                aria-label="Dungeon Score Earned"
                type="number"
                min={0}
                max={2500}
                className="select-control mono"
                style={{ width: 78 }}
                value={effectiveLogScore}
                onChange={(e) =>
                  setLogCustomScore(
                    Math.max(0, Number.parseInt(e.target.value || '0', 10))
                  )
                }
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {partySummary.recommendedNextDungeon && (
              <span
                style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}
                title="Dungeon with the lowest average score across active party members"
              >
                Biggest Party Gain:{' '}
                <strong style={{ color: 'var(--jade-400)' }}>
                  {partySummary.recommendedNextDungeon.dungeon.name}
                </strong>{' '}
                <span className="mono">
                  (avg {partySummary.recommendedNextDungeon.averageScore} pts)
                </span>
              </span>
            )}
            <button
              type="submit"
              id="btn-submit-party-clear"
              className="btn btn-primary btn-sm"
              disabled={editableMembers.length === 0 && ownershipCtx.authEnforced}
            >
              <PlusCircle size={13} /> Record Clear
            </button>
          </div>
        </form>
      )}

      {/* Per-Dungeon × Party Member Progression Matrix */}
      <div style={{ overflowX: 'auto' }}>
        <table className="eternal-table">
          <thead>
            <tr>
              <th>Dungeon</th>
              {members.map((member) => {
                const s = memberSummaryById.get(member.id);
                return (
                  <th key={member.id}>
                    <div>{member.displayName}</div>
                    {s && (
                      <div
                        className="mono"
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--gold-400)',
                          textTransform: 'none',
                          marginTop: 2,
                        }}
                      >
                        {s.totalScore.toLocaleString()} pts
                      </div>
                    )}
                  </th>
                );
              })}
              <th>10k Target &amp; Emissary</th>
              <th>Party Best / Goal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedDungeons.map((dungeon) => {
              const row = checklistBySlug.get(dungeon.slug);
              const targetLevel = row?.targetLevel ?? 15;
              const bossVariant =
                row?.bossVariant ?? predictEmissaryVariant(dungeon, targetLevel);
              const targetScore = computeEternalTargetScore(targetLevel);

              const memberClearsForDungeon = members
                .map((m) => m.dungeonClears?.[dungeon.slug])
                .filter((c): c is MemberDungeonClear => Boolean(c));
              const highestMemberScoreOnMap =
                memberClearsForDungeon.length > 0
                  ? Math.max(...memberClearsForDungeon.map((c) => c.score))
                  : 0;
              const effectiveCurrentScore = Math.max(
                row?.currentScore ?? 0,
                highestMemberScoreOnMap
              );
              const delta = targetScore - effectiveCurrentScore;
              const isRecommendedGain =
                partySummary.recommendedNextDungeon?.dungeon.slug ===
                dungeon.slug;

              return (
                <tr key={dungeon.slug}>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      <strong>{dungeon.name}</strong>
                      <span
                        className={`s2-pool-badge ${
                          dungeon.seasonStatus === 'season-2'
                            ? 'is-s2'
                            : 'is-legacy'
                        }`}
                      >
                        {dungeon.seasonStatus === 'season-2' ? 'S2' : 'S1'}
                      </span>
                      {isRecommendedGain && members.length > 0 && (
                        <span
                          className="lead-tag"
                          title="Lowest average score across active party members"
                        >
                          TOP GAIN
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        marginTop: 2,
                      }}
                    >
                      {dungeon.category}
                      {row?.notes ? ` · ${row.notes}` : ''}
                    </div>
                  </td>

                  {members.map((member) => {
                    const clear = member.dungeonClears?.[dungeon.slug] ?? null;
                    const perms = evaluateMemberPermissions(member, ownershipCtx);
                    const summary = memberSummaryById.get(member.id);
                    const isLowestForMember =
                      Boolean(summary && summary.clearedCount > 0) &&
                      summary?.lowestDungeon?.dungeon.slug === dungeon.slug;
                    const isEditing =
                      editingCell?.memberId === member.id &&
                      editingCell?.dungeonSlug === dungeon.slug;

                    return (
                      <td key={member.id} className="member-clear-cell">
                        {isEditing && editingCell ? (
                          <div className="member-clear-editor">
                            <div style={{ display: 'flex', gap: 4 }}>
                              <select
                                aria-label={`${member.displayName} ${dungeon.name} league`}
                                className="select-control"
                                style={{ flex: 1, padding: '4px 6px', fontSize: '0.76rem' }}
                                value={editingCell.league}
                                onChange={(e) => {
                                  const nextLeague =
                                    e.target.value as DifficultyLeague;
                                  const nextLevel = clampLevelForLeague(
                                    nextLeague,
                                    editingCell.level
                                  );
                                  setEditingCell({
                                    ...editingCell,
                                    league: nextLeague,
                                    level: nextLevel,
                                    score: editingCell.customScore
                                      ? editingCell.score
                                      : estimateDungeonClearScore(
                                          nextLeague,
                                          nextLevel,
                                          editingCell.timed
                                        ),
                                  });
                                }}
                              >
                                {DIFFICULTY_LEAGUES.map((lg) => (
                                  <option key={lg} value={lg}>
                                    {lg}
                                  </option>
                                ))}
                              </select>
                              <input
                                aria-label={`${member.displayName} ${dungeon.name} level`}
                                type="number"
                                min={1}
                                max={maxLevelForLeague(editingCell.league)}
                                className="select-control mono"
                                style={{
                                  width: 54,
                                  padding: '4px 6px',
                                  fontSize: '0.76rem',
                                }}
                                value={editingCell.level}
                                onChange={(e) => {
                                  const nextLevel = clampLevelForLeague(
                                    editingCell.league,
                                    Number.parseInt(e.target.value || '1', 10)
                                  );
                                  setEditingCell({
                                    ...editingCell,
                                    level: nextLevel,
                                    score: editingCell.customScore
                                      ? editingCell.score
                                      : estimateDungeonClearScore(
                                          editingCell.league,
                                          nextLevel,
                                          editingCell.timed
                                        ),
                                  });
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 6,
                              }}
                            >
                              <label
                                className="party-toggle"
                                style={{ fontSize: '0.72rem' }}
                              >
                                <input
                                  type="checkbox"
                                  checked={editingCell.timed}
                                  onChange={(e) => {
                                    const nextTimed = e.target.checked;
                                    setEditingCell({
                                      ...editingCell,
                                      timed: nextTimed,
                                      score: editingCell.customScore
                                        ? editingCell.score
                                        : estimateDungeonClearScore(
                                            editingCell.league,
                                            editingCell.level,
                                            nextTimed
                                          ),
                                    });
                                  }}
                                />
                                <span>Timed ★</span>
                              </label>

                              <input
                                aria-label={`${member.displayName} ${dungeon.name} score`}
                                type="number"
                                min={0}
                                max={2500}
                                className="select-control mono"
                                style={{
                                  width: 68,
                                  padding: '4px 6px',
                                  fontSize: '0.76rem',
                                }}
                                value={editingCell.score}
                                onChange={(e) =>
                                  setEditingCell({
                                    ...editingCell,
                                    score: Math.max(
                                      0,
                                      Number.parseInt(e.target.value || '0', 10)
                                    ),
                                    customScore: true,
                                  })
                                }
                              />
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: 4,
                              }}
                            >
                              {clear ? (
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  style={{ padding: '3px 6px', fontSize: '0.71rem' }}
                                  title="Clear recorded run"
                                  onClick={() => {
                                    onUpsertMemberClear(
                                      member.id,
                                      dungeon.slug,
                                      null
                                    );
                                    setEditingCell(null);
                                  }}
                                >
                                  <RotateCcw size={11} /> Clear
                                </button>
                              ) : (
                                <span />
                              )}
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  style={{ padding: '3px 6px' }}
                                  onClick={() => setEditingCell(null)}
                                  title="Cancel"
                                >
                                  <X size={12} />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                  onClick={saveCellEditor}
                                >
                                  <Check size={12} /> Save
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            id={`cell-clear-${member.id}-${dungeon.slug}`}
                            className={`member-clear-btn ${
                              isLowestForMember ? 'is-lowest-map' : ''
                            }`}
                            disabled={
                              !perms.canToggleLootAndParty &&
                              ownershipCtx.authEnforced &&
                              Boolean(ownershipCtx.currentUser)
                            }
                            title={
                              perms.canToggleLootAndParty || !ownershipCtx.authEnforced
                                ? `Click to edit ${member.displayName}'s ${dungeon.name} clear & score`
                                : (perms.lockReason ?? undefined)
                            }
                            onClick={() => openCellEditor(member, dungeon.slug)}
                          >
                            <span
                              className={`tier-badge ${
                                clear ? `tier-${clear.league}` : 'tier-none'
                              }`}
                            >
                              {formatDungeonClearLabel(clear)}
                            </span>
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.72rem',
                              }}
                            >
                              <span
                                className="mono"
                                style={{
                                  color: clear
                                    ? 'var(--text-primary)'
                                    : 'var(--text-muted)',
                                  fontWeight: clear ? 600 : 400,
                                }}
                              >
                                {clear ? `${clear.score} pts` : '0 pts'}
                              </span>
                              {isLowestForMember && (
                                <span
                                  style={{
                                    fontSize: '0.66rem',
                                    color: 'var(--gold-400)',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                >
                                  LOW
                                </span>
                              )}
                            </div>
                          </button>
                        )}
                      </td>
                    );
                  })}

                  <td>
                    {row ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexWrap: 'wrap',
                        }}
                      >
                        <input
                          type="number"
                          min={1}
                          max={60}
                          aria-label={`${dungeon.name} target Eternal level`}
                          className="select-control mono"
                          style={{ width: 58, padding: '4px 6px' }}
                          value={row.targetLevel}
                          onChange={(e) =>
                            onUpdateTargetLevel(
                              dungeon.slug,
                              Math.max(
                                1,
                                Number.parseInt(e.target.value || '1', 10)
                              )
                            )
                          }
                        />
                        <span className="variant-chip">{row.bossVariant}</span>
                      </div>
                    ) : (
                      <span className="variant-chip">{bossVariant}</span>
                    )}
                  </td>

                  <td>
                    {row ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          flexWrap: 'wrap',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={row.finished}
                          title="Mark 10k target complete for party"
                          onChange={() => onToggleFinished(dungeon.slug)}
                        />
                        <input
                          type="number"
                          min={0}
                          max={2500}
                          aria-label={`${dungeon.name} party checklist score`}
                          className="select-control mono"
                          style={{ width: 72, padding: '4px 6px' }}
                          value={effectiveCurrentScore}
                          onChange={(e) =>
                            onUpdateScore(
                              dungeon.slug,
                              Math.max(
                                0,
                                Number.parseInt(e.target.value || '0', 10)
                              )
                            )
                          }
                        />
                        <span
                          className="mono"
                          style={{
                            fontSize: '0.73rem',
                            color:
                              delta > 0
                                ? 'var(--jade-400)'
                                : 'var(--text-muted)',
                          }}
                        >
                          {delta > 0 ? `+${delta}` : 'Met'}
                        </span>
                      </div>
                    ) : (
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {highestMemberScoreOnMap > 0
                          ? `${highestMemberScoreOnMap} pts`
                          : '—'}
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {dungeon.seasonStatus === 'season-2' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            onSyncRoute(dungeon.slug, bossVariant, targetLevel)
                          }
                        >
                          <MapPin size={12} /> Sync
                        </button>
                      )}
                      {row?.methodUrl && (
                        <a
                          href={row.methodUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm"
                        >
                          Method <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
