import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderSearch,
  Play,
  Plus,
  Square,
} from 'lucide-react';
import { useState } from 'react';
import { AFFIX_CATALOG, DUNGEONS } from '../domain/catalog';
import {
  computeEternalTargetScore,
  extractR5CodeFromInput,
  formatDurationSeconds,
  predictEmissaryVariant,
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

interface RoutePlannerViewProps {
  activeDungeon: DungeonDefinition;
  availableRoutes: readonly RoutePlan[];
  activeRoute: RoutePlan | null;
  activeRouteR5?: string | null;
  activeRoutePulls?: readonly PullNode[] | null;
  activeVariant: BossVariant;
  activePullIndex: number;
  plannedEternalLevel: number;
  autoFollowLogLead: boolean;
  liveRun: LiveRunState;
  pings: readonly MapPing[];
  watcher: LogWatcherController;
  onSelectDungeon: (slug: string) => void;
  onSelectVariant: (variant: BossVariant) => void;
  onSelectRouteId: (routeId: string) => void;
  onSetEternalLevel: (level: number) => void;
  onToggleAutoFollow: () => void;
  onSelectPull: (index: number) => void;
  onPingMap: (x: number, y: number, label: string) => void;
  onPlannerStateChange?: (payload: PlannerSyncPayload) => void;
  onSaveEditedRoute?: (payload: {
    label: string;
    r5Code: string;
    pulls: PullNode[];
    shareUrl: string;
  }) => void;
  onAddCustomRoute: (route: Omit<RoutePlan, 'id' | 'sourceTag'>) => void;
}

const SEASON_2_VARIANTS: readonly BossVariant[] = [
  'Regular',
  'Ghorn',
  'Eira',
  'Empowered',
];

const LEGACY_VARIANTS: readonly BossVariant[] = [
  'Regular',
  'Ghorn',
  'Krumbug',
  'Eira',
  'Empowered',
];

export function RoutePlannerView({
  activeDungeon,
  availableRoutes,
  activeRoute,
  activeRouteR5,
  activeRoutePulls,
  activeVariant,
  activePullIndex,
  plannedEternalLevel,
  autoFollowLogLead,
  liveRun,
  pings,
  watcher,
  onSelectDungeon,
  onSelectVariant,
  onSelectRouteId,
  onSetEternalLevel,
  onToggleAutoFollow,
  onSelectPull,
  onPingMap,
  onPlannerStateChange,
  onSaveEditedRoute,
  onAddCustomRoute,
}: RoutePlannerViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newVariant, setNewVariant] = useState<BossVariant>('Ghorn');
  const [newNotes, setNewNotes] = useState('');
  const [focusRequestTick, setFocusRequestTick] = useState(0);

  const pulls =
    (activeRoutePulls && activeRoutePulls.length > 0
      ? activeRoutePulls
      : activeRoute?.pulls) ?? activeDungeon.defaultPulls;

  const season2Dungeons = DUNGEONS.filter((d) => d.seasonStatus === 'season-2');
  const legacyDungeons = DUNGEONS.filter((d) => d.seasonStatus === 'legacy-s1');
  const variants =
    activeDungeon.seasonStatus === 'season-2'
      ? SEASON_2_VARIANTS
      : LEGACY_VARIANTS;

  const predictedEmissary = predictEmissaryVariant(activeDungeon, plannedEternalLevel);
  const targetScore = computeEternalTargetScore(plannedEternalLevel);
  const killPct = Math.min(
    100,
    Math.round((liveRun.killScoreCurrent / Math.max(1, liveRun.killScoreTarget)) * 100)
  );
  const playerUnits = Object.values(liveRun.units).filter((u) => u.isPlayer);

  const handleStepPull = (nextIndex: number) => {
    onSelectPull(nextIndex);
    setFocusRequestTick((t) => t + 1);
  };

  const handleSaveCustom = () => {
    if (!newLabel.trim() || !newUrl.trim()) return;
    const parsedR5 = extractR5CodeFromInput(newUrl);
    onAddCustomRoute({
      dungeonSlug: activeDungeon.slug,
      variant: newVariant,
      label: newLabel.trim(),
      methodUrl: newUrl.trim(),
      r5Code: parsedR5,
      notes: newNotes.trim() || undefined,
    });
    setNewLabel('');
    setNewUrl('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const totalRouteScore = pulls.reduce((s, p) => s + (p.killScore || 0), 0);
  const totalRoutePct =
    activeDungeon.killScoreTarget > 0
      ? (totalRouteScore / activeDungeon.killScoreTarget) * 100
      : 0;

  return (
    <div className="routes-grid">
      {/* Main Synchronized Map & Route Controls */}
      <section className="panel">
        <div className="panel-header">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <select
              id="route-dungeon-select"
              aria-label="Select Dungeon"
              className="select-control"
              value={activeDungeon.slug}
              onChange={(e) => onSelectDungeon(e.target.value)}
            >
              <optgroup label={`Season 2 Active Pool (${season2Dungeons.length})`}>
                {season2Dungeons.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.category})
                  </option>
                ))}
              </optgroup>
              <optgroup label={`Rotated Out — Legacy S1 (${legacyDungeons.length})`}>
                {legacyDungeons.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    [S1] {d.name} ({d.category})
                  </option>
                ))}
              </optgroup>
            </select>

            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {variants.map((v) => (
                <button
                  key={v}
                  type="button"
                  id={`btn-variant-${v}`}
                  className={`btn btn-sm ${activeVariant === v ? 'btn-primary' : ''}`}
                  onClick={() => onSelectVariant(v)}
                >
                  {v === 'Eira' && activeDungeon.seasonStatus === 'season-2'
                    ? 'Eira / Witch'
                    : v}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
              <span>Eternal Lvl</span>
              <input
                id="input-eternal-level"
                type="number"
                min={1}
                max={45}
                className="select-control mono"
                style={{ width: 62 }}
                value={plannedEternalLevel}
                onChange={(e) =>
                  onSetEternalLevel(Math.max(1, Number.parseInt(e.target.value || '1', 10)))
                }
              />
            </label>
            <span className="variant-chip" title="Target Eternal score">
              {targetScore} pts
            </span>
          </div>
        </div>

        {/* Route Picker Sub-bar */}
        <div
          style={{
            padding: '10px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Routes ({availableRoutes.length}):
            </span>
            <select
              id="select-saved-route"
              aria-label="Select Saved Route"
              className="select-control"
              style={{ minWidth: 250, maxWidth: '100%' }}
              value={activeRoute?.id ?? ''}
              onChange={(e) => onSelectRouteId(e.target.value)}
            >
              {availableRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.variant}] {r.label} ({r.sourceTag})
                </option>
              ))}
            </select>

            {activeRoute?.methodUrl &&
              activeDungeon.seasonStatus === 'legacy-s1' && (
                <a
                  href={activeRoute.methodUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm"
                >
                  Open S1 Method Link <ExternalLink size={13} />
                </a>
              )}
          </div>

          <button
            type="button"
            id="btn-add-custom-route"
            className="btn btn-sm"
            onClick={() => setShowAddForm((v) => !v)}
          >
            <Plus size={13} /> Import #r5 / Link
          </button>
        </div>

        {showAddForm && (
          <div
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 10,
              alignItems: 'end',
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                Route Label
              </div>
              <input
                className="text-input"
                style={{ width: '100%' }}
                placeholder="e.g. Stormwatch S2 Portal Skip"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                Season 2 #r5= Link / R5. Code / URL
              </div>
              <input
                className="text-input"
                style={{ width: '100%' }}
                placeholder="R5.APYJ... or https://...#r5=..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                Variant
              </div>
              <select
                className="select-control"
                style={{ width: '100%' }}
                value={newVariant}
                onChange={(e) => setNewVariant(e.target.value as BossVariant)}
              >
                {variants.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-primary" onClick={handleSaveCustom}>
                Save &amp; Sync to Party
              </button>
              <button type="button" className="btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

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
          onSelectPull={onSelectPull}
          onPingMap={onPingMap}
          onPlannerStateChange={onPlannerStateChange}
          onSaveEditedRoute={onSaveEditedRoute}
        />

        <div
          className="panel-body"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {activeDungeon.seasonStatus === 'season-2'
              ? 'Click any enemy pack on the map to add/remove it from the active pull — edits sync live to your whole party.'
              : `Predicted S1 Emissary at E${plannedEternalLevel}: ${predictedEmissary}.`}
            {activeRoute?.notes && (
              <strong style={{ marginLeft: 8, color: 'var(--gold-400)' }}>
                Note: {activeRoute.notes}
              </strong>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="btn btn-sm"
              disabled={activePullIndex <= 1}
              onClick={() => handleStepPull(Math.max(1, activePullIndex - 1))}
            >
              <ChevronLeft size={14} /> Prev Pull
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={activePullIndex >= pulls.length}
              onClick={() =>
                handleStepPull(Math.min(pulls.length, activePullIndex + 1))
              }
            >
              Next Pull <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Right Column: Synchronized Pull Stepper + Live Combat Telemetry */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Synchronized Pull Plan</h2>
              <p className="panel-subtitle">
                Timer {formatDurationSeconds(activeDungeon.targetSeconds)} ·{' '}
                {Math.round(totalRouteScore)}/{activeDungeon.killScoreTarget} KS (
                {totalRoutePct.toFixed(1)}%)
              </p>
            </div>
          </div>
          <div className="panel-body">
            <div className="pull-list">
              {pulls.map((p) => {
                const detailLine =
                  p.enemySummary && p.enemySummary.length > 0
                    ? p.enemySummary.slice(0, 3).join(', ')
                    : p.notes;
                const scoreLabel =
                  p.kind === 'boss' && p.killScore === 0
                    ? 'BOSS'
                    : p.killPercent !== undefined && p.killPercent > 0
                      ? `${p.killPercent.toFixed(1)}%`
                      : p.killScore > 0
                        ? `+${p.killScore}`
                        : 'BOSS';

                return (
                  <button
                    key={p.index}
                    type="button"
                    className={`pull-step ${
                      p.index === activePullIndex ? 'is-selected' : ''
                    }`}
                    onClick={() => handleStepPull(p.index)}
                  >
                    <span className={`pull-num kind-${p.kind}`}>{p.index}</span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.83rem' }}>
                          {p.label}
                        </span>
                        {p.mobCount !== undefined && p.mobCount > 0 && (
                          <span
                            className="mono"
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            ({p.mobCount} {p.mobCount === 1 ? 'mob' : 'mobs'})
                          </span>
                        )}
                      </div>
                      {p.packTags && p.packTags.length > 0 && (
                        <div className="pack-tag-row">
                          {p.packTags.slice(0, 6).map((tag) => (
                            <span key={tag} className="pack-tag-chip mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {detailLine && (
                        <div
                          style={{
                            fontSize: '0.73rem',
                            color: 'var(--text-secondary)',
                            marginTop: 2,
                          }}
                        >
                          {detailLine}
                        </div>
                      )}
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: '0.75rem',
                        color:
                          scoreLabel === 'BOSS'
                            ? 'var(--ember-500)'
                            : 'var(--gold-400)',
                        fontWeight: 600,
                      }}
                    >
                      {scoreLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Live Combat-Log Telemetry</h2>
              <p className="panel-subtitle">{liveRun.difficultyLabel}</p>
            </div>
            <label className="party-toggle">
              <input
                type="checkbox"
                checked={autoFollowLogLead}
                onChange={onToggleAutoFollow}
              />
              <span>Auto-Load Route</span>
            </label>
          </div>

          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  marginBottom: 5,
                }}
              >
                <span>Live Kill Score</span>
                <span className="mono">
                  {Math.round(liveRun.killScoreCurrent)} / {liveRun.killScoreTarget} ({killPct}%)
                </span>
              </div>
              <div className="kill-progress-bar">
                <div className="kill-progress-fill" style={{ width: `${killPct}%` }} />
              </div>
            </div>

            {liveRun.affixes.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {liveRun.affixes.map((aid) => (
                  <span key={aid} className="variant-chip">
                    {AFFIX_CATALOG[aid]?.name ?? `Affix ${aid}`}
                  </span>
                ))}
              </div>
            )}

            {playerUnits.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Party Positions &amp; Spirit
                </div>
                {playerUnits.map((u) => {
                  const hpPct = Math.round((u.hpCurrent / Math.max(1, u.hpMax)) * 100);
                  return (
                    <div
                      key={u.unitId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 9px',
                        background: 'var(--bg-canvas)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.79rem',
                      }}
                    >
                      <strong>{u.name}</strong>
                      <span className="mono" style={{ color: 'var(--text-secondary)' }}>
                        HP {hpPct}% · Spirit {u.spiritPct !== null ? `${Math.round(u.spiritPct)}%` : '—'} · (
                        {Math.round(u.x)}, {Math.round(u.y)})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {watcher.mode === 'idle' ? (
                <>
                  <button
                    type="button"
                    className="btn btn-live btn-sm"
                    onClick={() => void watcher.startFolderWatch()}
                  >
                    <FolderSearch size={14} /> Watch CombatLogs
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={watcher.startSampleSimulation}
                  >
                    <Play size={13} /> Simulate Run
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-sm" onClick={watcher.stopWatch}>
                  <Square size={13} /> Stop Stream
                </button>
              )}
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
