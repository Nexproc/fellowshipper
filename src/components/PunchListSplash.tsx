import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderSearch,
  MapPin,
  Play,
  Square,
  Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
  formatDurationSeconds,
  predictEmissaryVariant,
  type PunchListSummary,
} from '../domain/punchList';
import type {
  BossVariant,
  DungeonDefinition,
  LiveRunState,
  MapPing,
  PullNode,
  RoutePlan,
} from '../domain/types';
import type { LogWatcherController } from '../services/combatLogWatcher';
import { MethodRouteEmbed, type PlannerSyncPayload } from './MethodRouteEmbed';

interface PunchListSplashProps {
  punch: PunchListSummary;
  activeDungeon: DungeonDefinition;
  activeRoute: RoutePlan | null;
  activeRouteR5?: string | null;
  activeRoutePulls?: readonly PullNode[] | null;
  activeVariant: BossVariant;
  activePullIndex: number;
  plannedEternalLevel: number;
  liveRun: LiveRunState;
  pings: readonly MapPing[];
  watcher: LogWatcherController;
  onSyncDungeonRoute: (dungeonSlug: string, variant?: BossVariant) => void;
  onToggleItemAcquired: (
    memberId: string,
    characterId: string,
    bisSetId: string,
    itemId: string
  ) => void;
  onSelectPull: (index: number) => void;
  onPingMap: (x: number, y: number, label: string) => void;
  onPlannerStateChange?: (payload: PlannerSyncPayload) => void;
  onSaveEditedRoute?: (payload: {
    label: string;
    r5Code: string;
    pulls: PullNode[];
    shareUrl: string;
  }) => void;
  onOpenFullRoutes: () => void;
}

export function PunchListSplash({
  punch,
  activeDungeon,
  activeRoute,
  activeRouteR5,
  activeRoutePulls,
  activeVariant,
  activePullIndex,
  plannedEternalLevel,
  liveRun,
  pings,
  watcher,
  onSyncDungeonRoute,
  onToggleItemAcquired,
  onSelectPull,
  onPingMap,
  onPlannerStateChange,
  onSaveEditedRoute,
  onOpenFullRoutes,
}: PunchListSplashProps) {
  const [expandedSlugs, setExpandedSlugs] = useState<Record<string, boolean>>(() => {
    const firstS2 = punch.rows.find(
      (r) => r.dungeon.seasonStatus === 'season-2' && r.totalNeeded > 0
    )?.dungeon.slug;
    const fallback = punch.topPriorityDungeon?.dungeon.slug;
    const key = firstS2 ?? fallback;
    return key ? { [key]: true } : {};
  });
  const [showZeroDungeons, setShowZeroDungeons] = useState(false);
  const [season2Only, setSeason2Only] = useState(false);
  const [showAnyDungeon, setShowAnyDungeon] = useState(false);
  const [focusRequestTick, setFocusRequestTick] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleExpand = (slug: string) => {
    setExpandedSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const visibleRows = punch.rows.filter((r) => {
    if (season2Only && r.dungeon.seasonStatus !== 'season-2') return false;
    if (!showZeroDungeons && r.totalNeeded === 0 && r.totalAcquired === 0) {
      return false;
    }
    return true;
  });

  const pulls =
    (activeRoutePulls && activeRoutePulls.length > 0
      ? activeRoutePulls
      : activeRoute?.pulls) ?? activeDungeon.defaultPulls;

  const currentPull =
    pulls[Math.max(0, Math.min(pulls.length - 1, activePullIndex - 1))] ?? null;

  const handleStepPull = (nextIdx: number) => {
    onSelectPull(nextIdx);
    setFocusRequestTick((t) => t + 1);
  };

  return (
    <div className="splash-grid">
      {/* Left Column: Party Dungeon Punch List */}
      <section className="panel" aria-labelledby="punch-list-heading">
        <div className="panel-header">
          <div>
            <h2 id="punch-list-heading" className="panel-title">
              Dungeon Punch List
            </h2>
            <p className="panel-subtitle">
              Sorted by BIS items still needed across active In-Party heroes (
              <span className="mono">{punch.totalPartyItemsNeeded}</span> dungeon drops
              remaining, <span className="mono">{punch.totalPartyItemsAcquired}</span>{' '}
              farmed)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${season2Only ? 'btn-primary' : ''}`}
              onClick={() => setSeason2Only((v) => !v)}
            >
              {season2Only ? 'S2 Pool Only' : 'Filter: S2 Pool'}
            </button>
            <button
              type="button"
              id="btn-toggle-zero-dungeons"
              className="btn btn-sm"
              onClick={() => setShowZeroDungeons((v) => !v)}
            >
              {showZeroDungeons
                ? 'Hide 0-Need'
                : `Show All ${punch.rows.length}`}
            </button>
          </div>
        </div>

        <div className="punch-list">
          {visibleRows.map((row) => {
            const isOpen = Boolean(expandedSlugs[row.dungeon.slug]);
            const predictedBoss = predictEmissaryVariant(
              row.dungeon,
              plannedEternalLevel
            );
            const syncVariant: BossVariant =
              row.dungeon.seasonStatus === 'season-2' &&
              predictedBoss === 'Krumbug'
                ? 'Regular'
                : predictedBoss;
            const badgeClass =
              row.totalNeeded >= 3
                ? 'is-high'
                : row.totalNeeded >= 1
                  ? 'is-med'
                  : 'is-low';
            const isSynced = activeDungeon.slug === row.dungeon.slug;

            return (
              <div
                key={row.dungeon.slug}
                className={`punch-row ${row.totalNeeded === 0 ? 'is-zero' : ''}`}
              >
                <div
                  className="punch-row-summary"
                  onClick={() => toggleExpand(row.dungeon.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`need-count-badge ${
                      row.totalNeeded > 0 ? badgeClass : ''
                    }`}
                    title={`${row.totalNeeded} items needed`}
                  >
                    {row.totalNeeded}
                  </div>

                  <div>
                    <div className="dungeon-meta-title">
                      {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      <span>{row.dungeon.name}</span>
                      <span
                        className={`s2-pool-badge ${
                          row.dungeon.seasonStatus === 'season-2'
                            ? 'is-s2'
                            : 'is-legacy'
                        }`}
                      >
                        {row.dungeon.seasonStatus === 'season-2' ? 'S2' : 'S1'}
                      </span>
                      {isSynced && <span className="lead-tag">SYNCED</span>}
                    </div>
                    <div className="dungeon-meta-sub mono">
                      {row.dungeon.category} · {row.dungeon.bosses.length} Boss · Timer{' '}
                      {formatDurationSeconds(row.dungeon.targetSeconds)} · KS{' '}
                      {row.dungeon.killScoreTarget}
                    </div>
                  </div>

                  <div className="member-chips">
                    {row.memberNeeds
                      .filter((mn) => mn.unacquiredCount > 0)
                      .map((mn) => (
                        <span key={mn.memberId} className="member-need-chip">
                          {mn.memberName} ({mn.hero.name})
                          <strong>×{mn.unacquiredCount}</strong>
                        </span>
                      ))}
                    {row.totalNeeded === 0 && (
                      <span
                        style={{ fontSize: '0.76rem', color: 'var(--jade-400)' }}
                      >
                        All tracked drops complete
                      </span>
                    )}
                  </div>

                  <div
                    className="punch-row-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      id={`btn-sync-route-${row.dungeon.slug}`}
                      className={`btn btn-sm ${isSynced ? 'btn-live' : 'btn-primary'}`}
                      onClick={() =>
                        onSyncDungeonRoute(row.dungeon.slug, syncVariant)
                      }
                    >
                      <MapPin size={13} />
                      {isSynced ? 'Active Route' : 'Sync Route'}
                    </button>
                  </div>
                </div>

                {isOpen && row.memberNeeds.length > 0 && (
                  <div className="punch-drawer">
                    {row.memberNeeds.flatMap((mn) =>
                      mn.items.map((item) => (
                        <label
                          key={`${mn.memberId}-${item.id}`}
                          className={`drawer-item ${
                            item.acquired ? 'is-acquired' : ''
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              flexWrap: 'wrap',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={item.acquired}
                              onChange={() =>
                                onToggleItemAcquired(
                                  mn.memberId,
                                  mn.characterId,
                                  mn.bisSetId,
                                  item.id
                                )
                              }
                            />
                            <span
                              className={`role-tag role-${mn.hero.role}`}
                              style={{ minWidth: 52, textAlign: 'center' }}
                            >
                              {mn.memberName}
                            </span>
                            <span className="item-slot-label">{item.slot}</span>
                            <span className="item-name-text">{item.itemName}</span>
                            {item.notes && (
                              <span className="lead-tag">{item.notes}</span>
                            )}
                          </div>
                          <span className="item-stats-text mono">{item.stats}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Global / Any-Dungeon BIS Drops */}
          {punch.anyDungeonNeeds.length > 0 && (
            <div className="punch-row">
              <div
                className="punch-row-summary"
                onClick={() => setShowAnyDungeon((v) => !v)}
                style={{ cursor: 'pointer' }}
              >
                <div className="need-count-badge is-med">
                  {punch.anyDungeonTotalNeeded}
                </div>
                <div>
                  <div className="dungeon-meta-title">
                    {showAnyDungeon ? (
                      <ChevronDown size={15} />
                    ) : (
                      <ChevronRight size={15} />
                    )}
                    <span>Any Dungeon (World / Relic / Weapon Drops)</span>
                  </div>
                  <div className="dungeon-meta-sub">
                    Global loot table items earned while farming any punch-list dungeon
                  </div>
                </div>
                <div className="member-chips">
                  {punch.anyDungeonNeeds
                    .filter((mn) => mn.unacquiredCount > 0)
                    .map((mn) => (
                      <span key={mn.memberId} className="member-need-chip">
                        {mn.memberName} <strong>×{mn.unacquiredCount}</strong>
                      </span>
                    ))}
                </div>
                <div />
              </div>

              {showAnyDungeon && (
                <div className="punch-drawer">
                  {punch.anyDungeonNeeds.flatMap((mn) =>
                    mn.items.map((item) => (
                      <label
                        key={`${mn.memberId}-${item.id}`}
                        className={`drawer-item ${item.acquired ? 'is-acquired' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            flexWrap: 'wrap',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={item.acquired}
                            onChange={() =>
                              onToggleItemAcquired(
                                mn.memberId,
                                mn.characterId,
                                mn.bisSetId,
                                item.id
                              )
                            }
                          />
                          <span className={`role-tag role-${mn.hero.role}`}>
                            {mn.memberName}
                          </span>
                          <span className="item-slot-label">{item.slot}</span>
                          <span className="item-name-text">{item.itemName}</span>
                        </div>
                        <span className="item-stats-text mono">{item.stats}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Right Column: Live Synchronized Season 2 Map & Combat-Log Stream Deck */}
      <aside className="panel" aria-labelledby="live-deck-heading">
        <div className="panel-header">
          <div>
            <h2 id="live-deck-heading" className="panel-title">
              Synced Party Route &amp; Enemy Positions
            </h2>
            <p className="panel-subtitle">
              {activeRoute?.label ?? `${activeDungeon.name} (${activeVariant})`}
            </p>
          </div>

          <button
            type="button"
            id="btn-expand-route-deck"
            className="btn btn-sm"
            onClick={onOpenFullRoutes}
          >
            All Pulls &amp; Variants
          </button>
        </div>

        <MethodRouteEmbed
          dungeon={activeDungeon}
          activeRoute={activeRoute}
          activeRouteR5={activeRouteR5}
          variant={activeVariant}
          pulls={pulls}
          activePullIndex={activePullIndex}
          focusRequestTick={focusRequestTick}
          liveRun={liveRun}
          pings={pings}
          compact
          onSelectPull={onSelectPull}
          onPingMap={onPingMap}
          onPlannerStateChange={onPlannerStateChange}
          onSaveEditedRoute={onSaveEditedRoute}
        />

        {/* Quick Mobile Pull Stepper Callout */}
        {currentPull && (
          <div className="splash-pull-callout">
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                }}
              >
                <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontWeight: 700 }}>
                  PULL {currentPull.index}/{pulls.length}
                </span>
                <strong style={{ fontSize: '0.83rem' }}>{currentPull.label}</strong>
                {currentPull.killPercent !== undefined && currentPull.killPercent > 0 && (
                  <span className="mono" style={{ fontSize: '0.73rem', color: 'var(--jade-400)' }}>
                    +{currentPull.killPercent.toFixed(1)}%
                  </span>
                )}
              </div>
              {currentPull.enemySummary && currentPull.enemySummary.length > 0 && (
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)',
                    marginTop: 2,
                  }}
                >
                  {currentPull.enemySummary.slice(0, 4).join(' · ')}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
              <button
                type="button"
                className="btn btn-sm"
                disabled={activePullIndex <= 1}
                onClick={() => handleStepPull(Math.max(1, activePullIndex - 1))}
                aria-label="Previous pull"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={activePullIndex >= pulls.length}
                onClick={() =>
                  handleStepPull(Math.min(pulls.length, activePullIndex + 1))
                }
                aria-label="Next pull"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* CombatLogs Auto-Watcher Controls */}
          <div
            style={{
              padding: '12px',
              background: 'var(--bg-canvas)',
              borderRadius: 'var(--radius-md)',
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
              }}
            >
              <strong style={{ fontSize: '0.85rem' }}>
                Lead CombatLogs Auto-Sync
              </strong>
              <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--jade-400)' }}>
                {watcher.mode === 'idle'
                  ? liveRun.difficultyLabel
                  : `${watcher.mode === 'simulating' ? 'Simulating' : 'Watching'} (${watcher.linesProcessed} lines)`}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.77rem', color: 'var(--text-secondary)' }}>
              Point at <code>Fellowship/fellowship/Saved/CombatLogs</code> on the Lead
              PC to auto-load routes on <code>DUNGEON_START</code> and stream live
              party coordinates.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {watcher.mode === 'idle' ? (
                <>
                  <button
                    type="button"
                    id="btn-watch-combatlogs"
                    className="btn btn-live btn-sm"
                    onClick={() => void watcher.startFolderWatch()}
                  >
                    <FolderSearch size={14} /> Watch CombatLogs Folder
                  </button>
                  <button
                    type="button"
                    id="btn-simulate-combatlog"
                    className="btn btn-sm"
                    onClick={watcher.startSampleSimulation}
                  >
                    <Play size={13} /> Simulate Live Run
                  </button>
                  <button
                    type="button"
                    id="btn-upload-log-file"
                    className="btn btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={13} /> Parse Log File
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  id="btn-stop-watch"
                  className="btn btn-sm"
                  onClick={watcher.stopWatch}
                >
                  <Square size={13} /> Stop Stream ({watcher.activeLogFileName})
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.log"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void watcher.importLogFile(file);
                  e.currentTarget.value = '';
                }}
              />
            </div>

            {watcher.errorMessage && (
              <div style={{ fontSize: '0.76rem', color: 'var(--ember-500)' }}>
                {watcher.errorMessage}
              </div>
            )}
          </div>

          {/* Compact Live Feed */}
          {liveRun.recentEvents.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                }}
              >
                Live Combat Stream Telemetry
              </div>
              <div className="event-feed">
                {liveRun.recentEvents.slice(0, 5).map((ev) => (
                  <div key={ev.id} className="feed-line">
                    <span>{ev.summary}</span>
                    <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.71rem' }}>
                      {ev.timestampIso.slice(11, 19)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
