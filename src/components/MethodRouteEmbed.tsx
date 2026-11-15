import { ExternalLink, Layers, Maximize2, Minimize2, Radar } from 'lucide-react';
import { useState } from 'react';
import { resolveMethodRouteUrl } from '../domain/punchList';
import type {
  BossVariant,
  DungeonDefinition,
  LiveRunState,
  MapPing,
  PullNode,
  RoutePlan,
} from '../domain/types';
import { TacticalRouteMap } from './TacticalRouteMap';

type EmbedViewMode = 'method' | 'split' | 'radar';

interface MethodRouteEmbedProps {
  dungeon: DungeonDefinition;
  activeRoute: RoutePlan | null;
  variant: BossVariant;
  pulls: readonly PullNode[];
  activePullIndex: number;
  liveRun: LiveRunState;
  pings: readonly MapPing[];
  compact?: boolean;
  onSelectPull: (index: number) => void;
  onPingMap: (x: number, y: number, label: string) => void;
}

export function MethodRouteEmbed({
  dungeon,
  activeRoute,
  variant,
  pulls,
  activePullIndex,
  liveRun,
  pings,
  compact = false,
  onSelectPull,
  onPingMap,
}: MethodRouteEmbedProps) {
  const [viewMode, setViewMode] = useState<EmbedViewMode>('method');
  const [isTall, setIsTall] = useState(false);

  const methodUrl = resolveMethodRouteUrl(dungeon, activeRoute);
  const routeTitle = activeRoute?.label ?? `${dungeon.name} (${variant})`;
  const isLive = liveRun.status === 'in_dungeon';

  return (
    <div className="method-embed-shell">
      <div className="method-embed-toolbar">
        <div className="method-embed-modes" role="tablist" aria-label="Route display mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'method'}
            className={`btn btn-sm ${viewMode === 'method' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('method')}
          >
            Method.gg Route
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'split'}
            className={`btn btn-sm ${viewMode === 'split' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('split')}
          >
            <Layers size={13} />
            Split
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'radar'}
            className={`btn btn-sm ${viewMode === 'radar' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('radar')}
          >
            <Radar size={13} />
            Log Radar
            {isLive && <span className="lead-tag">LIVE</span>}
          </button>
        </div>

        <div className="method-embed-actions">
          {viewMode !== 'radar' && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setIsTall((prev) => !prev)}
              title={isTall ? 'Standard embed height' : 'Expand embed height'}
            >
              {isTall ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {isTall ? 'Compact' : 'Tall'}
            </button>
          )}
          <a
            href={methodUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm"
            title="Open synced route directly on Method.gg"
          >
            Method.gg <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {(viewMode === 'method' || viewMode === 'split') && (
        <div
          className={`method-embed-frame-wrap ${compact ? 'is-compact' : ''} ${
            isTall ? 'is-tall' : ''
          }`}
        >
          <iframe
            key={methodUrl}
            src={methodUrl}
            title={`Method.gg Route Planner — ${routeTitle}`}
            className="method-embed-iframe"
            loading="lazy"
            allow="fullscreen; clipboard-read; clipboard-write"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {(viewMode === 'radar' || viewMode === 'split') && (
        <TacticalRouteMap
          dungeon={dungeon}
          pulls={pulls}
          activePullIndex={activePullIndex}
          variant={variant}
          liveRun={liveRun}
          pings={pings}
          onSelectPull={onSelectPull}
          onPingMap={onPingMap}
        />
      )}
    </div>
  );
}
