import { createIdleLiveRunState, DUNGEONS } from './catalog.ts';
import type { CompletedDungeonClearTrigger } from './dungeonScore.ts';
import type {
  BossVariant,
  CombatFeedEntry,
  DungeonDefinition,
  LiveRelicTelemetry,
  LiveRunState,
  LiveUnitTelemetry,
  MemberProfile,
  WorldBounds,
} from './types.ts';

export interface RelicCastInfo {
  id: string;
  label: string;
  baseCooldownSec: number;
}

interface RelicDefinition {
  id: string;
  numericIds: readonly number[];
  pattern: RegExp;
  label: string;
  baseCooldownSec: number;
}

const RELIC_DEFINITIONS: readonly RelicDefinition[] = [
  {
    id: '5250',
    numericIds: [5250, 186, 4102],
    pattern: /\bsanctuary\b|sinbinding/i,
    label: 'Sinbind',
    baseCooldownSec: 180,
  },
  {
    id: '5247',
    numericIds: [5247, 188, 4107],
    pattern: /restore mana|al'zerac|\bchalice\b/i,
    label: 'Chalice',
    baseCooldownSec: 120,
  },
  {
    id: '5251',
    numericIds: [5251, 1952, 4109],
    pattern: /obsidian skin|obsidian sigil/i,
    label: 'Obsidian',
    baseCooldownSec: 60,
  },
  {
    id: '5252',
    numericIds: [5252, 1478, 4103],
    pattern: /chickenize|poultry fetish|\bpolymorph\b/i,
    label: 'Chicken',
    baseCooldownSec: 180,
  },
  {
    id: '5255',
    numericIds: [5255, 187, 4106],
    pattern: /major dispel|wardstone/i,
    label: 'Wardstone',
    baseCooldownSec: 120,
  },
  {
    id: '5249',
    numericIds: [5249, 185, 4105],
    pattern: /bloodrite drums|\bdrums\b/i,
    label: 'Drums',
    baseCooldownSec: 90,
  },
  {
    id: '5253',
    numericIds: [5253, 1486, 4108],
    pattern: /major invisibility|orb of shadows|group invisibility|shroud of shadows/i,
    label: 'Invis',
    baseCooldownSec: 360,
  },
  {
    id: '5246',
    numericIds: [5246, 1504, 4104],
    pattern: /conjure portal|portalstone|\bportal\b/i,
    label: 'Portal',
    baseCooldownSec: 120,
  },
  {
    id: '5254',
    numericIds: [5254, 22, 4110],
    pattern: /\brevive\b|grimoire of resurrection|\bresurrection\b/i,
    label: 'Brez',
    baseCooldownSec: 300,
  },
  {
    id: '5248',
    numericIds: [5248, 189, 4111],
    pattern: /\brejuvenate\b|saltwash/i,
    label: 'Saltwash',
    baseCooldownSec: 120,
  },
  {
    id: '5256',
    numericIds: [5256, 2073, 4112],
    pattern: /shard of antimatter|\bantimatter\b/i,
    label: 'Antimatter',
    baseCooldownSec: 90,
  },
  {
    id: 'passive-orb',
    numericIds: [],
    pattern:
      /orb of hidden riches|orb of gathering storms|orb of awakened gaze|orb of inner seas|orb of sanguine restoration/i,
    label: 'Orb',
    baseCooldownSec: 0,
  },
];

const RELIC_BY_NUMERIC_ID = new Map<number, RelicCastInfo>();
for (const def of RELIC_DEFINITIONS) {
  for (const numId of def.numericIds) {
    RELIC_BY_NUMERIC_ID.set(numId, {
      id: def.id,
      label: def.label,
      baseCooldownSec: def.baseCooldownSec,
    });
  }
}

export function matchRelicById(rawId: number | null | undefined): RelicCastInfo | null {
  if (rawId == null || !Number.isFinite(rawId)) return null;
  return RELIC_BY_NUMERIC_ID.get(rawId) ?? null;
}

export function matchRelicAbility(
  rawName: string | undefined,
  rawAbilityId?: number | null
): RelicCastInfo | null {
  const byId = matchRelicById(rawAbilityId);
  if (byId) return byId;
  if (!rawName) return null;
  const cleaned = rawName.trim().replace(/^\[?"+|"+\]?$/g, '');
  if (!cleaned) return null;
  for (const def of RELIC_DEFINITIONS) {
    if (def.pattern.test(cleaned)) {
      return {
        id: def.id,
        label: def.label,
        baseCooldownSec: def.baseCooldownSec,
      };
    }
  }
  return null;
}

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
  spiritCurrent?: number | null;
  spiritMax?: number | null;
  relicCast?: RelicCastInfo | null;
  spiritReset?: boolean;
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
      difficultyRaw?: number | null;
      success: boolean;
      durationSeconds: number | null;
      timedSuccess: boolean;
    }
  | {
      kind: 'COMBATANT_INFO';
      timestampIso: string;
      unitId: string;
      name: string;
      classId: number | null;
      spiritStat: number | null;
      spiritRegenPerSec: number | null;
      spiritCost: number;
      spiritMax: number;
      relicCooldownMultiplier: number;
      equippedRelics: RelicCastInfo[];
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
  completedClearTrigger?: CompletedDungeonClearTrigger | null;
}

const STRONGHOLD_ZONE_ID = 17;
const BLOODBOUND_SPIRIT_IDS = new Set([2296, 3242]);

function splitLogLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let squareDepth = 0;
  let roundDepth = 0;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }
    if (!inQuotes) {
      if (ch === '[') squareDepth++;
      else if (ch === ']') squareDepth = Math.max(0, squareDepth - 1);
      else if (ch === '(') roundDepth++;
      else if (ch === ')') roundDepth = Math.max(0, roundDepth - 1);

      if (ch === '|' && squareDepth === 0 && roundDepth === 0) {
        result.push(current);
        current = '';
        continue;
      }
    }
    current += ch;
  }
  result.push(current);
  return result;
}

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

function parseBracketNumbers(raw: string | undefined): number[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [];
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map((part) => Number.parseFloat(part.trim()))
    .filter((n) => Number.isFinite(n));
}

function parseAffixList(raw: string | undefined): number[] {
  return parseBracketNumbers(raw).map((n) => Math.trunc(n));
}

/**
 * Computes Ultimate (Spirit Ability) cost from Sapphire gem power (`stones[4]`):
 * - >= 1500 Sapphire (Essence of the Prophet II): -15% cost -> 85 Spirit
 * - >= 450 Sapphire (Essence of the Prophet I): -5% cost -> 95 Spirit
 * - < 450 Sapphire: 100 Spirit
 */
export function computeSpiritCostFromBlueStone(blueStone: number): number {
  if (blueStone >= 1500) return 85;
  if (blueStone >= 450) return 95;
  return 100;
}

/**
 * Computes maximum Spirit Point cap from Sapphire gem power (`stones[4]`):
 * - >= 600 Sapphire (Ancestral Surge II): 130 Spirit
 * - >= 100 Sapphire (Ancestral Surge I): 110 Spirit
 * - < 100 Sapphire: 100 Spirit
 */
export function computeSpiritMaxFromBlueStone(blueStone: number): number {
  if (blueStone >= 600) return 130;
  if (blueStone >= 100) return 110;
  return 100;
}

/**
 * Computes Relic cooldown multiplier from Diamond gem power (`stones[1]`):
 * - >= 1500 Diamond (Essence/Blessing of the Artisan II): -24% CD -> 0.76
 * - >= 450 Diamond (Essence/Blessing of the Artisan I): -8% CD -> 0.92
 * - < 450 Diamond: 1.0
 */
export function computeRelicCdrFromWhiteStone(whiteStone: number): number {
  if (whiteStone >= 1500) return 0.76;
  if (whiteStone >= 450) return 0.92;
  return 1;
}

function extractRelicsFromCombatantInfo(parts: readonly string[]): RelicCastInfo[] {
  const found = new Map<string, RelicCastInfo>();
  for (let i = 7; i < parts.length; i++) {
    const part = parts[i];
    if (!part || !part.includes('(')) continue;
    for (const match of part.matchAll(/\((\d+),/g)) {
      const idNum = Number.parseInt(match[1], 10);
      const relic = matchRelicById(idNum);
      if (relic && relic.baseCooldownSec > 0 && !found.has(relic.id)) {
        found.set(relic.id, relic);
        if (found.size >= 2) return [...found.values()];
      }
    }
  }
  return [...found.values()];
}

function extractSpiritResource(
  resourceBlob: string | undefined
): { current: number; max: number; pct: number } | null {
  if (!resourceBlob) return null;
  const match = /\(4,\s*([-\d.]+),\s*([-\d.]+)\)/.exec(resourceBlob);
  if (!match) return null;
  const cur = Number.parseFloat(match[1]);
  const max = Number.parseFloat(match[2]);
  if (!Number.isFinite(cur) || !Number.isFinite(max) || max <= 0) return null;
  const clampedCur = Math.max(0, cur);
  const clampedMax = Math.max(100, max);
  return {
    current: clampedCur,
    max: clampedMax,
    pct: Math.min(100, Math.max(0, (clampedCur / clampedMax) * 100)),
  };
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
  const spirit = extractSpiritResource(resBlob);

  return {
    unitId: guid.trim(),
    name: stripQuotes(rawName),
    isPlayer: guid.trim().startsWith('Player-'),
    x,
    y,
    facing,
    hpCurrent,
    hpMax,
    spiritPct: spirit?.pct ?? null,
    spiritCurrent: spirit?.current ?? null,
    spiritMax: spirit?.max ?? null,
  };
}

function isBloodboundSpiritAbility(
  abilityId: number | null,
  abilityName: string | undefined
): boolean {
  if (abilityId !== null && BLOODBOUND_SPIRIT_IDS.has(abilityId)) return true;
  if (!abilityName) return false;
  return stripQuotes(abilityName).toLowerCase() === 'bloodbound spirit';
}

/**
 * Parse, Don't Validate boundary: converts one pipe-delimited Fellowship CombatLog*.txt
 * line into a typed ParsedCombatEvent, or null if non-actionable.
 */
export function parseCombatLogLine(rawLine: string): ParsedCombatEvent | null {
  const trimmed = rawLine.trim();
  if (!trimmed) return null;

  const parts = splitLogLine(trimmed);
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
      difficultyRaw: parseIntSafe(parts[4]),
      success: parts[6]?.trim() === '1',
      durationSeconds: parseFloatSafe(parts[8]),
      timedSuccess: parts[9]?.trim() === '1',
    };
  }

  if (eventType === 'COMBATANT_INFO') {
    const unitId = (parts[3] ?? '').trim();
    if (!unitId.startsWith('Player-')) return null;
    const name = stripQuotes(parts[4] ?? 'Player');
    const classId = parseIntSafe(parts[6]);
    const stats = parseBracketNumbers(parts[8]);
    const spiritStat = stats.length > 0 ? stats[stats.length - 1] : null;
    const spiritRegenPerSec =
      spiritStat !== null ? Math.round((0.3 + spiritStat / 100) * 1000) / 1000 : null;
    const stones = parseBracketNumbers(parts[10]);
    const whiteStone = stones[1] ?? 0;
    const blueStone = stones[4] ?? 0;

    return {
      kind: 'COMBATANT_INFO',
      timestampIso,
      unitId,
      name,
      classId,
      spiritStat,
      spiritRegenPerSec,
      spiritCost: computeSpiritCostFromBlueStone(blueStone),
      spiritMax: computeSpiritMaxFromBlueStone(blueStone),
      relicCooldownMultiplier: computeRelicCdrFromWhiteStone(whiteStone),
      equippedRelics: extractRelicsFromCombatantInfo(parts),
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
    const abilityId = parseIntSafe(parts[6]);
    const abilityName = parts[7];
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
    if (srcSample?.isPlayer) {
      srcSample.relicCast = matchRelicAbility(abilityName, abilityId);
      if (isBloodboundSpiritAbility(abilityId, abilityName)) {
        srcSample.spiritReset = true;
      }
    }
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

  // 14/15-field cast/activation packets (ABILITY_ACTIVATED, ABILITY_CAST_START, ABILITY_CAST_SUCCESS, ABILITY_CAST_FAIL)
  if (
    parts.length >= 16 &&
    (eventType === 'ABILITY_ACTIVATED' ||
      eventType === 'ABILITY_CAST_START' ||
      eventType === 'ABILITY_CAST_SUCCESS' ||
      eventType === 'ABILITY_CAST_FAIL')
  ) {
    const abilityId = parseIntSafe(parts[4]);
    const abilityName = parts[5];
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
      if (srcSample.isPlayer && eventType !== 'ABILITY_CAST_FAIL') {
        srcSample.relicCast = matchRelicAbility(abilityName, abilityId);
        if (isBloodboundSpiritAbility(abilityId, abilityName)) {
          srcSample.spiritReset = true;
        }
      }
      return { kind: 'COMBAT_TELEMETRY', timestampIso, samples: [srcSample] };
    }
  }

  // Aura packets (EFFECT_APPLIED / EFFECT_REFRESHED / EFFECT_REMOVED) carrying target Spirit snapshot
  if (
    parts.length >= 18 &&
    (eventType === 'EFFECT_APPLIED' ||
      eventType === 'EFFECT_REFRESHED' ||
      eventType === 'EFFECT_REMOVED')
  ) {
    const abilityId = parseIntSafe(parts[6]);
    const abilityName = parts[7];
    const dstSample = buildSample(
      parts[4],
      parts[5],
      parts[11],
      parts[12],
      parts[14],
      parts[15],
      parts[16],
      parts[17]
    );
    if (dstSample?.isPlayer) {
      if (isBloodboundSpiritAbility(abilityId, abilityName)) {
        dstSample.spiritReset = true;
      }
      return { kind: 'COMBAT_TELEMETRY', timestampIso, samples: [dstSample] };
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

function advanceRelicsCooldowns(
  relics: readonly LiveRelicTelemetry[] | undefined,
  validLogMs: number | null,
  nowWallMs: number
): LiveRelicTelemetry[] {
  if (!relics || relics.length === 0) return [];
  if (validLogMs === null) return [...relics];
  return relics.map((r) => {
    if (r.castLogMs == null || r.cooldownTotalSec <= 0) return r;
    const elapsedSec = Math.max(0, (validLogMs - r.castLogMs) / 1000);
    return {
      ...r,
      cooldownSec: Math.max(0, Math.round(r.cooldownTotalSec - elapsedSec)),
      updatedAtMs: nowWallMs,
    };
  });
}

function applyRelicCastToSlots(
  existingRelics: readonly LiveRelicTelemetry[],
  cast: RelicCastInfo,
  cdrMultiplier: number,
  validLogMs: number | null,
  nowWallMs: number
): LiveRelicTelemetry[] {
  if (cast.baseCooldownSec <= 0) return [...existingRelics];
  const effectiveTotalSec = Math.max(
    1,
    Math.round(cast.baseCooldownSec * cdrMultiplier)
  );
  const updatedEntry: LiveRelicTelemetry = {
    id: cast.id,
    label: cast.label,
    baseCooldownSec: cast.baseCooldownSec,
    cooldownTotalSec: effectiveTotalSec,
    cooldownSec: effectiveTotalSec,
    castLogMs: validLogMs,
    updatedAtMs: nowWallMs,
  };

  const existingIdx = existingRelics.findIndex((r) => r.id === cast.id);
  if (existingIdx >= 0) {
    const copy = [...existingRelics];
    copy[existingIdx] = updatedEntry;
    return copy;
  }

  if (existingRelics.length < 2) {
    return [...existingRelics, updatedEntry];
  }

  // Replace whichever slot has the oldest or null cast timestamp
  const replaceIdx =
    (existingRelics[0].castLogMs ?? -1) <= (existingRelics[1].castLogMs ?? -1)
      ? 0
      : 1;
  const copy = [...existingRelics];
  copy[replaceIdx] = updatedEntry;
  return copy;
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

  if (event.kind === 'COMBATANT_INFO') {
    const prev = current.units[event.unitId];
    const nowWallMs = Date.now();
    const mergedRelics: LiveRelicTelemetry[] = event.equippedRelics
      .slice(0, 2)
      .map((meta) => {
        const existingSlot = prev?.relics?.find((r) => r.id === meta.id);
        const effectiveTotal = Math.max(
          1,
          Math.round(meta.baseCooldownSec * event.relicCooldownMultiplier)
        );
        if (existingSlot) {
          return {
            ...existingSlot,
            label: meta.label,
            baseCooldownSec: meta.baseCooldownSec,
            cooldownTotalSec: effectiveTotal,
          };
        }
        return {
          id: meta.id,
          label: meta.label,
          baseCooldownSec: meta.baseCooldownSec,
          cooldownTotalSec: effectiveTotal,
          cooldownSec: 0,
          castLogMs: null,
          updatedAtMs: nowWallMs,
        };
      });

    const resolvedRelics =
      mergedRelics.length > 0 ? mergedRelics : (prev?.relics ?? []);
    const baselineGainRate =
      event.spiritRegenPerSec != null
        ? Math.max(1.2, Math.round(event.spiritRegenPerSec * 1.15 * 100) / 100)
        : (prev?.spiritGainRatePerSec ?? 1.5);

    return {
      nextRun: {
        ...current,
        status: current.status === 'idle' ? 'in_dungeon' : current.status,
        units: {
          ...current.units,
          [event.unitId]: {
            unitId: event.unitId,
            name: event.name || prev?.name || 'Player',
            isPlayer: true,
            role: prev?.role,
            classId: event.classId ?? prev?.classId ?? null,
            x: prev?.x ?? 0,
            y: prev?.y ?? 0,
            facing: prev?.facing ?? 0,
            hpCurrent: prev?.hpCurrent ?? 100,
            hpMax: prev?.hpMax ?? 100,
            spiritPct: prev?.spiritPct ?? null,
            spiritCurrent: prev?.spiritCurrent ?? null,
            spiritMax: event.spiritMax,
            spiritCost: event.spiritCost,
            spiritRegenPerSec: event.spiritRegenPerSec ?? prev?.spiritRegenPerSec ?? null,
            spiritGainRatePerSec: prev?.spiritGainRatePerSec ?? baselineGainRate,
            spiritLogMs: prev?.spiritLogMs ?? null,
            spiritUpdatedAtMs: prev?.spiritUpdatedAtMs ?? nowWallMs,
            relicCooldownMultiplier: event.relicCooldownMultiplier,
            relics: resolvedRelics,
            lastSeenIso: event.timestampIso,
            trail: prev?.trail ?? [],
          },
        },
      },
      autoRouteTrigger: null,
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
      : Math.min(
          current.killScoreTarget,
          current.killScoreCurrent + Math.max(2, scoreGain)
        );

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
    const fallbackDungeon = findDungeonByZoneOrName(
      event.zoneId,
      event.dungeonName
    );
    const resolvedSlug = current.dungeonSlug ?? fallbackDungeon?.slug ?? null;
    const resolvedDifficultyRaw =
      current.difficultyRaw ?? event.difficultyRaw ?? null;
    const participantNames = Object.values(current.units)
      .filter((u) => u.isPlayer)
      .map((u) => u.name);

    const completedClearTrigger: CompletedDungeonClearTrigger | null =
      event.success && resolvedSlug && resolvedDifficultyRaw && resolvedDifficultyRaw > 0
        ? {
            dungeonSlug: resolvedSlug,
            difficultyRaw: resolvedDifficultyRaw,
            timedSuccess: event.timedSuccess,
            durationSeconds: event.durationSeconds,
            participantNames,
            timestampIso: event.timestampIso,
          }
        : null;

    return {
      nextRun: {
        ...current,
        status: 'completed',
        dungeonSlug: resolvedSlug,
        difficultyRaw: resolvedDifficultyRaw,
        activeEncounter: null,
        durationSeconds: event.durationSeconds,
        timedSuccess: event.timedSuccess,
        killScoreCurrent: event.success
          ? current.killScoreTarget
          : current.killScoreCurrent,
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
      completedClearTrigger,
    };
  }

  // COMBAT_TELEMETRY
  const nextUnits: Record<string, LiveUnitTelemetry> = { ...current.units };
  const parsedLogMs = Date.parse(event.timestampIso);
  const validLogMs = Number.isFinite(parsedLogMs) ? parsedLogMs : null;
  const nowWallMs = Date.now();

  if (validLogMs !== null) {
    for (const [uid, existing] of Object.entries(nextUnits)) {
      if (existing.isPlayer && existing.relics && existing.relics.length > 0) {
        nextUnits[uid] = {
          ...existing,
          relics: advanceRelicsCooldowns(existing.relics, validLogMs, nowWallMs),
        };
      }
    }
  }

  for (const sample of event.samples) {
    // Cap tracked hostile mobs so old trash doesn't clutter radar
    if (
      !sample.isPlayer &&
      Object.keys(nextUnits).length > 18 &&
      !nextUnits[sample.unitId]
    ) {
      continue;
    }
    const prev = nextUnits[sample.unitId];
    const prevTrail = prev?.trail ?? [];
    const lastPt = prevTrail[prevTrail.length - 1];
    const movedEnough =
      !lastPt || Math.hypot(sample.x - lastPt.x, sample.y - lastPt.y) > 90;
    const trail =
      sample.isPlayer && movedEnough
        ? [...prevTrail.slice(-14), { x: sample.x, y: sample.y }]
        : prevTrail;

    const cdrMultiplier = prev?.relicCooldownMultiplier ?? 1;
    let nextRelics = prev?.relics ?? [];
    if (sample.isPlayer && sample.relicCast) {
      nextRelics = applyRelicCastToSlots(
        nextRelics,
        sample.relicCast,
        cdrMultiplier,
        validLogMs,
        nowWallMs
      );
    }

    const prevSpirit = prev?.spiritCurrent ?? null;
    const prevSpiritLogMs = prev?.spiritLogMs ?? null;
    const rawSampleSpirit = sample.spiritReset
      ? 0
      : (sample.spiritCurrent ?? null);
    const nextSpiritCurrent = rawSampleSpirit ?? prevSpirit ?? null;
    const nextSpiritMax = Math.max(
      prev?.spiritMax ?? 100,
      sample.spiritMax ?? 100
    );

    let nextSpiritCost = prev?.spiritCost ?? 100;
    if (
      prevSpirit !== null &&
      rawSampleSpirit !== null &&
      rawSampleSpirit < prevSpirit - 65
    ) {
      // Auto-infer Prophet cost reduction when observing an Ultimate spend without COMBATANT_INFO
      if (prevSpirit >= 84 && prevSpirit < 95) {
        nextSpiritCost = Math.min(nextSpiritCost, 85);
      } else if (prevSpirit >= 95 && prevSpirit < 100) {
        nextSpiritCost = Math.min(nextSpiritCost, 95);
      }
    }

    const passiveRegen = prev?.spiritRegenPerSec ?? null;
    const baselineRate =
      passiveRegen != null
        ? Math.max(1.2, Math.round(passiveRegen * 1.15 * 100) / 100)
        : 1.5;
    let nextGainRate = prev?.spiritGainRatePerSec ?? baselineRate;
    if (
      prevSpirit !== null &&
      rawSampleSpirit !== null &&
      rawSampleSpirit > prevSpirit &&
      prevSpiritLogMs !== null &&
      validLogMs !== null
    ) {
      const dtSec = (validLogMs - prevSpiritLogMs) / 1000;
      if (dtSec >= 0.25 && dtSec <= 45) {
        const instantRate = Math.min(
          6.0,
          Math.max(0.4, (rawSampleSpirit - prevSpirit) / dtSec)
        );
        nextGainRate = Math.round((0.6 * nextGainRate + 0.4 * instantRate) * 100) / 100;
      }
    }

    const hasFreshSpirit = rawSampleSpirit !== null;

    nextUnits[sample.unitId] = {
      unitId: sample.unitId,
      name: sample.name,
      isPlayer: sample.isPlayer,
      role: prev?.role,
      classId: prev?.classId ?? null,
      x: sample.x,
      y: sample.y,
      facing: sample.facing,
      hpCurrent: sample.hpCurrent,
      hpMax: sample.hpMax,
      spiritPct: sample.spiritReset ? 0 : (sample.spiritPct ?? prev?.spiritPct ?? null),
      spiritCurrent: nextSpiritCurrent,
      spiritMax: nextSpiritMax,
      spiritCost: nextSpiritCost,
      spiritRegenPerSec: passiveRegen,
      spiritGainRatePerSec: nextGainRate,
      spiritLogMs: hasFreshSpirit ? validLogMs : (prev?.spiritLogMs ?? null),
      spiritUpdatedAtMs: hasFreshSpirit ? nowWallMs : (prev?.spiritUpdatedAtMs ?? null),
      relicCooldownMultiplier: cdrMultiplier,
      relics: nextRelics,
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

export function formatCooldownClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export interface HudAbilitySlot {
  label: string;
  statusText: string;
  fullText: string;
  isReady: boolean;
  isPassive?: boolean;
  remainingSec: number | null;
}

export interface UnitAbilityHudSummary {
  unitId: string;
  name: string;
  ult: HudAbilitySlot;
  relics: [HudAbilitySlot, HudAbilitySlot];
}

function resolveMemberEquippedRelics(
  unitName: string,
  members: readonly MemberProfile[] | undefined
): RelicCastInfo[] {
  if (!members || members.length === 0) return [];
  const normalized = unitName.trim().toLowerCase();
  const member = members.find(
    (m) => m.displayName.trim().toLowerCase() === normalized
  );
  if (!member) return [];
  const activeChar =
    member.characters.find((c) => c.id === member.activeCharacterId) ??
    member.characters[0];
  const activeSet =
    activeChar?.bisSets.find((s) => s.id === activeChar.activeBisSetId) ??
    activeChar?.bisSets[0];
  if (!activeSet) return [];

  const equipped: RelicCastInfo[] = [];
  const relicSlotOrder: Array<'Relic 1' | 'Relic 2'> = ['Relic 1', 'Relic 2'];
  for (const slotName of relicSlotOrder) {
    const item = activeSet.items.find((it) => it.slot === slotName);
    if (!item) continue;
    const matched = matchRelicAbility(item.itemName);
    if (matched) {
      equipped.push(matched);
    }
  }
  return equipped;
}

/**
 * Pure computation of Ultimate readiness/ETA (accounting for Sapphire cost reduction)
 * and 2-slot Relic readiness/cooldowns (accounting for Diamond Relic CDR) for map HUD rendering.
 */
export function computeUnitAbilityHud(
  unit: LiveUnitTelemetry,
  members: readonly MemberProfile[] | undefined,
  nowMs: number,
  isLiveInDungeon: boolean
): UnitAbilityHudSummary {
  // 1. Ultimate (Spirit Ability) readiness & time-to-ready
  const cost = unit.spiritCost ?? 100;
  const max = Math.max(cost, unit.spiritMax ?? 100);
  const passiveRegen = unit.spiritRegenPerSec ?? 0;
  const elapsedSpiritSec =
    isLiveInDungeon && unit.spiritUpdatedAtMs != null
      ? Math.max(0, (nowMs - unit.spiritUpdatedAtMs) / 1000)
      : 0;
  const baseSpirit = unit.spiritCurrent ?? unit.spiritPct ?? null;

  let ult: HudAbilitySlot;
  if (baseSpirit === null) {
    ult = {
      label: 'Ult',
      statusText: '—',
      fullText: 'Ult —',
      isReady: false,
      remainingSec: null,
    };
  } else {
    const liveSpirit = Math.min(max, baseSpirit + elapsedSpiritSec * passiveRegen);
    if (liveSpirit >= cost - 0.05) {
      ult = {
        label: 'Ult',
        statusText: 'RDY',
        fullText: 'Ult RDY',
        isReady: true,
        remainingSec: 0,
      };
    } else {
      const deficit = Math.max(0, cost - liveSpirit);
      const gainRate = Math.max(
        0.5,
        unit.spiritGainRatePerSec ?? Math.max(1.2, passiveRegen || 1.5)
      );
      const rawEtaSec = Math.ceil(deficit / gainRate);
      const etaSec =
        passiveRegen > 0
          ? Math.max(1, rawEtaSec)
          : Math.max(1, rawEtaSec - Math.floor(elapsedSpiritSec));
      const clock = formatCooldownClock(etaSec);
      ult = {
        label: 'Ult',
        statusText: clock,
        fullText: `Ult ${clock}`,
        isReady: false,
        remainingSec: etaSec,
      };
    }
  }

  // 2. Two Relic slots (COMBATANT_INFO + live casts + BIS Relic 1/2 fallback)
  const mergedRelics: LiveRelicTelemetry[] = [...(unit.relics ?? [])];
  if (mergedRelics.length < 2) {
    const bisRelics = resolveMemberEquippedRelics(unit.name, members);
    const cdr = unit.relicCooldownMultiplier ?? 1;
    for (const bis of bisRelics) {
      if (mergedRelics.length >= 2) break;
      const alreadyTracked =
        bis.id !== 'passive-orb' && mergedRelics.some((r) => r.id === bis.id);
      if (alreadyTracked) continue;
      mergedRelics.push({
        id: bis.id,
        label: bis.label,
        baseCooldownSec: bis.baseCooldownSec,
        cooldownTotalSec:
          bis.baseCooldownSec > 0
            ? Math.max(1, Math.round(bis.baseCooldownSec * cdr))
            : 0,
        cooldownSec: 0,
        castLogMs: null,
        updatedAtMs: null,
      });
    }
  }

  const buildRelicSlot = (
    relic: LiveRelicTelemetry | undefined,
    slotIndex: 0 | 1
  ): HudAbilitySlot => {
    if (!relic) {
      const fallbackLabel = slotIndex === 0 ? 'R1' : 'R2';
      return {
        label: fallbackLabel,
        statusText: 'RDY',
        fullText: `${fallbackLabel} RDY`,
        isReady: true,
        remainingSec: 0,
      };
    }
    if (relic.baseCooldownSec <= 0) {
      return {
        label: relic.label,
        statusText: '—',
        fullText: `${relic.label} —`,
        isReady: false,
        isPassive: true,
        remainingSec: null,
      };
    }
    const liveDec =
      isLiveInDungeon && relic.updatedAtMs != null
        ? Math.max(0, Math.floor((nowMs - relic.updatedAtMs) / 1000))
        : 0;
    const remainingSec = Math.max(0, relic.cooldownSec - liveDec);
    if (remainingSec <= 0) {
      return {
        label: relic.label,
        statusText: 'RDY',
        fullText: `${relic.label} RDY`,
        isReady: true,
        remainingSec: 0,
      };
    }
    const clock = formatCooldownClock(remainingSec);
    return {
      label: relic.label,
      statusText: clock,
      fullText: `${relic.label} ${clock}`,
      isReady: false,
      remainingSec,
    };
  };

  return {
    unitId: unit.unitId,
    name: unit.name,
    ult,
    relics: [buildRelicSlot(mergedRelics[0], 0), buildRelicSlot(mergedRelics[1], 1)],
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
  const positioned = units.filter((u) => !(u.x === 0 && u.y === 0));
  if (positioned.length === 0) return [];

  let minX = staticBounds.minX;
  let maxX = staticBounds.maxX;
  let minY = staticBounds.minY;
  let maxY = staticBounds.maxY;

  for (const u of positioned) {
    if (u.x < minX) minX = u.x - 250;
    if (u.x > maxX) maxX = u.x + 250;
    if (u.y < minY) minY = u.y - 250;
    if (u.y > maxY) maxY = u.y + 250;
  }

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  return positioned.map((u) => ({
    ...u,
    mapX: 8 + ((u.x - minX) / spanX) * 84,
    mapY: 88 - ((u.y - minY) / spanY) * 76,
  }));
}
