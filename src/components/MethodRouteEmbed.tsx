import {
  BookmarkPlus,
  Check,
  Copy,
  Crosshair,
  ExternalLink,
  Eye,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Pencil,
  Plus,
  Radar,
  Undo2,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

export interface PlannerSyncPayload {
  reason: string;
  dungeonId: string;
  r5Code: string;
  shareHash: string;
  routeName: string;
  activePullIndex: number;
  totalScore: number;
  requiredScore: number;
  totalPercent: number;
  pulls: PullNode[];
}

interface MethodRouteEmbedProps {
  dungeon: DungeonDefinition;
  activeRoute: RoutePlan | null;
  activeRouteR5?: string | null;
  variant: BossVariant;
  pulls: readonly PullNode[];
  activePullIndex: number;
  focusRequestTick?: number;
  liveRun: LiveRunState;
  pings: readonly MapPing[];
  compact?: boolean;
  onSelectPull: (index: number) => void;
  onPingMap: (x: number, y: number, label: string) => void;
  onPlannerStateChange?: (payload: PlannerSyncPayload) => void;
  onSaveEditedRoute?: (payload: {
    label: string;
    r5Code: string;
    pulls: PullNode[];
    shareUrl: string;
  }) => void;
}

const ZOOM_STEPS = [1, 1.75, 2.5] as const;

function buildPlannerShareHash(r5Code: string | null | undefined): string {
  if (!r5Code) return '';
  const body = r5Code.startsWith('R5.') ? r5Code.slice(3) : r5Code;
  return body ? `#r5=${body}` : '';
}

function buildPlannerUrl(
  levelId: string,
  r5Code: string | null | undefined,
  embed: boolean
): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const params = new URLSearchParams();
  if (embed) {
    params.set('embed', '1');
    params.set('clean', '1');
  }
  params.set('v', 'fp3');
  params.set('dungeon', levelId);
  const hash = buildPlannerShareHash(r5Code);
  return `${normalizedBase}planner/index.html?${params.toString()}${hash}`;
}

interface Season2PlannerFrameProps {
  levelId: string;
  dungeon: DungeonDefinition;
  activeRoute: RoutePlan | null;
  effectiveR5: string | null;
  variant: BossVariant;
  pulls: readonly PullNode[];
  activePullIndex: number;
  focusRequestTick: number;
  liveRun: LiveRunState;
  pings: readonly MapPing[];
  compact: boolean;
  onSelectPull: (index: number) => void;
  onPlannerStateChange?: (payload: PlannerSyncPayload) => void;
  onSaveEditedRoute?: (payload: {
    label: string;
    r5Code: string;
    pulls: PullNode[];
    shareUrl: string;
  }) => void;
}

function Season2PlannerFrame({
  levelId,
  dungeon,
  activeRoute,
  effectiveR5,
  variant,
  pulls,
  activePullIndex,
  focusRequestTick,
  liveRun,
  pings,
  compact,
  onSelectPull,
  onPlannerStateChange,
  onSaveEditedRoute,
}: Season2PlannerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [plannerReady, setPlannerReady] = useState(false);
  const [isTall, setIsTall] = useState(false);
  const [routeOnly, setRouteOnly] = useState(false);
  const [editTools, setEditTools] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [liveScore, setLiveScore] = useState<{
    score: number;
    required: number;
    percent: number;
  } | null>(null);

  // Capture initial iframe URL once on mount; subsequent route/dungeon changes stream via postMessage
  const [initialIframeSrc] = useState(() =>
    buildPlannerUrl(levelId, effectiveR5, true)
  );

  const latestSyncRef = useRef({
    levelId,
    effectiveR5,
    activePullIndex,
  });
  const lastFromIframeRef = useRef({
    dungeonId: '',
    r5Code: '',
    activePullIndex: 0,
    pullCount: -1,
  });
  const prevParentRouteRef = useRef({
    levelId,
    effectiveR5,
  });
  const onSelectPullRef = useRef(onSelectPull);
  const onPlannerStateChangeRef = useRef(onPlannerStateChange);

  useEffect(() => {
    latestSyncRef.current = { levelId, effectiveR5, activePullIndex };
    onSelectPullRef.current = onSelectPull;
    onPlannerStateChangeRef.current = onPlannerStateChange;
  }, [levelId, effectiveR5, activePullIndex, onSelectPull, onPlannerStateChange]);

  const standaloneUrl = useMemo(() => {
    const rel = buildPlannerUrl(levelId, effectiveR5, false);
    if (typeof window === 'undefined') return rel;
    return new URL(rel, window.location.origin).toString();
  }, [levelId, effectiveR5]);

  // Listen for state updates emitted by the same-origin Season 2 planner iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        iframeRef.current &&
        event.source &&
        event.source !== iframeRef.current.contentWindow
      ) {
        return;
      }
      const msg = event.data as Record<string, unknown> | null;
      if (!msg || typeof msg.type !== 'string') return;

      if (msg.type === 'fellowshipper:planner-ready') {
        setPlannerReady(true);
        const cur = latestSyncRef.current;
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: 'fellowshipper:sync-route',
            dungeonId: cur.levelId,
            r5Code: cur.effectiveR5,
            activePullIndex: cur.activePullIndex,
            requestState: true,
          },
          window.location.origin
        );
        return;
      }

      if (msg.type === 'fellowshipper:planner-state') {
        const r5Code = typeof msg.r5Code === 'string' ? msg.r5Code : '';
        const dungeonId = typeof msg.dungeonId === 'string' ? msg.dungeonId : '';
        if (!r5Code || !dungeonId) return;

        // Ignore stale emissions while switching dungeons
        if (dungeonId !== latestSyncRef.current.levelId) return;

        const totalScore = Number(msg.totalScore) || 0;
        const requiredScore =
          Number(msg.requiredScore) || dungeon.killScoreTarget;
        const totalPercent = Number(msg.totalPercent) || 0;
        setLiveScore({
          score: totalScore,
          required: requiredScore,
          percent: totalPercent,
        });

        const nextPullIdx = Math.max(1, Number(msg.activePullIndex) || 1);
        const rawPulls = Array.isArray(msg.pulls)
          ? (msg.pulls as PullNode[])
          : [];

        const prevIframe = lastFromIframeRef.current;
        const routeStructureChanged =
          prevIframe.dungeonId !== dungeonId ||
          prevIframe.r5Code !== r5Code ||
          prevIframe.pullCount !== rawPulls.length;

        // Record before notifying parent so React's re-render does not echo sync-route back
        lastFromIframeRef.current = {
          dungeonId,
          r5Code,
          activePullIndex: nextPullIdx,
          pullCount: rawPulls.length,
        };

        if (nextPullIdx !== latestSyncRef.current.activePullIndex) {
          onSelectPullRef.current(nextPullIdx);
        }

        if (routeStructureChanged) {
          onPlannerStateChangeRef.current?.({
            reason: typeof msg.reason === 'string' ? msg.reason : 'render',
            dungeonId,
            r5Code,
            shareHash:
              typeof msg.shareHash === 'string'
                ? msg.shareHash
                : buildPlannerShareHash(r5Code),
            routeName:
              typeof msg.routeName === 'string'
                ? msg.routeName
                : (activeRoute?.label ?? dungeon.name),
            activePullIndex: nextPullIdx,
            totalScore,
            requiredScore,
            totalPercent,
            pulls: rawPulls,
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeRoute?.label, dungeon.killScoreTarget, dungeon.name]);

  // Push route / dungeon / active-pull changes into the embedded planner without echoing iframe-originated state
  useEffect(() => {
    if (!plannerReady) return;
    const fromIframe = lastFromIframeRef.current;
    const prevParent = prevParentRouteRef.current;
    const routeChangedFromParent =
      prevParent.levelId !== levelId || prevParent.effectiveR5 !== effectiveR5;
    prevParentRouteRef.current = { levelId, effectiveR5 };

    if (
      fromIframe.dungeonId === levelId &&
      fromIframe.r5Code === (effectiveR5 ?? '') &&
      fromIframe.activePullIndex === activePullIndex
    ) {
      return;
    }

    if (!routeChangedFromParent && activePullIndex === fromIframe.activePullIndex) {
      return;
    }

    const r5ToPush =
      routeChangedFromParent &&
      !(fromIframe.dungeonId === levelId && fromIframe.r5Code === (effectiveR5 ?? ''))
        ? effectiveR5
        : undefined;

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'fellowshipper:sync-route',
        dungeonId: levelId,
        r5Code: r5ToPush,
        activePullIndex,
      },
      window.location.origin
    );
  }, [plannerReady, levelId, effectiveR5, activePullIndex]);

  // Sync clean map display options (Route Only & Edit Map tools)
  useEffect(() => {
    if (!plannerReady) return;
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'fellowshipper:set-clean-options',
        routeOnly,
        editTools,
      },
      window.location.origin
    );
  }, [plannerReady, routeOnly, editTools]);

  // Focus & zoom to pull enemies when user clicks a pull in Fellowshipper's Pull Stepper
  useEffect(() => {
    if (!plannerReady || focusRequestTick <= 0) return;
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'fellowshipper:focus-pull',
        activePullIndex,
      },
      window.location.origin
    );
  }, [plannerReady, focusRequestTick, activePullIndex]);

  // Stream live CombatLog player coordinates and party pings onto the Season 2 map
  useEffect(() => {
    if (!plannerReady) return;
    const units = Object.values(liveRun.units)
      .filter((u) => u.isPlayer)
      .map((u) => ({
        unitId: u.unitId,
        name: u.name,
        x: u.x,
        y: u.y,
      }));
    const mappedPings = pings.map((p) => ({
      x: p.x,
      y: p.y,
      author: p.authorName,
      message: p.label,
    }));
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'fellowshipper:live-telemetry',
        units,
        pings: mappedPings,
      },
      window.location.origin
    );
  }, [plannerReady, liveRun.units, pings]);

  const handleFitWholeMap = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'fellowshipper:fit-map' },
      window.location.origin
    );
  };

  const handleFocusActivePull = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'fellowshipper:focus-pull', activePullIndex },
      window.location.origin
    );
  };

  const handlePlannerPullAction = (action: 'add-pull' | 'undo') => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'fellowshipper:pull-action', action },
      window.location.origin
    );
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(standaloneUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.open(standaloneUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isModifiedFromPreset = Boolean(
    effectiveR5 && activeRoute?.r5Code && effectiveR5 !== activeRoute.r5Code
  );

  const handleSaveEdited = () => {
    if (!effectiveR5 || !onSaveEditedRoute) return;
    onSaveEditedRoute({
      label: `${dungeon.name} — ${variant} Party Edit`,
      r5Code: effectiveR5,
      pulls: [...pulls],
      shareUrl: standaloneUrl,
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  const computedTotalScore =
    liveScore?.score ??
    Math.round(pulls.reduce((sum, p) => sum + (p.killScore || 0), 0) * 10) / 10;
  const computedReqScore = liveScore?.required ?? dungeon.killScoreTarget;
  const computedPct =
    liveScore?.percent ??
    Math.round((computedTotalScore / Math.max(1, computedReqScore)) * 1000) / 10;

  return (
    <div className="method-embed-shell">
      <div className="method-embed-toolbar">
        <div className="method-embed-modes">
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleFitWholeMap}
            title="Zoom out to fit the full dungeon map"
          >
            <MapIcon size={13} />
            Whole Map
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleFocusActivePull}
            title="Pan and highlight the active pull's enemy packs on the map"
          >
            <Crosshair size={13} />
            Pull #{activePullIndex}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${routeOnly ? 'btn-live' : ''}`}
            onClick={() => setRouteOnly((prev) => !prev)}
            title="Hide unpulled dungeon packs so only your route's pulls are shown"
          >
            <Eye size={13} />
            Route Only
          </button>
          {!compact && (
            <button
              type="button"
              className={`btn btn-sm ${editTools ? 'btn-live' : ''}`}
              onClick={() => setEditTools((prev) => !prev)}
              title="Show drawing, note, and pack-editing tools on the map"
            >
              <Pencil size={13} />
              Edit Map
            </button>
          )}
          {!compact && editTools && (
            <>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handlePlannerPullAction('add-pull')}
                title="Add a new empty pull step"
              >
                <Plus size={13} />
                Pull
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handlePlannerPullAction('undo')}
                title="Undo last map edit"
              >
                <Undo2 size={13} />
              </button>
            </>
          )}
        </div>

        <div className="method-embed-actions">
          <span
            className={`mono s2-score-pill ${
              computedPct >= 100 ? 'is-complete' : ''
            }`}
            title="Planned Kill Score vs dungeon requirement"
          >
            {computedPct.toFixed(1)}% · {Math.round(computedTotalScore)}/
            {computedReqScore} KS
          </span>
          {(isModifiedFromPreset || savedNotice) && onSaveEditedRoute && (
            <button
              type="button"
              className="btn btn-live btn-sm"
              onClick={handleSaveEdited}
              title="Save this edited pack route into the party's Saved Routes list"
            >
              {savedNotice ? <Check size={13} /> : <BookmarkPlus size={13} />}
              {savedNotice ? 'Saved' : 'Save Edit'}
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => void handleCopyShareLink()}
            title="Copy Season 2 #r5= route share URL"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy #r5'}
          </button>
          {!compact && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setIsTall((prev) => !prev)}
              title={isTall ? 'Standard map height' : 'Expand map height'}
            >
              {isTall ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {isTall ? 'Compact' : 'Tall'}
            </button>
          )}
          <a
            href={standaloneUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm"
            title="Open full-screen Season 2 Route Planner in a new tab"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div
        className={`s2-planner-frame-wrap ${compact ? 'is-compact' : ''} ${
          isTall ? 'is-tall' : ''
        }`}
      >
        <iframe
          ref={iframeRef}
          src={initialIframeSrc}
          title={`${dungeon.name} Season 2 Route Planner`}
          className="s2-planner-iframe"
          loading="eager"
        />
      </div>
    </div>
  );
}

export function MethodRouteEmbed({
  dungeon,
  activeRoute,
  activeRouteR5,
  variant,
  pulls,
  activePullIndex,
  focusRequestTick = 0,
  liveRun,
  pings,
  compact = false,
  onSelectPull,
  onPingMap,
  onPlannerStateChange,
  onSaveEditedRoute,
}: MethodRouteEmbedProps) {
  const [layerMode, setLayerMode] = useState<TacticalMapLayerMode>('map');
  const [zoomIndex, setZoomIndex] = useState(0);
  const [isTall, setIsTall] = useState(false);
  const [copied, setCopied] = useState(false);

  const methodUrl = resolveMethodRouteUrl(dungeon, activeRoute);
  const effectiveR5 = activeRouteR5 ?? activeRoute?.r5Code ?? null;

  if (dungeon.levelId) {
    return (
      <Season2PlannerFrame
        levelId={dungeon.levelId}
        dungeon={dungeon}
        activeRoute={activeRoute}
        effectiveR5={effectiveR5}
        variant={variant}
        pulls={pulls}
        activePullIndex={activePullIndex}
        focusRequestTick={focusRequestTick}
        liveRun={liveRun}
        pings={pings}
        compact={compact}
        onSelectPull={onSelectPull}
        onPlannerStateChange={onPlannerStateChange}
        onSaveEditedRoute={onSaveEditedRoute}
      />
    );
  }

  const routeCode = methodUrl.split('/').pop() || dungeon.slug;
  const isLive = liveRun.status === 'in_dungeon';
  const zoom = ZOOM_STEPS[zoomIndex] ?? 1;

  const handleCopyLegacyUrl = async () => {
    try {
      await navigator.clipboard.writeText(methodUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.open(methodUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="method-embed-shell">
      <div className="legacy-s1-banner">
        <span className="s2-pool-badge is-legacy">LEGACY S1</span>
        <span>
          <strong>{dungeon.name}</strong> rotated out of the active Season 2 dungeon
          pool. Open the archived Method.gg link below for Season 1 route details.
        </span>
      </div>

      <div className="method-embed-toolbar">
        <div className="method-embed-modes" role="tablist" aria-label="Map display mode">
          <button
            type="button"
            role="tab"
            aria-selected={layerMode === 'map'}
            className={`btn btn-sm ${layerMode === 'map' ? 'btn-primary' : ''}`}
            onClick={() => setLayerMode('map')}
          >
            <MapIcon size={13} />
            Map
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
        variant={variant}
        liveRun={liveRun}
        pings={pings}
        layerMode={layerMode}
        zoom={zoom}
        tall={isTall}
        onPingMap={onPingMap}
      />

      <div className="method-route-bar">
        <div className="method-route-meta">
          <span className="s2-pool-badge is-legacy">S1 ARCHIVE</span>
          <span className="method-route-title">
            {activeRoute?.label ?? `${dungeon.name} (${variant})`}
          </span>
          <span className="mono method-route-code">#{routeCode}</span>
        </div>

        <div className="method-embed-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => void handleCopyLegacyUrl()}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy S1 Link'}
          </button>
          <a
            href={methodUrl}
            target="_blank"
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
