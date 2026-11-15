import type { MouseEvent } from 'react';
import { projectUnitsToTacticalMap } from '../domain/combatLogParser';
import type {
  BossVariant,
  DungeonDefinition,
  LiveRunState,
  MapPing,
  PullNode,
} from '../domain/types';

interface TacticalRouteMapProps {
  dungeon: DungeonDefinition;
  pulls: readonly PullNode[];
  activePullIndex: number;
  variant: BossVariant;
  liveRun: LiveRunState;
  pings: readonly MapPing[];
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
  onSelectPull,
  onPingMap,
}: TacticalRouteMapProps) {
  const unitList = Object.values(liveRun.units);
  const projectedUnits = projectUnitsToTacticalMap(unitList, dungeon.worldBounds);

  const polylinePoints = pulls.map((p) => `${p.x},${p.y}`).join(' ');

  const handleSvgClick = (ev: MouseEvent<SVGSVGElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const x = Math.round(((ev.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((ev.clientY - rect.top) / rect.height) * 1000) / 10;
    onPingMap(x, y, `Waypoint (${Math.round(x)}, ${Math.round(y)})`);
  };

  const activePings = pings.slice(-8);
  const killPct = Math.min(
    100,
    Math.round((liveRun.killScoreCurrent / Math.max(1, liveRun.killScoreTarget)) * 100)
  );

  return (
    <div className="tactical-canvas-wrap">
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
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="hsl(38 84% 56% / 0.85)" />
          </marker>
        </defs>

        {/* Subtle topographic stone contours */}
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

        {/* Route Corridor Path */}
        {pulls.length > 1 && (
          <polyline
            points={pulls.map((p) => `${p.x},${(p.y * 62.5) / 100}`).join(' ')}
            fill="none"
            stroke="hsl(38 84% 56% / 0.55)"
            strokeWidth="0.65"
            strokeDasharray="1.4 0.9"
            markerMid="url(#route-arrow)"
          />
        )}

        {/* Pull Waypoint Nodes */}
        {pulls.map((node) => {
          const cy = (node.y * 62.5) / 100;
          const isSelected = node.index === activePullIndex;
          const fill =
            node.kind === 'boss'
              ? 'hsl(8 72% 52%)'
              : node.kind === 'miniboss'
              ? 'hsl(38 84% 54%)'
              : 'hsl(215 18% 18%)';
          const stroke = isSelected
            ? 'hsl(42 96% 74%)'
            : node.kind === 'pack'
            ? 'hsl(215 14% 42%)'
            : 'hsl(216 22% 8%)';

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
                  r="3.7"
                  fill="none"
                  stroke="hsl(38 88% 62% / 0.65)"
                  strokeWidth="0.45"
                />
              )}
              <circle r={node.kind === 'boss' ? 2.5 : 2.05} fill={fill} stroke={stroke} strokeWidth="0.4" />
              <text
                y="0.7"
                textAnchor="middle"
                fill="hsl(42 24% 96%)"
                fontSize="1.9"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
              >
                {node.index}
              </text>
              <text
                y={node.kind === 'boss' ? -3.3 : 4.2}
                textAnchor="middle"
                fill={isSelected ? 'hsl(40 88% 72%)' : 'hsl(214 16% 76%)'}
                fontSize="1.65"
                fontWeight={isSelected ? '700' : '500'}
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

          const dotColor = unit.isPlayer ? 'hsl(161 62% 52%)' : 'hsl(8 78% 58%)';
          const dx = Math.cos(unit.facing) * 2.1;
          const dy = -Math.sin(unit.facing) * 2.1;

          return (
            <g key={unit.unitId}>
              {trailPts && (
                <polyline
                  points={`${trailPts} ${unit.mapX},${cy}`}
                  fill="none"
                  stroke="hsl(161 58% 52% / 0.45)"
                  strokeWidth="0.45"
                />
              )}
              <g transform={`translate(${unit.mapX}, ${cy})`}>
                {unit.isPlayer && (
                  <line
                    x1="0"
                    y1="0"
                    x2={dx}
                    y2={dy}
                    stroke="hsl(161 70% 68%)"
                    strokeWidth="0.45"
                    strokeLinecap="round"
                  />
                )}
                <circle
                  r={unit.isPlayer ? 1.55 : 1.25}
                  fill={dotColor}
                  stroke="hsl(216 24% 8%)"
                  strokeWidth="0.35"
                />
                <text
                  y="-2.2"
                  textAnchor="middle"
                  fill={unit.isPlayer ? 'hsl(161 72% 76%)' : 'hsl(8 82% 76%)'}
                  fontSize="1.6"
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
              r="2.2"
              fill="none"
              stroke="hsl(38 92% 62%)"
              strokeWidth="0.45"
            />
            <circle r="0.95" fill="hsl(38 92% 62%)" />
            <text
              y="-2.4"
              textAnchor="middle"
              fill="hsl(38 92% 72%)"
              fontSize="1.65"
              fontWeight="700"
            >
              {ping.authorName}
            </text>
          </g>
        ))}

        {polylinePoints.length === 0 && null}
      </svg>
    </div>
  );
}
