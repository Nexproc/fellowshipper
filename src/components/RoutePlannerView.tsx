import {
  ChevronLeft,
  ChevronRight,
  FolderSearch,
  Play,
  Plus,
  Square,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DUNGEONS } from '../domain/catalog';
import {
  computeEternalTargetScore,
  extractR5CodeFromInput,
} from '../domain/punchList';
import type {
  BossVariant,
  DungeonDefinition,
  LiveRunState,
  MapPing,
  MemberProfile,
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
  members?: readonly MemberProfile[];
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
  members,
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
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isMaximized) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setIsMaximized(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMaximized]);

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

  const targetScore = computeEternalTargetScore(plannedEternalLevel);

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

  return (
    <section
      className={`panel routes-stage ${isMaximized ? 'is-maximized' : ''}`}
    >
      <div className="panel-header routes-unified-header">
        <div className="routes-header-primary">
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

          <div className="routes-variant-group">
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

          <select
            id="select-saved-route"
            aria-label="Select Saved Route"
            className="select-control routes-preset-select"
            value={activeRoute?.id ?? ''}
            onChange={(e) => onSelectRouteId(e.target.value)}
            title="Saved party & preset routes for this dungeon"
          >
            {availableRoutes.map((r) => (
              <option key={r.id} value={r.id}>
                [{r.variant}] {r.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            id="btn-add-custom-route"
            className={`btn btn-sm ${showAddForm ? 'btn-live' : ''}`}
            onClick={() => setShowAddForm((v) => !v)}
            title="Import a Season 2 #r5= code or route URL"
          >
            <Plus size={13} /> Import
          </button>

          <label
            className="routes-eternal-badge"
            title={`Target Eternal score: ${targetScore} pts`}
          >
            <span>E</span>
            <input
              id="input-eternal-level"
              type="number"
              min={1}
              max={45}
              className="select-control mono"
              style={{ width: 52, padding: '4px 6px' }}
              value={plannedEternalLevel}
              onChange={(e) =>
                onSetEternalLevel(
                  Math.max(1, Number.parseInt(e.target.value || '1', 10))
                )
              }
            />
          </label>

          {pulls.length > 0 && (
            <div
              className="routes-pull-stepper"
              role="group"
              aria-label="Pull stepper"
            >
              <button
                type="button"
                className="btn btn-sm"
                disabled={activePullIndex <= 1}
                onClick={() => handleStepPull(Math.max(1, activePullIndex - 1))}
                title="Previous pull"
                aria-label="Previous pull"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                className="btn btn-sm mono routes-pull-counter"
                onClick={() => handleStepPull(activePullIndex)}
                title="Click to pan and highlight the active pull on the map"
              >
                {activePullIndex}/{pulls.length}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={activePullIndex >= pulls.length}
                onClick={() =>
                  handleStepPull(Math.min(pulls.length, activePullIndex + 1))
                }
                title="Next pull"
                aria-label="Next pull"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="routes-header-secondary">
          {watcher.mode === 'idle' ? (
            <>
              <button
                type="button"
                className="btn btn-live btn-sm"
                onClick={() => void watcher.startFolderWatch()}
                title="Stream live CombatLogs onto the map overlay"
              >
                <FolderSearch size={13} /> Watch Logs
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={watcher.startSampleSimulation}
                title="Simulate live party Spirit % and Relic CDs on the map"
              >
                <Play size={12} /> Simulate
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-sm"
              onClick={watcher.stopWatch}
            >
              <Square size={12} /> Stop Logs
            </button>
          )}
          <label
            className="party-toggle"
            title="Automatically switch to the dungeon & variant detected in CombatLogs"
          >
            <input
              type="checkbox"
              checked={autoFollowLogLead}
              onChange={onToggleAutoFollow}
            />
            <span>Auto</span>
          </label>
        </div>
      </div>

      {showAddForm && (
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
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
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveCustom}>
              Save &amp; Sync
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setShowAddForm(false)}>
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
        members={members}
        pings={pings}
        isMaximized={isMaximized}
        onToggleMaximized={() => setIsMaximized((prev) => !prev)}
        onSelectPull={onSelectPull}
        onPingMap={onPingMap}
        onPlannerStateChange={onPlannerStateChange}
        onSaveEditedRoute={onSaveEditedRoute}
      />
    </section>
  );
}
