import { createIdleLiveRunState, DUNGEONS } from './catalog.ts';
import type {
  BossVariant,
  CombatFeedEntry,
  DungeonDefinition,
  LiveRunState,
  LiveUnitTelemetry,
  WorldBounds,
} from './types.ts';

export interface PositionSample {
  unitId: string;
  name: string;
  isPlayer: boolean;
  x: number;
  y: number;
  facing: number;
  hpCurrent: number;
  hpMax: number;
  spiritPct: number | null;
}

export type ParsedCombatEvent =
  | {
      kind: 'ZONE_CHANGE';
      timestampIso: string;
      zoneName: string;
      zoneId: number;
      difficultyRaw: number | null;
    }
  | {
      kind: 'DUNGEON_START';
      timestampIso: string;
      dungeonName: string;
      zoneId: number;
      difficultyRaw: number;
      affixes: number[];
      isQuickPlay: boolean;
    }
  | {
      kind: 'DUNGEON_END';
      timestampIso: string;
      dungeonName: string;
      zoneId: number;
      success: boolean;
      durationSeconds: number | null;
      timedSuccess: boolean;
    }
  | {
      kind: 'ENCOUNTER_START';
      timestampIso: string;
      encounterId: number;
      encounterName: string;
    }
  | {
      kind: 'ENCOUNTER_END';
      timestampIso: string;
      encounterId: number;
      encounterName: string;
      success: boolean;
    }
  | {
      kind: 'UNIT_DEATH';
      timestampIso: string;
      deadGuid: string;
      deadName: string;
      isPlayer: boolean;
      killScore: number;
    }
  | {
      kind: 'COMBAT_TELEMETRY';
      timestampIso: string;
      samples: PositionSample[];
    };

export interface AutoRouteTrigger {
  dungeonSlug: string;
  variant: BossVariant;
  eternalLevel: number | null;
}

export interface CombatReductionResult {
  nextRun: LiveRunState;
  autoRouteTrigger: AutoRouteTrigger | null;
}

const STRONGHOLD_ZONE_ID = 17;

function stripQuotes(raw: string): string {
  return raw.trim().replace(/^\[?"+|"+\]?$/g, '');
}

function parseIntSafe(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseFloatSafe(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number.parseFloat(raw.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function parseAffixList(raw: string | undefined): number[] {
  if (!raw) return [];
  const inner = raw.trim().replace(/^\[|\]$/g, '');
  if (!inner) return [];
  return inner
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((n) => Number.isFinite(n));
}

function extractSpiritPercent(resourceBlob: string | undefined): number | null {
  if (!resourceBlob) return null;
  const match = /\(4,\s*([0-9.]+),\s*([0-9.]+)\)/.exec(resourceBlob);
  if (!match) return null;
  const cur = Number.parseFloat(match[1]);
  const max = Number.parseFloat(match[2]);
  if (!Number.isFinite(cur) || !Number.isFinite(max) || max <= 0) return null;
  return Math.min(100, Math.max(0, (cur / max) * 100));
}

export function formatFellowshipDifficulty(
  difficultyRaw: number | null,
  isQuickPlay = false
): { label: string; eternalLevel: number | null } {
  if (difficultyRaw === null) {
    return { label: 'Unknown', eternalLevel: null };
  }
  if (isQuickPlay) {
    return { label: 'Quick Play', eternalLevel: null };
  }
  if (difficultyRaw >= 1 && difficultyRaw <= 7) {
    return { label: `Contender ${difficultyRaw}`, eternalLevel: null };
  }
  if (difficultyRaw >= 9 && difficultyRaw <= 15) {
    return { label: `Adept ${difficultyRaw - 8}`, eternalLevel: null };
  }
  if (difficultyRaw >= 17 && difficultyRaw <= 23) {
    return { label: `Champion ${difficultyRaw - 16}`, eternalLevel: null };
  }
  if (difficultyRaw >= 25 && difficultyRaw <= 31) {
    return { label: `Paragon ${difficultyRaw - 24}`, eternalLevel: null };
  }
  if (difficultyRaw >= 33) {
    const eternalLevel = difficultyRaw - 32;
    return { label: `Eternal ${eternalLevel}`, eternalLevel };
  }
  return { label: `Tier ${difficultyRaw}`, eternalLevel: null };
}

export function detectVariantFromAffixes(affixes: readonly number[]): BossVariant {
  if (affixes.includes(20)) return 'Ghorn';
  if (affixes.includes(21)) return 'Krumbug';
  if (affixes.includes(22)) return 'Eira';
  if (affixes.includes(12)) return 'Empowered';
  return 'Regular';
}

export function findDungeonByZoneOrName(
  zoneId: number | null,
  rawName?: string
): DungeonDefinition | null {
  if (zoneId !== null) {
    const byId = DUNGEONS.find((d) => d.zoneId === zoneId);
    if (byId) return byId;
  }
  if (rawName) {
    const normalized = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const byName = DUNGEONS.find(
      (d) => d.name.toLowerCase().replace(/[^a-z0-9]+/g, '') === normalized
    );
    if (byName) return byName;
  }
  return null;
}

function buildSample(
  guid: string | undefined,
  rawName: string | undefined,
  hpCurStr: string | undefined,
  hpMaxStr: string | undefined,
  xStr: string | undefined,
  yStr: string | undefined,
  facingStr: string | undefined,
  resBlob: string | undefined
): PositionSample | null {
  if (!guid || !rawName) return null;
  const x = parseFloatSafe(xStr);
  const y = parseFloatSafe(yStr);
  if (x === null || y === null) return null;
  if (x === 0 && y === 0) return null;

  const hpCurrent = parseIntSafe(hpCurStr) ?? 100;
  const hpMax = Math.max(1, parseIntSafe(hpMaxStr) ?? 100);
  const facing = parseFloatSafe(facingStr) ?? 0;

  return {
    unitId: guid.trim(),
    name: stripQuotes(rawName),
    isPlayer: guid.trim().startsWith('Player-'),
    x,
    y,
    facing,
    hpCurrent,
    hpMax,
    spiritPct: extractSpiritPercent(resBlob),
  };
}

/**
 * Parse, Don't Validate boundary: converts one pipe-delimited Fellowship CombatLog*.txt
 * line into a typed ParsedCombatEvent, or null if non-actionable.
 */
export function parseCombatLogLine(rawLine: string): ParsedCombatEvent | null {
  const trimmed = rawLine.trim();
  if (!trimmed) return null;

  const parts = trimmed.split('|');
  if (parts.length < 3) return null;

  const timestampIso = parts[0].trim();
  const eventType = parts[1].trim();

  if (eventType === 'ZONE_CHANGE') {
    const zoneId = parseIntSafe(parts[3]);
    if (zoneId === null) return null;
    return {
      kind: 'ZONE_CHANGE',
      timestampIso,
      zoneName: stripQuotes(parts[2] ?? ''),
      zoneId,
      difficultyRaw: parseIntSafe(parts[4]),
    };
  }

  if (eventType === 'DUNGEON_START') {
    const zoneId = parseIntSafe(parts[3]);
    if (zoneId === null) return null;
    return {
      kind: 'DUNGEON_START',
      timestampIso,
      dungeonName: stripQuotes(parts[2] ?? ''),
      zoneId,
      difficultyRaw: parseIntSafe(parts[4]) ?? 1,
      affixes: parseAffixList(parts[5]),
      isQuickPlay: parts[6]?.trim() === '1',
    };
  }

  if (eventType === 'DUNGEON_END') {
    const zoneId = parseIntSafe(parts[3]) ?? 0;
    return {
      kind: 'DUNGEON_END',
      timestampIso,
      dungeonName: stripQuotes(parts[2] ?? ''),
      zoneId,
      success: parts[6]?.trim() === '1',
      durationSeconds: parseFloatSafe(parts[8]),
      timedSuccess: parts[9]?.trim() === '1',
    };
  }

  if (eventType === 'ENCOUNTER_START') {
    return {
      kind: 'ENCOUNTER_START',
      timestampIso,
      encounterId: parseIntSafe(parts[2]) ?? 0,
      encounterName: stripQuotes(parts[3] ?? 'Boss Encounter'),
    };
  }

  if (eventType === 'ENCOUNTER_END') {
    return {
      kind: 'ENCOUNTER_END',
      timestampIso,
      encounterId: parseIntSafe(parts[2]) ?? 0,
      encounterName: stripQuotes(parts[3] ?? 'Boss Encounter'),
      success: parts[4]?.trim() === '1',
    };
  }

  if (eventType === 'UNIT_DEATH' || eventType === 'ALLY_DEATH') {
    const deadGuid = (parts[2] ?? '').trim();
    const deadName = stripQuotes(parts[3] ?? 'Unknown');
    const isPlayer = eventType === 'ALLY_DEATH' || deadGuid.startsWith('Player-');
    const rawScore = parseFloatSafe(parts[9]) ?? 0;
    return {
      kind: 'UNIT_DEATH',
      timestampIso,
      deadGuid,
      deadName,
      isPlayer,
      killScore: isPlayer ? 0 : rawScore,
    };
  }

  // 28-field combat packets (timestamp + event + 28 fields = 30 parts)
  if (parts.length >= 30) {
    const samples: PositionSample[] = [];
    const srcSample = buildSample(
      parts[2],
      parts[3],
      parts[16],
      parts[17],
      parts[19],
      parts[20],
      parts[21],
      parts[22]
    );
    const dstSample = buildSample(
      parts[4],
      parts[5],
      parts[23],
      parts[24],
      parts[26],
      parts[27],
      parts[28],
      parts[29]
    );
    if (srcSample) samples.push(srcSample);
    if (dstSample) samples.push(dstSample);
    if (samples.length > 0) {
      return { kind: 'COMBAT_TELEMETRY', timestampIso, samples };
    }
  }

  // 14/15-field cast/activation packets (ABILITY_ACTIVATED, ABILITY_CAST_START, ABILITY_CAST_FAIL)
  if (
    parts.length >= 16 &&
    (eventType === 'ABILITY_ACTIVATED' ||
      eventType === 'ABILITY_CAST_START' ||
      eventType === 'ABILITY_CAST_FAIL')
  ) {
    const srcSample = buildSample(
      parts[2],
      parts[3],
      parts[9],
      parts[10],
      parts[12],
      parts[13],
      parts[14],
      parts[15]
    );
    if (srcSample) {
      return { kind: 'COMBAT_TELEMETRY', timestampIso, samples: [srcSample] };
    }
  }

  return null;
}

function appendFeed(
  existing: readonly CombatFeedEntry[],
  entry: CombatFeedEntry
): CombatFeedEntry[] {
  return [entry, ...existing].slice(0, 24);
}

/**
 * Pure state transition for live combat log streams.
 * Returns updated LiveRunState and an optional AutoRouteTrigger when entering a dungeon.
 */
export function reduceCombatEvent(
  current: LiveRunState,
  event: ParsedCombatEvent
): CombatReductionResult {
  if (event.kind === 'ZONE_CHANGE') {
    if (event.zoneId === STRONGHOLD_ZONE_ID) {
      const idle = createIdleLiveRunState();
      return {
        nextRun: {
          ...idle,
          recentEvents: appendFeed(current.recentEvents, {
            id: `${event.timestampIso}-zone`,
            timestampIso: event.timestampIso,
            kind: 'zone',
            summary: 'Party returned to The Stronghold',
          }),
        },
        autoRouteTrigger: null,
      };
    }

    const dungeon = findDungeonByZoneOrName(event.zoneId, event.zoneName);
    const diff = formatFellowshipDifficulty(event.difficultyRaw);
    const nextSlug = dungeon?.slug ?? current.dungeonSlug;
    return {
      nextRun: {
        ...current,
        status: 'in_dungeon',
        dungeonZoneId: event.zoneId,
        dungeonSlug: nextSlug,
        dungeonName: dungeon?.name ?? event.zoneName,
        difficultyRaw: event.difficultyRaw,
        difficultyLabel: diff.label,
        eternalLevel: diff.eternalLevel,
        killScoreTarget: dungeon?.killScoreTarget ?? current.killScoreTarget,
        recentEvents: appendFeed(current.recentEvents, {
          id: `${event.timestampIso}-zone-${event.zoneId}`,
          timestampIso: event.timestampIso,
          kind: 'zone',
          summary: `Entered ${dungeon?.name ?? event.zoneName} (${diff.label})`,
        }),
      },
      autoRouteTrigger: nextSlug
        ? {
            dungeonSlug: nextSlug,
            variant: current.detectedVariant,
            eternalLevel: diff.eternalLevel,
          }
        : null,
    };
  }

  if (event.kind === 'DUNGEON_START') {
    const dungeon = findDungeonByZoneOrName(event.zoneId, event.dungeonName);
    const diff = formatFellowshipDifficulty(event.difficultyRaw, event.isQuickPlay);
    const detectedVariant = detectVariantFromAffixes(event.affixes);
    const dungeonSlug = dungeon?.slug ?? null;

    return {
      nextRun: {
        status: 'in_dungeon',
        dungeonZoneId: event.zoneId,
        dungeonSlug,
        dungeonName: dungeon?.name ?? event.dungeonName,
        difficultyRaw: event.difficultyRaw,
        difficultyLabel: diff.label,
        eternalLevel: diff.eternalLevel,
        affixes: event.affixes,
        detectedVariant,
        startedAtIso: event.timestampIso,
        durationSeconds: null,
        timedSuccess: null,
        killScoreCurrent: 0,
        killScoreTarget: dungeon?.killScoreTarget ?? 200,
        activeEncounter: null,
        deaths: 0,
        units: {},
        recentEvents: appendFeed(current.recentEvents, {
          id: `${event.timestampIso}-start`,
          timestampIso: event.timestampIso,
          kind: 'dungeon_start',
          summary: `Started ${dungeon?.name ?? event.dungeonName} · ${diff.label} · ${detectedVariant} route`,
        }),
      },
      autoRouteTrigger: dungeonSlug
        ? {
            dungeonSlug,
            variant: detectedVariant,
            eternalLevel: diff.eternalLevel,
          }
        : null,
    };
  }

  if (event.kind === 'ENCOUNTER_START') {
    return {
      nextRun: {
        ...current,
        activeEncounter: event.encounterName,
        recentEvents: appendFeed(current.recentEvents, {
          id: `${event.timestampIso}-enc-start-${event.encounterId}`,
          timestampIso: event.timestampIso,
          kind: 'encounter',
          summary: `Pulled boss: ${event.encounterName}`,
        }),
      },
      autoRouteTrigger: null,
    };
  }

  if (event.kind === 'ENCOUNTER_END') {
    const outcome = event.success ? 'Defeated' : 'Wiped on';
    return {
      nextRun: {
        ...current,
        activeEncounter: null,
        recentEvents: appendFeed(current.recentEvents, {
          id: `${event.timestampIso}-enc-end-${event.encounterId}`,
          timestampIso: event.timestampIso,
          kind: 'encounter',
          summary: `${outcome} ${event.encounterName}`,
        }),
      },
      autoRouteTrigger: null,
    };
  }

  if (event.kind === 'UNIT_DEATH') {
    const nextUnits = { ...current.units };
    if (!event.isPlayer) {
      delete nextUnits[event.deadGuid];
    } else if (nextUnits[event.deadGuid]) {
      nextUnits[event.deadGuid] = { ...nextUnits[event.deadGuid], hpCurrent: 0 };
    }

    const scoreGain =
      event.killScore > 0 && event.killScore <= 1
        ? event.killScore * current.killScoreTarget * 0.12
        : event.killScore;
    const nextKillScore = event.isPlayer
      ? current.killScoreCurrent
      : Math.min(current.killScoreTarget, current.killScoreCurrent + Math.max(2, scoreGain));

    return {
      nextRun: {
        ...current,
        deaths: event.isPlayer ? current.deaths + 1 : current.deaths,
        killScoreCurrent: Math.round(nextKillScore * 10) / 10,
        units: nextUnits,
        recentEvents: appendFeed(current.recentEvents, {
          id: `${event.timestampIso}-death-${event.deadGuid}`,
          timestampIso: event.timestampIso,
          kind: event.isPlayer ? 'death' : 'kill',
          summary: event.isPlayer
            ? `${event.deadName} died`
            : `Slain: ${event.deadName}`,
        }),
      },
      autoRouteTrigger: null,
    };
  }

  if (event.kind === 'DUNGEON_END') {
    return {
      nextRun: {
        ...current,
        status: 'completed',
        activeEncounter: null,
        durationSeconds: event.durationSeconds,
        timedSuccess: event.timedSuccess,
        killScoreCurrent: event.success ? current.killScoreTarget : current.killScoreCurrent,
        recentEvents: appendFeed(current.recentEvents, {
          id: `${event.timestampIso}-end`,
          timestampIso: event.timestampIso,
          kind: 'dungeon_end',
          summary: `${event.dungeonName} ${event.success ? 'Completed' : 'Ended'}${
            event.durationSeconds ? ` in ${Math.round(event.durationSeconds)}s` : ''
          }`,
        }),
      },
      autoRouteTrigger: null,
    };
  }

  // COMBAT_TELEMETRY
  const nextUnits: Record<string, LiveUnitTelemetry> = { ...current.units };
  for (const sample of event.samples) {
    // Cap tracked hostile mobs so old trash doesn't clutter radar
    if (!sample.isPlayer && Object.keys(nextUnits).length > 18 && !nextUnits[sample.unitId]) {
      continue;
    }
    const prev = nextUnits[sample.unitId];
    const prevTrail = prev?.trail ?? [];
    const lastPt = prevTrail[prevTrail.length - 1];
    const movedEnough =
      !lastPt || Math.hypot(sample.x - lastPt.x, sample.y - lastPt.y) > 90;
    const trail = sample.isPlayer && movedEnough
      ? [...prevTrail.slice(-14), { x: sample.x, y: sample.y }]
      : prevTrail;

    nextUnits[sample.unitId] = {
      unitId: sample.unitId,
      name: sample.name,
      isPlayer: sample.isPlayer,
      role: prev?.role,
      x: sample.x,
      y: sample.y,
      facing: sample.facing,
      hpCurrent: sample.hpCurrent,
      hpMax: sample.hpMax,
      spiritPct: sample.spiritPct ?? prev?.spiritPct ?? null,
      lastSeenIso: event.timestampIso,
      trail,
    };
  }

  return {
    nextRun: {
      ...current,
      status: current.status === 'idle' ? 'in_dungeon' : current.status,
      units: nextUnits,
    },
    autoRouteTrigger: null,
  };
}

/**
 * Projects world-space (x, y) coordinates onto normalized [8..92] tactical map space.
 * Dynamically expands bounds if live combat coordinates exceed static dungeon bounds.
 */
export function projectUnitsToTacticalMap(
  units: readonly LiveUnitTelemetry[],
  staticBounds: WorldBounds
): Array<LiveUnitTelemetry & { mapX: number; mapY: number }> {
  if (units.length === 0) return [];

  let minX = staticBounds.minX;
  let maxX = staticBounds.maxX;
  let minY = staticBounds.minY;
  let maxY = staticBounds.maxY;

  for (const u of units) {
    if (u.x < minX) minX = u.x - 250;
    if (u.x > maxX) maxX = u.x + 250;
    if (u.y < minY) minY = u.y - 250;
    if (u.y > maxY) maxY = u.y + 250;
  }

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  return units.map((u) => ({
    ...u,
    mapX: 8 + ((u.x - minX) / spanX) * 84,
    mapY: 88 - ((u.y - minY) / spanY) * 76,
  }));
}
