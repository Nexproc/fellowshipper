import { ExternalLink, MapPin } from 'lucide-react';
import { DUNGEONS } from '../domain/catalog';
import {
  computeEternalSummary,
  computeEternalTargetScore,
} from '../domain/punchList';
import type { BossVariant, EternalChecklistRow } from '../domain/types';

interface EternalScoreViewProps {
  checklist: readonly EternalChecklistRow[];
  onToggleFinished: (dungeonSlug: string) => void;
  onUpdateScore: (dungeonSlug: string, score: number) => void;
  onUpdateTargetLevel: (dungeonSlug: string, level: number) => void;
  onSyncRoute: (dungeonSlug: string, variant: BossVariant, level: number) => void;
}

export function EternalScoreView({
  checklist,
  onToggleFinished,
  onUpdateScore,
  onUpdateTargetLevel,
  onSyncRoute,
}: EternalScoreViewProps) {
  const summary = computeEternalSummary(checklist, 10000);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            10,000 Eternal Score Progression Tracker
          </h2>
          <p className="panel-subtitle">
            Track your party&apos;s timed Season 2 Eternal keys (`ETERNAL_SCORE = 615 + 15 × (lvl - 1)`).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="room-badge mono">
            <span>Current:</span>
            <strong style={{ color: 'var(--gold-400)' }}>
              {summary.currentTotal.toLocaleString()} / 10,000
            </strong>
          </div>
          <div className="room-badge mono">
            <span>Remaining:</span>
            <strong
              style={{
                color:
                  summary.pointsRemaining === 0
                    ? 'var(--jade-400)'
                    : 'var(--ember-500)',
              }}
            >
              {summary.pointsRemaining} pts
            </strong>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="eternal-table">
          <thead>
            <tr>
              <th>Done</th>
              <th>Dungeon</th>
              <th>Target Level</th>
              <th>Emissary Boss</th>
              <th>Target Timed Score</th>
              <th>Current Score</th>
              <th>Delta</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {checklist.map((row) => {
              const dungeon = DUNGEONS.find((d) => d.slug === row.dungeonSlug);
              const targetScore = computeEternalTargetScore(row.targetLevel);
              const delta = targetScore - row.currentScore;

              return (
                <tr key={row.dungeonSlug}>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.finished}
                      onChange={() => onToggleFinished(row.dungeonSlug)}
                    />
                  </td>
                  <td>
                    <strong>{dungeon?.name ?? row.dungeonSlug}</strong>
                    {row.notes && (
                      <div style={{ fontSize: '0.73rem', color: 'var(--gold-400)' }}>
                        {row.notes}
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      className="select-control mono"
                      style={{ width: 64 }}
                      value={row.targetLevel}
                      onChange={(e) =>
                        onUpdateTargetLevel(
                          row.dungeonSlug,
                          Math.max(1, Number.parseInt(e.target.value || '1', 10))
                        )
                      }
                    />
                  </td>
                  <td>
                    <span className="variant-chip">{row.bossVariant}</span>
                  </td>
                  <td className="mono">{targetScore}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={2000}
                      className="select-control mono"
                      style={{ width: 82 }}
                      value={row.currentScore}
                      onChange={(e) =>
                        onUpdateScore(
                          row.dungeonSlug,
                          Math.max(0, Number.parseInt(e.target.value || '0', 10))
                        )
                      }
                    />
                  </td>
                  <td
                    className="mono"
                    style={{
                      color: delta > 0 ? 'var(--jade-400)' : 'var(--text-muted)',
                    }}
                  >
                    {delta > 0 ? `+${delta}` : 'Met'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          onSyncRoute(
                            row.dungeonSlug,
                            row.bossVariant,
                            row.targetLevel
                          )
                        }
                      >
                        <MapPin size={12} /> Sync
                      </button>
                      <a
                        href={row.methodUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm"
                      >
                        Method <ExternalLink size={12} />
                      </a>
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
