import {
  Check,
  Copy,
  ExternalLink,
  Layers,
  Maximize2,
  Minimize2,
  Radar,
  RefreshCw,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { resolveMethodRouteUrl } from '../domain/punchList';
import type {
  BossVariant,
  DungeonDefinition,
  LiveRunState,
  MapPing,
  PullNode,
  RoutePlan,
} from '../domain/types';
import { TacticalRouteMap, type TacticalMapLayerMode } from './TacticalRouteMap';

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

const ZOOM_STEPS = [1, 1.75, 2.5] as const;

export function MethodRouteEmbed({
  dungeon,
  activeRoute,
  variant,
  pulls,
  activePullIndex,
  liveRun,
  pings,
  onSelectPull,
  onPingMap,
}: MethodRouteEmbedProps) {
  const [layerMode, setLayerMode] = useState<TacticalMapLayerMode>('method-overlay');
  const [zoomIndex, setZoomIndex] = useState(0);
  const [isTall, setIsTall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoSyncTab, setAutoSyncTab] = useState(false);
  const lastSyncedUrlRef = useRef<string>('');

  const methodUrl = resolveMethodRouteUrl(dungeon, activeRoute);
  const routeCode = methodUrl.split('/').pop() || dungeon.slug;
  const isLive = liveRun.status === 'in_dungeon';
  const zoom = ZOOM_STEPS[zoomIndex] ?? 1;

  // When Companion Tab Sync is active, automatically navigate the named Method.gg tab
  // whenever any party member changes the active route (bypasses Method.gg's X-Frame-Options).
  useEffect(() => {
    if (!autoSyncTab) return;
    if (lastSyncedUrlRef.current === methodUrl) return;
    lastSyncedUrlRef.current = methodUrl;
    window.open(methodUrl, 'fellowshipper_method_companion');
  }, [autoSyncTab, methodUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(methodUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.open(methodUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleCompanionSync = () => {
    const next = !autoSyncTab;
    setAutoSyncTab(next);
    if (next) {
      lastSyncedUrlRef.current = methodUrl;
      window.open(methodUrl, 'fellowshipper_method_companion');
    }
  };

  return (
    <div className="method-embed-shell">
      <div className="method-embed-toolbar">
        <div className="method-embed-modes" role="tablist" aria-label="Map display mode">
          <button
            type="button"
            role="tab"
            aria-selected={layerMode === 'method-overlay'}
            className={`btn btn-sm ${layerMode === 'method-overlay' ? 'btn-primary' : ''}`}
            onClick={() => setLayerMode('method-overlay')}
          >
            Method Map + Route
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={layerMode === 'method-clean'}
            className={`btn btn-sm ${layerMode === 'method-clean' ? 'btn-primary' : ''}`}
            onClick={() => setLayerMode('method-clean')}
          >
            <Layers size={13} />
            Clean Map
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={layerMode === 'radar'}
            className={`btn btn-sm ${layerMode === 'radar' ? 'btn-primary' : ''}`}
            onClick={() => setLayerMode('radar')}
          >
            <Radar size={13} />
            Radar
            {isLive && <span className="lead-tag">LIVE</span>}
          </button>
        </div>

        <div className="method-embed-actions">
          <button
            type="button"
            className="btn btn-sm mono"
            onClick={() => setZoomIndex((i) => (i + 1) % ZOOM_STEPS.length)}
            title="Cycle map zoom (drag to pan when zoomed)"
          >
            <ZoomIn size={13} />
            {zoom}x
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setIsTall((prev) => !prev)}
            title={isTall ? 'Standard map height' : 'Expand map height'}
          >
            {isTall ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            {isTall ? 'Compact' : 'Tall'}
          </button>
        </div>
      </div>

      <TacticalRouteMap
        dungeon={dungeon}
        pulls={pulls}
        activePullIndex={activePullIndex}
        variant={variant}
        liveRun={liveRun}
        pings={pings}
        layerMode={layerMode}
        zoom={zoom}
        tall={isTall}
        onSelectPull={onSelectPull}
        onPingMap={onPingMap}
      />

      {/* Synced Method.gg Route Link & Companion Window Bar */}
      <div className="method-route-bar">
        <div className="method-route-meta">
          <span className="lead-tag">METHOD.GG</span>
          <span className="method-route-title">
            {activeRoute?.label ?? `${dungeon.name} (${variant})`}
          </span>
          <span className="mono method-route-code">#{routeCode}</span>
        </div>

        <div className="method-embed-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => void handleCopyUrl()}
            title="Copy synced Method.gg route URL"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${autoSyncTab ? 'btn-live' : ''}`}
            onClick={handleToggleCompanionSync}
            title="Keep a companion Method.gg browser tab automatically synced whenever the party route changes"
          >
            <RefreshCw size={13} />
            {autoSyncTab ? 'Tab Synced' : 'Auto-Sync Tab'}
          </button>
          <a
            href={methodUrl}
            target="fellowshipper_method_companion"
            rel="noreferrer"
            className="btn btn-primary btn-sm"
          >
            Open Method.gg <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
