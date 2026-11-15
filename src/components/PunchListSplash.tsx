import {
  ChevronDown,
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
  RoutePlan,
} from '../domain/types';
import type { LogWatcherController } from '../services/combatLogWatcher';
import { MethodRouteEmbed } from './MethodRouteEmbed';

interface PunchListSplashProps {
  punch: PunchListSummary;
  activeDungeon: DungeonDefinition;
  activeRoute: RoutePlan | null;
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
  onOpenFullRoutes: () => void;
}

export function PunchListSplash({
  punch,
  activeDungeon,
  activeRoute,
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
  onOpenFullRoutes,
}: PunchListSplashProps) {
  const [expandedSlugs, setExpandedSlugs] = useState<Record<string, boolean>>(() => {
    const first = punch.topPriorityDungeon?.dungeon.slug;
    return first ? { [first]: true } : {};
  });
  const [showZeroDungeons, setShowZeroDungeons] = useState(false);
  const [showAnyDungeon, setShowAnyDungeon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleExpand = (slug: string) => {
    setExpandedSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const visibleRows = showZeroDungeons
    ? punch.rows
    : punch.rows.filter((r) => r.totalNeeded > 0 || r.totalAcquired > 0);

  const pulls = activeRoute?.pulls ?? activeDungeon.defaultPulls;

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

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              id="btn-toggle-zero-dungeons"
              className="btn btn-sm"
              onClick={() => setShowZeroDungeons((v) => !v)}
            >
              {showZeroDungeons ? 'Hide 0-Need Dungeons' : 'Show All 15 Dungeons'}
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
                      {isSynced && <span className="lead-tag">SYNCED</span>}
                    </div>
                    <div className="dungeon-meta-sub mono">
                      {row.dungeon.category} · {row.dungeon.bosses.length} Boss · Timer{' '}
                      {formatDurationSeconds(row.dungeon.targetSeconds)} · E
                      {plannedEternalLevel} {predictedBoss}
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
                        onSyncDungeonRoute(row.dungeon.slug, predictedBoss)
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

      {/* Right Column: Live Synchronized Map & Combat-Log Stream Deck */}
      <aside className="panel" aria-labelledby="live-deck-heading">
        <div className="panel-header">
          <div>
            <h2 id="live-deck-heading" className="panel-title">
              Synced Party Route & Combat Stream
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
            Full Route Planner
          </button>
        </div>

        <MethodRouteEmbed
          dungeon={activeDungeon}
          activeRoute={activeRoute}
          variant={activeVariant}
          pulls={pulls}
          activePullIndex={activePullIndex}
          liveRun={liveRun}
          pings={pings}
          compact
          onSelectPull={onSelectPull}
          onPingMap={onPingMap}
        />

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
