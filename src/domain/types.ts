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

export interface PullNode {
  index: number;
  label: string;
  /** Normalized 0..100 map coordinates */
  x: number;
  y: number;
  killScore: number;
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
  sourceTag: 'Core Routes' | 'Xmas Rotation' | 'Spider Mount' | 'Custom';
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

export interface MemberProfile {
  id: string;
  displayName: string;
  inParty: boolean;
  activeCharacterId: string;
  characters: CharacterProfile[];
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

export interface LiveUnitTelemetry {
  unitId: string;
  name: string;
  isPlayer: boolean;
  role?: RoleType;
  x: number;
  y: number;
  facing: number;
  hpCurrent: number;
  hpMax: number;
  spiritPct: number | null;
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
  revision: number;
  leadMemberId: string;
  autoFollowLogLead: boolean;
  activeDungeonSlug: string;
  activeVariant: BossVariant;
  activeRouteId: string;
  activePullIndex: number;
  plannedEternalLevel: number;
  pings: MapPing[];
  members: MemberProfile[];
  customRoutes: RoutePlan[];
  eternalChecklist: EternalChecklistRow[];
  liveRun: LiveRunState;
}
