import { type MouseEvent, type PointerEvent, useState } from 'react';
import { projectUnitsToTacticalMap } from '../domain/combatLogParser';
import type {
  BossVariant,
  DungeonDefinition,
  LiveRunState,
  MapPing,
  PullNode,
} from '../domain/types';

export type TacticalMapLayerMode = 'method-overlay' | 'method-clean' | 'radar';

interface TacticalRouteMapProps {
  dungeon: DungeonDefinition;
  pulls: readonly PullNode[];
  activePullIndex: number;
  variant: BossVariant;
  liveRun: LiveRunState;
  pings: readonly MapPing[];
  layerMode?: TacticalMapLayerMode;
  zoom?: number;
  tall?: boolean;
  onSelectPull: (index: number) => void;
  onPingMap: (x: number, y: number, label: string) => void;
}

export function TacticalRouteMap({
  dungeon,
  pulls,
  activePullIndex,
  variant,
  liveRun,
  pings,
  layerMode = 'method-overlay',
  zoom = 1,
  tall = false,
  onSelectPull,
  onPingMap,
}: TacticalRouteMapProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const [panState, setPanState] = useState<{
    dungeonSlug: string;
    x: number;
    y: number;
  }>({ dungeonSlug: dungeon.slug, x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
  } | null>(null);

  const activePan =
    panState.dungeonSlug === dungeon.slug && zoom > 1
      ? { x: panState.x, y: panState.y }
      : { x: 0, y: 0 };

  const showMethodMap =
    layerMode !== 'radar' &&
    Boolean(dungeon.mapImageUrl) &&
    failedImageUrl !== dungeon.mapImageUrl;
  const showOverlayNodes = layerMode !== 'method-clean';

  const unitList = Object.values(liveRun.units);
  const projectedUnits = projectUnitsToTacticalMap(unitList, dungeon.worldBounds);

  const handleSvgClick = (ev: MouseEvent<SVGSVGElement>) => {
    if (dragOrigin?.moved) return;
    const rect = ev.currentTarget.getBoundingClientRect();
    const x = Math.round(((ev.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((ev.clientY - rect.top) / rect.height) * 1000) / 10;
    onPingMap(x, y, `Waypoint (${Math.round(x)}, ${Math.round(y)})`);
  };

  const handlePointerDown = (ev: PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    ev.currentTarget.setPointerCapture(ev.pointerId);
    setDragOrigin({
      startX: ev.clientX,
      startY: ev.clientY,
      baseX: activePan.x,
      baseY: activePan.y,
      moved: false,
    });
  };

  const handlePointerMove = (ev: PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin || zoom <= 1) return;
    const dx = ev.clientX - dragOrigin.startX;
    const dy = ev.clientY - dragOrigin.startY;
    const maxOffset = (zoom - 1) * 190;
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, dragOrigin.baseX + dx));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, dragOrigin.baseY + dy));
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      setDragOrigin((prev) => (prev ? { ...prev, moved: true } : null));
    }
    setPanState({
      dungeonSlug: dungeon.slug,
      x: clampedX,
      y: clampedY,
    });
  };

  const handlePointerUp = () => {
    setTimeout(() => setDragOrigin(null), 0);
  };

  const activePings = pings.slice(-8);
  const killPct = Math.min(
    100,
    Math.round((liveRun.killScoreCurrent / Math.max(1, liveRun.killScoreTarget)) * 100)
  );

  return (
    <div
      className={`tactical-canvas-wrap ${tall ? 'is-tall' : ''} ${
        zoom > 1 ? 'is-zoomed' : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="canvas-hud-top">
        <div className="hud-pill">
          <strong style={{ fontFamily: 'var(--font-display)' }}>{dungeon.name}</strong>
          <span className="mono" style={{ color: 'var(--gold-400)' }}>
            {variant} Route
          </span>
        </div>

        <div className="hud-pill mono">
          <span style={{ color: 'var(--text-secondary)' }}>Kill Score:</span>
          <strong style={{ color: 'var(--jade-400)' }}>
            {liveRun.status === 'idle'
              ? `Target ${dungeon.killScoreTarget}`
              : `${Math.round(liveRun.killScoreCurrent)} / ${liveRun.killScoreTarget} (${killPct}%)`}
          </strong>
        </div>
      </div>

      <div
        className="tactical-pan-stage"
        style={{
          transform: `translate(${activePan.x}px, ${activePan.y}px) scale(${zoom})`,
        }}
      >
        {showMethodMap && (
          <img
            src={dungeon.mapImageUrl}
            alt={`Method.gg stitched dungeon map for ${dungeon.name}`}
            className="tactical-method-img"
            referrerPolicy="no-referrer"
            draggable={false}
            onError={() => setFailedImageUrl(dungeon.mapImageUrl)}
          />
        )}

        <svg
          id="tactical-route-svg"
          className="tactical-svg"
          viewBox="0 0 100 62.5"
          preserveAspectRatio="none"
          onClick={handleSvgClick}
          role="img"
          aria-label={`Tactical route map for ${dungeon.name}`}
        >
          <defs>
            <marker
              id="route-arrow"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="hsl(38 92% 58%)" />
            </marker>
          </defs>

          {/* Subtle topographic stone contours when viewing Radar Grid mode */}
          {!showMethodMap && (
            <>
              <ellipse
                cx="28"
                cy="44"
                rx="24"
                ry="15"
                fill="none"
                stroke="hsl(215 16% 20% / 0.5)"
                strokeWidth="0.28"
              />
              <ellipse
                cx="62"
                cy="31"
                rx="29"
                ry="18"
                fill="none"
                stroke="hsl(215 16% 20% / 0.45)"
                strokeWidth="0.28"
              />
              <path
                d="M 6 54 Q 26 48, 42 30 T 88 15"
                fill="none"
                stroke="hsl(215 14% 24% / 0.35)"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Route Corridor Path */}
          {showOverlayNodes && pulls.length > 1 && (
            <>
              <polyline
                points={pulls.map((p) => `${p.x},${(p.y * 62.5) / 100}`).join(' ')}
                fill="none"
                stroke="hsl(216 28% 6% / 0.78)"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
              <polyline
                points={pulls.map((p) => `${p.x},${(p.y * 62.5) / 100}`).join(' ')}
                fill="none"
                stroke="hsl(38 92% 58% / 0.92)"
                strokeWidth="0.68"
                strokeDasharray="1.4 0.9"
                markerMid="url(#route-arrow)"
              />
            </>
          )}

          {/* Pull Waypoint Nodes */}
          {showOverlayNodes &&
            pulls.map((node) => {
              const cy = (node.y * 62.5) / 100;
              const isSelected = node.index === activePullIndex;
              const fill =
                node.kind === 'boss'
                  ? 'hsl(8 76% 52%)'
                  : node.kind === 'miniboss'
                  ? 'hsl(38 88% 54%)'
                  : 'hsl(215 24% 14%)';
              const stroke = isSelected
                ? 'hsl(42 98% 76%)'
                : node.kind === 'pack'
                ? 'hsl(38 84% 62%)'
                : 'hsl(216 26% 8%)';

              return (
                <g
                  key={node.index}
                  transform={`translate(${node.x}, ${cy})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPull(node.index);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {isSelected && (
                    <circle
                      r="3.8"
                      fill="none"
                      stroke="hsl(38 92% 64% / 0.85)"
                      strokeWidth="0.55"
                    />
                  )}
                  <circle
                    r={node.kind === 'boss' ? 2.55 : 2.15}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="0.48"
                  />
                  <text
                    y="0.7"
                    textAnchor="middle"
                    fill="hsl(42 24% 97%)"
                    fontSize="1.9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                  >
                    {node.index}
                  </text>
                  <text
                    y={node.kind === 'boss' ? -3.4 : 4.3}
                    textAnchor="middle"
                    fill={isSelected ? 'hsl(42 96% 78%)' : 'hsl(210 24% 94%)'}
                    stroke="hsl(216 28% 6% / 0.92)"
                    strokeWidth="0.55"
                    paintOrder="stroke"
                    fontSize="1.7"
                    fontWeight={isSelected ? '700' : '600'}
                  >
                    {node.label.length > 22 ? `${node.label.slice(0, 20)}…` : node.label}
                  </text>
                </g>
              );
            })}

          {/* Live Combat-Log Player Trails & Positions */}
          {projectedUnits.map((unit) => {
            const cy = (unit.mapY * 62.5) / 100;
            const trailPts =
              unit.isPlayer && unit.trail.length > 1
                ? projectUnitsToTacticalMap(
                    unit.trail.map((pt, idx) => ({
                      ...unit,
                      unitId: `${unit.unitId}-t-${idx}`,
                      x: pt.x,
                      y: pt.y,
                      trail: [],
                    })),
                    dungeon.worldBounds
                  )
                    .map((tp) => `${tp.mapX},${(tp.mapY * 62.5) / 100}`)
                    .join(' ')
                : '';

            const dotColor = unit.isPlayer ? 'hsl(161 68% 52%)' : 'hsl(8 82% 58%)';
            const dx = Math.cos(unit.facing) * 2.1;
            const dy = -Math.sin(unit.facing) * 2.1;

            return (
              <g key={unit.unitId}>
                {trailPts && (
                  <polyline
                    points={`${trailPts} ${unit.mapX},${cy}`}
                    fill="none"
                    stroke="hsl(161 64% 52% / 0.65)"
                    strokeWidth="0.55"
                  />
                )}
                <g transform={`translate(${unit.mapX}, ${cy})`}>
                  {unit.isPlayer && (
                    <line
                      x1="0"
                      y1="0"
                      x2={dx}
                      y2={dy}
                      stroke="hsl(161 74% 72%)"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                    />
                  )}
                  <circle
                    r={unit.isPlayer ? 1.65 : 1.3}
                    fill={dotColor}
                    stroke="hsl(216 26% 7%)"
                    strokeWidth="0.4"
                  />
                  <text
                    y="-2.3"
                    textAnchor="middle"
                    fill={unit.isPlayer ? 'hsl(161 78% 82%)' : 'hsl(8 86% 80%)'}
                    stroke="hsl(216 28% 6% / 0.92)"
                    strokeWidth="0.55"
                    paintOrder="stroke"
                    fontSize="1.65"
                    fontWeight="700"
                  >
                    {unit.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Live Synchronized Party Pings */}
          {activePings.map((ping) => (
            <g key={ping.id} transform={`translate(${ping.x}, ${ping.y})`}>
              <circle
                className="ping-ring"
                r="2.3"
                fill="none"
                stroke="hsl(38 94% 64%)"
                strokeWidth="0.5"
              />
              <circle r="1.0" fill="hsl(38 94% 64%)" />
              <text
                y="-2.5"
                textAnchor="middle"
                fill="hsl(42 96% 78%)"
                stroke="hsl(216 28% 6% / 0.92)"
                strokeWidth="0.55"
                paintOrder="stroke"
                fontSize="1.7"
                fontWeight="700"
              >
                {ping.authorName}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
