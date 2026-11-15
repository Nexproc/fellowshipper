import { HEROES } from './catalog.ts';
import type {
  BisItemEntry,
  BisSet,
  BossVariant,
  CharacterProfile,
  DungeonDefinition,
  EternalChecklistRow,
  HeroDefinition,
  MemberProfile,
  RoutePlan,
} from './types.ts';

export interface MemberItemNeed {
  memberId: string;
  memberName: string;
  hero: HeroDefinition;
  characterId: string;
  bisSetId: string;
  items: BisItemEntry[];
  unacquiredCount: number;
}

export interface DungeonPunchRow {
  dungeon: DungeonDefinition;
  totalNeeded: number;
  totalAcquired: number;
  memberNeeds: MemberItemNeed[];
}

export interface PunchListSummary {
  rows: DungeonPunchRow[];
  totalPartyItemsNeeded: number;
  totalPartyItemsAcquired: number;
  topPriorityDungeon: DungeonPunchRow | null;
  anyDungeonNeeds: MemberItemNeed[];
  anyDungeonTotalNeeded: number;
}

const EMISSARY_ORDER: readonly ('Ghorn' | 'Krumbug' | 'Eira')[] = [
  'Ghorn',
  'Krumbug',
  'Eira',
] as const;

export function findHero(heroId: string): HeroDefinition {
  return HEROES.find((h) => h.id === heroId) ?? HEROES[0];
}

export function resolveActiveCharacter(member: MemberProfile): {
  character: CharacterProfile;
  hero: HeroDefinition;
  bisSet: BisSet;
} | null {
  if (member.characters.length === 0) {
    return null;
  }
  const character =
    member.characters.find((c) => c.id === member.activeCharacterId) ??
    member.characters[0];
  if (character.bisSets.length === 0) {
    return null;
  }
  const bisSet =
    character.bisSets.find((s) => s.id === character.activeBisSetId) ??
    character.bisSets[0];
  return {
    character,
    hero: findHero(character.heroId),
    bisSet,
  };
}

export function computeDungeonPunchList(
  members: readonly MemberProfile[],
  dungeons: readonly DungeonDefinition[]
): PunchListSummary {
  const activeParty = members.filter((m) => m.inParty);

  const rows: DungeonPunchRow[] = dungeons.map((dungeon) => {
    const memberNeeds: MemberItemNeed[] = [];
    let totalNeeded = 0;
    let totalAcquired = 0;

    for (const member of activeParty) {
      const resolved = resolveActiveCharacter(member);
      if (!resolved) continue;

      const matching = resolved.bisSet.items.filter(
        (item) => item.dungeonSlug === dungeon.slug
      );
      if (matching.length === 0) continue;

      const unacquiredCount = matching.filter((i) => !i.acquired).length;
      const acquiredCount = matching.length - unacquiredCount;
      totalNeeded += unacquiredCount;
      totalAcquired += acquiredCount;

      memberNeeds.push({
        memberId: member.id,
        memberName: member.displayName,
        hero: resolved.hero,
        characterId: resolved.character.id,
        bisSetId: resolved.bisSet.id,
        items: matching,
        unacquiredCount,
      });
    }

    return {
      dungeon,
      totalNeeded,
      totalAcquired,
      memberNeeds,
    };
  });

  rows.sort((a, b) => {
    if (b.totalNeeded !== a.totalNeeded) {
      return b.totalNeeded - a.totalNeeded;
    }
    return a.dungeon.name.localeCompare(b.dungeon.name);
  });

  const anyDungeonNeeds: MemberItemNeed[] = [];
  let anyDungeonTotalNeeded = 0;
  for (const member of activeParty) {
    const resolved = resolveActiveCharacter(member);
    if (!resolved) continue;
    const matching = resolved.bisSet.items.filter(
      (item) => item.dungeonSlug === 'any-dungeon'
    );
    if (matching.length === 0) continue;
    const unacquiredCount = matching.filter((i) => !i.acquired).length;
    anyDungeonTotalNeeded += unacquiredCount;
    anyDungeonNeeds.push({
      memberId: member.id,
      memberName: member.displayName,
      hero: resolved.hero,
      characterId: resolved.character.id,
      bisSetId: resolved.bisSet.id,
      items: matching,
      unacquiredCount,
    });
  }

  const totalPartyItemsNeeded = rows.reduce((sum, r) => sum + r.totalNeeded, 0);
  const totalPartyItemsAcquired = rows.reduce((sum, r) => sum + r.totalAcquired, 0);

  return {
    rows,
    totalPartyItemsNeeded,
    totalPartyItemsAcquired,
    topPriorityDungeon: rows.find((r) => r.totalNeeded > 0) ?? null,
    anyDungeonNeeds,
    anyDungeonTotalNeeded,
  };
}

/**
 * Exact ETERNAL_SCORE formula from Fellowship Dungeon Sheets -> Variables:
 * Eternal 1 timed = 615, +15 per additional Eternal level.
 */
export function computeEternalTargetScore(eternalLevel: number): number {
  const clamped = Math.max(1, Math.floor(eternalLevel));
  return 615 + 15 * (clamped - 1);
}

export function computeEternalSummary(
  checklist: readonly EternalChecklistRow[],
  mountGoal = 10000
): {
  currentTotal: number;
  projectedTotal: number;
  pointsRemaining: number;
  completedCount: number;
} {
  let currentTotal = 0;
  let projectedTotal = 0;
  let completedCount = 0;

  for (const row of checklist) {
    const targetScore = computeEternalTargetScore(row.targetLevel);
    currentTotal += row.currentScore;
    projectedTotal += Math.max(row.currentScore, targetScore);
    if (row.finished || row.currentScore >= targetScore) {
      completedCount += 1;
    }
  }

  return {
    currentTotal,
    projectedTotal,
    pointsRemaining: Math.max(0, mountGoal - currentTotal),
    completedCount,
  };
}

/**
 * Predicts which Emissary miniboss (Ghorn, Krumbug, Eira) aligns with a given Eternal level
 * based on the dungeon's rotation cadence from Fellowship Dungeon Sheets (Sheet4).
 */
export function predictEmissaryVariant(
  dungeon: DungeonDefinition,
  eternalLevel: number
): 'Ghorn' | 'Krumbug' | 'Eira' {
  const startIdx = EMISSARY_ORDER.indexOf(dungeon.firstBoss);
  if (eternalLevel <= dungeon.firstLevel) {
    return dungeon.firstBoss;
  }
  const steps = Math.round((eternalLevel - dungeon.firstLevel) / dungeon.everyXLevels);
  const idx = ((startIdx + steps) % 3 + 3) % 3;
  return EMISSARY_ORDER[idx];
}

export function resolveRoutesForDungeon(
  builtInRoutes: readonly RoutePlan[],
  customRoutes: readonly RoutePlan[],
  dungeonSlug: string
): RoutePlan[] {
  return [...customRoutes, ...builtInRoutes].filter(
    (route) => route.dungeonSlug === dungeonSlug
  );
}

export function selectBestRoute(
  allRoutes: readonly RoutePlan[],
  dungeonSlug: string,
  preferredVariant: BossVariant
): RoutePlan | null {
  const candidates = allRoutes.filter((r) => r.dungeonSlug === dungeonSlug);
  if (candidates.length === 0) return null;

  const exact = candidates.find((r) => r.variant === preferredVariant);
  if (exact) return exact;

  const regular = candidates.find((r) => r.variant === 'Regular');
  return regular ?? candidates[0];
}

export function formatDurationSeconds(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
