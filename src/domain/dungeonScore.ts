import type {
  DifficultyLeague,
  DungeonDefinition,
  EternalChecklistRow,
  MemberDungeonClear,
  MemberProfile,
  PartySyncState,
} from './types.ts';

export const DIFFICULTY_LEAGUES: readonly DifficultyLeague[] = [
  'Contender',
  'Adept',
  'Champion',
  'Paragon',
  'Eternal',
];

const LEAGUE_COMPACT_PREFIX: Record<DifficultyLeague, string> = {
  Contender: 'Co',
  Adept: 'Ad',
  Champion: 'Ch',
  Paragon: 'P',
  Eternal: 'E',
};

const LEAGUE_BASE_TIMED_SCORE: Record<DifficultyLeague, number> = {
  Contender: 135,
  Adept: 255,
  Champion: 375,
  Paragon: 495,
  Eternal: 615,
};

export interface CompletedDungeonClearTrigger {
  dungeonSlug: string;
  difficultyRaw: number;
  timedSuccess: boolean | null;
  durationSeconds: number | null;
  participantNames: string[];
  timestampIso: string;
}

export interface MemberLowestDungeonEntry {
  dungeon: DungeonDefinition;
  currentScore: number;
  clear: MemberDungeonClear | null;
}

export interface MemberProgressionSummary {
  memberId: string;
  displayName: string;
  inParty: boolean;
  /** Sum of dungeon scores across the evaluated dungeon pool (Season 2 by default) */
  totalScore: number;
  /** Sum of dungeon scores across all known dungeons including Legacy S1 */
  allTimeScore: number;
  highestClear: MemberDungeonClear | null;
  clearedCount: number;
  timedCount: number;
  totalDungeons: number;
  lowestDungeon: MemberLowestDungeonEntry | null;
  pointsToGoal: number;
  progressPct: number;
}

export interface PartyDungeonOpportunity {
  dungeon: DungeonDefinition;
  averageScore: number;
  lowestMemberScore: number;
  unearnedMemberNames: string[];
}

export interface PartyProgressionSummary {
  memberSummaries: MemberProgressionSummary[];
  activeMemberSummaries: MemberProgressionSummary[];
  averageScore: number;
  highestPartyScore: number;
  lowestPartyScore: number;
  partyHighestClear: MemberDungeonClear | null;
  recommendedNextDungeon: PartyDungeonOpportunity | null;
}

export function maxLevelForLeague(league: DifficultyLeague): number {
  return league === 'Eternal' ? 60 : 7;
}

export function clampLevelForLeague(
  league: DifficultyLeague,
  level: number
): number {
  const safe = Number.isFinite(level) ? Math.round(level) : 1;
  return Math.max(1, Math.min(maxLevelForLeague(league), safe));
}

/**
 * Maps a Fellowship league + level to its monotonic raw difficulty ID:
 * - Contender 1..7  -> 1..7
 * - Adept 1..7      -> 9..15
 * - Champion 1..7   -> 17..23
 * - Paragon 1..7    -> 25..31
 * - Eternal 1..N    -> 32 + N (33+)
 */
export function toDifficultyRaw(
  league: DifficultyLeague,
  level: number
): number {
  const clamped = clampLevelForLeague(league, level);
  switch (league) {
    case 'Contender':
      return clamped;
    case 'Adept':
      return 8 + clamped;
    case 'Champion':
      return 16 + clamped;
    case 'Paragon':
      return 24 + clamped;
    case 'Eternal':
      return 32 + Math.max(1, Math.round(level));
  }
}

/**
 * Converts a raw Fellowship CombatLog difficulty integer into structured { league, level }.
 * Returns null for Quick Play or invalid difficulty IDs (<= 0).
 */
export function fromDifficultyRaw(
  difficultyRaw: number | null | undefined
): { league: DifficultyLeague; level: number } | null {
  if (
    difficultyRaw === null ||
    difficultyRaw === undefined ||
    !Number.isFinite(difficultyRaw)
  ) {
    return null;
  }
  const raw = Math.round(difficultyRaw);
  if (raw <= 0) return null;
  if (raw >= 33) {
    return { league: 'Eternal', level: raw - 32 };
  }
  if (raw >= 25) {
    return { league: 'Paragon', level: Math.min(7, raw - 24) };
  }
  if (raw === 24) {
    return { league: 'Champion', level: 7 };
  }
  if (raw >= 17) {
    return { league: 'Champion', level: Math.min(7, raw - 16) };
  }
  if (raw === 16) {
    return { league: 'Adept', level: 7 };
  }
  if (raw >= 9) {
    return { league: 'Adept', level: Math.min(7, raw - 8) };
  }
  return { league: 'Contender', level: Math.min(7, raw) };
}

/**
 * Estimates standard Fellowship Dungeon Rating for a difficulty clear.
 * Matches `ETERNAL_SCORE = 615 + 15 * (level - 1)` for Eternal 1+,
 * with +15 per step within Challenger leagues and +30 across League Capstone promotions.
 */
export function estimateDungeonClearScore(
  league: DifficultyLeague,
  level: number,
  timed = true
): number {
  const normalizedLevel =
    league === 'Eternal'
      ? Math.max(1, Math.round(level || 1))
      : clampLevelForLeague(league, level);
  const baseTimed =
    LEAGUE_BASE_TIMED_SCORE[league] + 15 * (normalizedLevel - 1);
  return timed ? baseTimed : Math.max(50, baseTimed - 15);
}

export function formatDungeonClearLabel(
  clear: Pick<MemberDungeonClear, 'league' | 'level' | 'timed'> | null | undefined,
  options?: { compact?: boolean; showTiming?: boolean }
): string {
  if (!clear) {
    return options?.compact ? '—' : 'No Clear';
  }
  const compact = options?.compact ?? false;
  const showTiming = options?.showTiming ?? true;
  const tierText = compact
    ? `${LEAGUE_COMPACT_PREFIX[clear.league]}${clear.level}`
    : `${clear.league} ${clear.level}`;

  if (!showTiming) return tierText;
  if (clear.timed) return `${tierText} ★`;
  return compact ? `${tierText} OT` : `${tierText} (OT)`;
}

/**
 * Positive if `a` is strictly higher progression than `b`, negative if lower, 0 if tied.
 * Orders by difficulty tier first, then timed over overtime, then score.
 */
export function compareDungeonClears(
  a: MemberDungeonClear | null | undefined,
  b: MemberDungeonClear | null | undefined
): number {
  if (!a && !b) return 0;
  if (a && !b) return 1;
  if (!a && b) return -1;
  const left = a as MemberDungeonClear;
  const right = b as MemberDungeonClear;

  const rawDiff =
    toDifficultyRaw(left.league, left.level) -
    toDifficultyRaw(right.league, right.level);
  if (rawDiff !== 0) return rawDiff;

  const timedDiff = (left.timed ? 1 : 0) - (right.timed ? 1 : 0);
  if (timedDiff !== 0) return timedDiff;

  return left.score - right.score;
}

/**
 * Merges a newly completed run with an existing personal best on the same dungeon.
 * Never regresses either the highest cleared difficulty or the best earned score.
 */
export function mergeHigherDungeonClear(
  existing: MemberDungeonClear | undefined,
  incoming: MemberDungeonClear
): MemberDungeonClear {
  if (!existing) return incoming;

  const bestScore = Math.max(existing.score, incoming.score);
  const bestDuration =
    existing.bestDurationSeconds != null && incoming.bestDurationSeconds != null
      ? Math.min(existing.bestDurationSeconds, incoming.bestDurationSeconds)
      : (incoming.bestDurationSeconds ?? existing.bestDurationSeconds ?? null);

  if (compareDungeonClears(incoming, existing) >= 0) {
    return {
      ...incoming,
      score: bestScore,
      bestDurationSeconds: bestDuration,
    };
  }

  return {
    ...existing,
    score: bestScore,
    bestDurationSeconds: bestDuration,
  };
}

export function computeMemberProgressionSummary(
  member: MemberProfile,
  dungeons: readonly DungeonDefinition[],
  options?: { seasonOnly?: boolean; goalScore?: number }
): MemberProgressionSummary {
  const seasonOnly = options?.seasonOnly ?? true;
  const goalScore = options?.goalScore ?? 10_000;
  const clears = member.dungeonClears ?? {};

  const pool = seasonOnly
    ? dungeons.filter((d) => d.seasonStatus === 'season-2')
    : dungeons;

  let totalScore = 0;
  let clearedCount = 0;
  let timedCount = 0;
  let highestClear: MemberDungeonClear | null = null;
  let lowestDungeon: MemberLowestDungeonEntry | null = null;

  for (const dungeon of pool) {
    const clear = clears[dungeon.slug] ?? null;
    const mapScore = clear ? Math.max(0, clear.score) : 0;
    totalScore += mapScore;

    if (clear) {
      clearedCount += 1;
      if (clear.timed) timedCount += 1;
      if (compareDungeonClears(clear, highestClear) > 0) {
        highestClear = clear;
      }
    }

    if (
      lowestDungeon === null ||
      mapScore < lowestDungeon.currentScore ||
      (mapScore === lowestDungeon.currentScore &&
        compareDungeonClears(clear, lowestDungeon.clear) < 0)
    ) {
      lowestDungeon = {
        dungeon,
        currentScore: mapScore,
        clear,
      };
    }
  }

  let allTimeScore = 0;
  for (const dungeon of dungeons) {
    const clear = clears[dungeon.slug];
    if (clear) {
      allTimeScore += Math.max(0, clear.score);
      if (!seasonOnly && compareDungeonClears(clear, highestClear) > 0) {
        highestClear = clear;
      }
    }
  }
  // If a player only has clears on legacy maps while viewing Season 2, still surface their highest overall clear if Season 2 has none
  if (!highestClear) {
    for (const clear of Object.values(clears)) {
      if (compareDungeonClears(clear, highestClear) > 0) {
        highestClear = clear;
      }
    }
  }

  const pointsToGoal = Math.max(0, goalScore - totalScore);
  const progressPct =
    goalScore > 0
      ? Math.min(100, Math.round((totalScore / goalScore) * 100))
      : 100;

  return {
    memberId: member.id,
    displayName: member.displayName,
    inParty: member.inParty,
    totalScore,
    allTimeScore,
    highestClear,
    clearedCount,
    timedCount,
    totalDungeons: pool.length,
    lowestDungeon,
    pointsToGoal,
    progressPct,
  };
}

export function computePartyProgressionSummary(
  members: readonly MemberProfile[],
  dungeons: readonly DungeonDefinition[],
  options?: { seasonOnly?: boolean; goalScore?: number }
): PartyProgressionSummary {
  const memberSummaries = members.map((m) =>
    computeMemberProgressionSummary(m, dungeons, options)
  );
  const inPartySummaries = memberSummaries.filter((s) => s.inParty);
  const activeMemberSummaries =
    inPartySummaries.length > 0 ? inPartySummaries : memberSummaries;

  if (activeMemberSummaries.length === 0) {
    return {
      memberSummaries,
      activeMemberSummaries: [],
      averageScore: 0,
      highestPartyScore: 0,
      lowestPartyScore: 0,
      partyHighestClear: null,
      recommendedNextDungeon: null,
    };
  }

  const scores = activeMemberSummaries.map((s) => s.totalScore);
  const averageScore = Math.round(
    scores.reduce((acc, v) => acc + v, 0) / activeMemberSummaries.length
  );
  const highestPartyScore = Math.max(...scores);
  const lowestPartyScore = Math.min(...scores);

  let partyHighestClear: MemberDungeonClear | null = null;
  for (const s of memberSummaries) {
    if (compareDungeonClears(s.highestClear, partyHighestClear) > 0) {
      partyHighestClear = s.highestClear;
    }
  }

  const activeMembers = members.filter((m) =>
    activeMemberSummaries.some((s) => s.memberId === m.id)
  );
  const pool =
    (options?.seasonOnly ?? true)
      ? dungeons.filter((d) => d.seasonStatus === 'season-2')
      : dungeons;

  let recommendedNextDungeon: PartyDungeonOpportunity | null = null;
  for (const dungeon of pool) {
    const memberScores = activeMembers.map(
      (m) => m.dungeonClears?.[dungeon.slug]?.score ?? 0
    );
    const avg = Math.round(
      memberScores.reduce((acc, v) => acc + v, 0) / activeMembers.length
    );
    const minScore = Math.min(...memberScores);
    const unearnedMemberNames = activeMembers
      .filter((m) => !m.dungeonClears?.[dungeon.slug])
      .map((m) => m.displayName);

    if (
      recommendedNextDungeon === null ||
      avg < recommendedNextDungeon.averageScore ||
      (avg === recommendedNextDungeon.averageScore &&
        minScore < recommendedNextDungeon.lowestMemberScore)
    ) {
      recommendedNextDungeon = {
        dungeon,
        averageScore: avg,
        lowestMemberScore: minScore,
        unearnedMemberNames,
      };
    }
  }

  return {
    memberSummaries,
    activeMemberSummaries,
    averageScore,
    highestPartyScore,
    lowestPartyScore,
    partyHighestClear,
    recommendedNextDungeon,
  };
}

/**
 * Applies a completed CombatLog dungeon run to participating party members' dungeonClears
 * and updates the shared Eternal 10k checklist if an Eternal key improved the room's score.
 */
export function applyCombatClearToPartyState(
  state: PartySyncState,
  trigger: CompletedDungeonClearTrigger,
  editableMemberIds?: ReadonlySet<string>
): {
  members: MemberProfile[];
  eternalChecklist: EternalChecklistRow[];
  updatedMemberIds: string[];
  checklistUpdated: boolean;
} {
  const tier = fromDifficultyRaw(trigger.difficultyRaw);
  if (!tier || !trigger.dungeonSlug) {
    return {
      members: state.members,
      eternalChecklist: state.eternalChecklist,
      updatedMemberIds: [],
      checklistUpdated: false,
    };
  }

  const timed = trigger.timedSuccess ?? true;
  const estimatedScore = estimateDungeonClearScore(
    tier.league,
    tier.level,
    timed
  );

  const incomingClear: MemberDungeonClear = {
    dungeonSlug: trigger.dungeonSlug,
    league: tier.league,
    level: tier.level,
    timed,
    score: estimatedScore,
    bestDurationSeconds: trigger.durationSeconds,
    updatedAtIso: trigger.timestampIso,
  };

  const normalizedNames = new Set(
    trigger.participantNames
      .map((n) => n.trim().toLowerCase())
      .filter((n) => n.length > 0)
  );

  const updatedMemberIds: string[] = [];
  const nextMembers = state.members.map((member) => {
    if (editableMemberIds && !editableMemberIds.has(member.id)) {
      return member;
    }

    const nameMatches =
      normalizedNames.has(member.displayName.trim().toLowerCase()) ||
      (member.ownerDisplayName
        ? normalizedNames.has(member.ownerDisplayName.trim().toLowerCase())
        : false);

    const participated = member.inParty || nameMatches;
    if (!participated) return member;

    const prevClear = member.dungeonClears?.[trigger.dungeonSlug];
    const merged = mergeHigherDungeonClear(prevClear, incomingClear);

    if (
      prevClear &&
      prevClear.league === merged.league &&
      prevClear.level === merged.level &&
      prevClear.timed === merged.timed &&
      prevClear.score === merged.score
    ) {
      return member;
    }

    updatedMemberIds.push(member.id);
    return {
      ...member,
      dungeonClears: {
        ...(member.dungeonClears ?? {}),
        [trigger.dungeonSlug]: merged,
      },
    };
  });

  let checklistUpdated = false;
  let nextChecklist = state.eternalChecklist;
  if (tier.league === 'Eternal') {
    nextChecklist = state.eternalChecklist.map((row) => {
      if (row.dungeonSlug !== trigger.dungeonSlug) return row;
      const nextScore = Math.max(row.currentScore, estimatedScore);
      const nextFinished =
        row.finished || (timed && tier.level >= row.targetLevel);
      if (nextScore === row.currentScore && nextFinished === row.finished) {
        return row;
      }
      checklistUpdated = true;
      return {
        ...row,
        currentScore: nextScore,
        finished: nextFinished,
      };
    });
  }

  return {
    members: updatedMemberIds.length > 0 ? nextMembers : state.members,
    eternalChecklist: checklistUpdated ? nextChecklist : state.eternalChecklist,
    updatedMemberIds,
    checklistUpdated,
  };
}
