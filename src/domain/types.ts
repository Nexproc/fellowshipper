export type RoleType = 'Tank' | 'Healer' | 'DPS';

export type HeroId =
  | 'helena'
  | 'meiko'
  | 'xavian'
  | 'sylvie'
  | 'vigour'
  | 'aeona'
  | 'elarion'
  | 'mara'
  | 'rime'
  | 'ardeos'
  | 'tariq'
  | 'gunde';

export type GearSlot =
  | 'Head'
  | 'Shoulders'
  | 'Chest'
  | 'Wrists'
  | 'Hands'
  | 'Back'
  | 'Legs'
  | 'Feet'
  | 'Neck'
  | 'Ring 1'
  | 'Ring 2'
  | 'Relic 1'
  | 'Relic 2'
  | 'Weapon';

export type BossVariant = 'Regular' | 'Ghorn' | 'Krumbug' | 'Eira' | 'Empowered';

export type DungeonCategory = 'Adventure' | 'Dungeon' | 'Pinnacle';

export interface HeroDefinition {
  id: HeroId;
  name: string;
  role: RoleType;
  archetype: string;
  accentHsl: string;
}

export type SeasonPoolStatus = 'season-2' | 'legacy-s1';

export interface PullNode {
  index: number;
  label: string;
  /** Normalized 0..100 map coordinates */
  x: number;
  y: number;
  killScore: number;
  killPercent?: number;
  mobCount?: number;
  packTags?: string[];
  enemySummary?: string[];
  kind: 'pack' | 'miniboss' | 'boss';
  notes?: string;
}

export interface WorldBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface DungeonDefinition {
  zoneId: number;
  slug: string;
  name: string;
  category: DungeonCategory;
  seasonStatus: SeasonPoolStatus;
  /** Game level identifier used by the embedded Season 2 planner (e.g. Level.ID.NightPatrol) */
  levelId?: string | null;
  mapImageUrl: string;
  bosses: string[];
  killScoreTarget: number;
  targetSeconds: number;
  /** From Sheet4: boss rotation frequency in Eternal levels (7/3 or 4) */
  everyXLevels: number;
  firstBoss: 'Ghorn' | 'Krumbug' | 'Eira';
  firstLevel: number;
  worldBounds: WorldBounds;
  defaultPulls: PullNode[];
}

export interface RoutePlan {
  id: string;
  dungeonSlug: string;
  variant: BossVariant;
  label: string;
  methodUrl: string;
  /** Compact Season 2 planner route code (R5....) with exact enemy placements */
  r5Code?: string;
  sourceTag: 'Season 2' | 'Core Routes' | 'Xmas Rotation' | 'Spider Mount' | 'Custom';
  recommendedLevel?: number;
  notes?: string;
  pulls?: PullNode[];
}

export interface BisItemEntry {
  id: string;
  slot: GearSlot;
  itemName: string;
  /** Dungeon slug or 'any-dungeon' */
  dungeonSlug: string;
  stats: string;
  acquired: boolean;
  notes?: string;
}

export interface BisSet {
  id: string;
  name: string;
  gemGuideUrl?: string;
  items: BisItemEntry[];
}

export interface CharacterProfile {
  id: string;
  heroId: HeroId;
  title?: string;
  activeBisSetId: string;
  bisSets: BisSet[];
}

export type AuthProviderKind = 'google' | 'discord' | 'anonymous' | 'oidc';

export interface AuthUserInfo {
  uid: string;
  displayName: string;
  email: string | null;
  photoUrl: string | null;
  provider: AuthProviderKind;
}

export type DifficultyLeague =
  | 'Contender'
  | 'Adept'
  | 'Champion'
  | 'Paragon'
  | 'Eternal';

export interface MemberDungeonClear {
  dungeonSlug: string;
  league: DifficultyLeague;
  /** 1..7 for Contender/Adept/Champion/Paragon; 1..60+ for Eternal */
  level: number;
  timed: boolean;
  /** Dungeon rating earned on this map (auto-estimated from tier + timed, or manually overridden) */
  score: number;
  bestDurationSeconds?: number | null;
  updatedAtIso?: string;
}

export interface MemberProfile {
  id: string;
  displayName: string;
  inParty: boolean;
  activeCharacterId: string;
  characters: CharacterProfile[];
  /** Per-dungeon highest cleared difficulty and dungeon score keyed by dungeonSlug */
  dungeonClears?: Record<string, MemberDungeonClear>;
  /** Firebase Auth UID that owns this roster profile (null/undefined until claimed) */
  ownerUid?: string | null;
  ownerDisplayName?: string | null;
  ownerProvider?: AuthProviderKind | null;
  ownerPhotoUrl?: string | null;
  /** When true, the current Party Lead can also check off BIS drops and log party clears during a run */
  allowPartyLeadLootCheck?: boolean;
}

export interface EternalChecklistRow {
  dungeonSlug: string;
  targetLevel: number;
  bossVariant: 'Ghorn' | 'Krumbug' | 'Eira';
  methodUrl: string;
  finished: boolean;
  currentScore: number;
  notes?: string;
}

export interface LiveRelicTelemetry {
  id: string;
  label: string;
  baseCooldownSec: number;
  cooldownTotalSec: number;
  cooldownSec: number;
  castLogMs: number | null;
  updatedAtMs: number | null;
}

export interface LiveUnitTelemetry {
  unitId: string;
  name: string;
  isPlayer: boolean;
  role?: RoleType;
  classId?: number | null;
  x: number;
  y: number;
  facing: number;
  hpCurrent: number;
  hpMax: number;
  spiritPct: number | null;
  /** Current Spirit Points toward Ultimate (0..100/110/130) */
  spiritCurrent?: number | null;
  /** Maximum Spirit Points cap (100 base, 110/130 with Sapphire Ancestral Surge) */
  spiritMax?: number | null;
  /** Effective Spirit Points needed to cast Ultimate (100 base, 95 with -5% Prophet I, 85 with -15% Prophet II) */
  spiritCost?: number | null;
  /** Passive Spirit regeneration per second from COMBATANT_INFO Spirit stat */
  spiritRegenPerSec?: number | null;
  /** Rolling total combat Spirit gain rate (passive + Rising Spirit/abilities) in Spirit/sec */
  spiritGainRatePerSec?: number | null;
  spiritLogMs?: number | null;
  spiritUpdatedAtMs?: number | null;
  /** Diamond gem Relic cooldown multiplier (1.0 base, 0.92 for -8%, 0.76 for -24%) */
  relicCooldownMultiplier?: number | null;
  /** Equipped Relics (up to 2 slots) with independent live cooldown state */
  relics?: LiveRelicTelemetry[];
  lastSeenIso: string;
  trail: Array<{ x: number; y: number }>;
}

export interface CombatFeedEntry {
  id: string;
  timestampIso: string;
  kind: 'zone' | 'dungeon_start' | 'encounter' | 'kill' | 'death' | 'dungeon_end';
  summary: string;
}

export interface LiveRunState {
  status: 'idle' | 'in_dungeon' | 'completed';
  dungeonZoneId: number | null;
  dungeonSlug: string | null;
  dungeonName: string | null;
  difficultyRaw: number | null;
  difficultyLabel: string;
  eternalLevel: number | null;
  affixes: number[];
  detectedVariant: BossVariant;
  startedAtIso: string | null;
  durationSeconds: number | null;
  timedSuccess: boolean | null;
  killScoreCurrent: number;
  killScoreTarget: number;
  activeEncounter: string | null;
  deaths: number;
  units: Record<string, LiveUnitTelemetry>;
  recentEvents: CombatFeedEntry[];
}

export interface MapPing {
  id: string;
  authorName: string;
  x: number;
  y: number;
  label: string;
  createdAtMs: number;
}

export interface OnlinePresence {
  clientId: string;
  memberId: string;
  displayName: string;
  isWatchingLogs: boolean;
  lastHeartbeatMs: number;
}

export interface PartySyncState {
  roomId: string;
  /** Human-readable name for the party */
  partyName?: string;
  /**
   * Authenticated user UIDs (or local owner IDs in offline mode) that own this party.
   * Every initialized party must have at least one owner (`ownerUids.length >= 1`).
   */
  ownerUids: string[];
  createdByUid?: string | null;
  createdByName?: string | null;
  revision: number;
  leadMemberId: string;
  autoFollowLogLead: boolean;
  activeDungeonSlug: string;
  activeVariant: BossVariant;
  activeRouteId: string;
  /** Live compact Season 2 route code synced across the party when any player edits packs on the map */
  activeRouteR5?: string | null;
  /** Live pull-by-pull enemy summary synced from the embedded Season 2 planner */
  activeRoutePulls?: PullNode[] | null;
  activePullIndex: number;
  plannedEternalLevel: number;
  pings: MapPing[];
  members: MemberProfile[];
  customRoutes: RoutePlan[];
  eternalChecklist: EternalChecklistRow[];
  liveRun: LiveRunState;
}

