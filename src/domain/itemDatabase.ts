import { DUNGEONS, GEAR_SLOTS } from './catalog.ts';
import type { BisItemEntry, GearSlot, HeroId } from './types.ts';

export type ItemCategory = 'Legendary' | 'Weapon' | 'Relic' | 'Dungeon';

export type CatalogSlot =
  | 'Head'
  | 'Shoulders'
  | 'Chest'
  | 'Wrists'
  | 'Hands'
  | 'Back'
  | 'Legs'
  | 'Feet'
  | 'Neck'
  | 'Ring'
  | 'Relic'
  | 'Weapon';

export interface CatalogItemEntry {
  id: string;
  name: string;
  slot: CatalogSlot;
  category: ItemCategory;
  /** Specific dungeon slug from DUNGEONS or 'any-dungeon' */
  dungeonSlug: string;
  stats: string;
  /** Undefined/empty = usable by any hero; non-empty = restricted to listed heroes */
  heroes?: readonly HeroId[];
  /** Concise effect description for Legendaries, Weapons, and Relics */
  effectSummary?: string;
}

const STRENGTH_HEROES: readonly HeroId[] = ['helena', 'xavian', 'tariq'];
const AGILITY_HEROES: readonly HeroId[] = ['meiko', 'mara', 'gunde', 'elarion'];
const INTELLECT_HEROES: readonly HeroId[] = ['sylvie', 'vigour', 'aeona', 'ardeos', 'rime'];

/**
 * Verified Fellowship item catalog sourced from FellowBIS, FellowsGuide,
 * Method.gg Hero Gearing Guides (Oct/Nov 2026), and Archon Eternal logs.
 */
export const FELLOWSHIP_ITEM_DATABASE: readonly CatalogItemEntry[] = [
  // ============================================================================
  // CURRENT-SEASON HERO LEGENDARIES (3 per Hero across all 12 Heroes = 36 items)
  // ============================================================================

  // Helena (Tank)
  {
    id: 'leg-helena-helm',
    name: 'Warmaster Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +234, Expertise +100',
    heroes: ['helena'],
    effectSummary: 'Boosts Shield Slam & Grand Melee mitigation and cooldown recovery.',
  },
  {
    id: 'leg-helena-chest',
    name: 'Warmaster Breastplate',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +224, Expertise +184',
    heroes: ['helena'],
    effectSummary: 'Empowers Ironwark & Toughness regeneration during heavy pulls.',
  },
  {
    id: 'leg-helena-legs',
    name: 'Warmaster Greaves',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +156, Haste +215',
    heroes: ['helena'],
    effectSummary: 'Sweeping Strikes & Shockwave deal increased AoE bleed damage.',
  },

  // Meiko (Tank)
  {
    id: 'leg-meiko-helm',
    name: 'Twinsoul Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Spirit +234, Haste +100',
    heroes: ['meiko'],
    effectSummary: 'Earth Statue expiration grants +80% Armor and boosts Shatter Earth & Stone Shield.',
  },
  {
    id: 'leg-meiko-legs',
    name: 'Twinsoul Leggings',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Spirit +259, Expertise +111',
    heroes: ['meiko'],
    effectSummary: 'Consuming Serenity stacks grants 9s Damage Reduction and AoE pulse damage.',
  },
  {
    id: 'leg-meiko-chest',
    name: 'Twinsoul Tunic',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +184, Spirit +224',
    heroes: ['meiko'],
    effectSummary: 'Enhances Forbidden Technique & Stone Guard combo finishers.',
  },

  // Xavian (Tank)
  {
    id: 'leg-xavian-chest',
    name: 'Light of Azamir Breastplate',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +240, Spirit +168',
    heroes: ['xavian'],
    effectSummary: 'Radiant Aegis & Solar Bulwark grant sustained party barrier & judgement damage.',
  },
  {
    id: 'leg-xavian-legs',
    name: 'Light of Azamir Greaves',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +225, Expertise +146',
    heroes: ['xavian'],
    effectSummary: 'Consecrated strikes extend active block and cleave nearby enemies.',
  },
  {
    id: 'leg-xavian-helm',
    name: 'Helm of the First King',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +150, Haste +184',
    heroes: ['xavian'],
    effectSummary: 'Empowers Sovereign Decree cooldown reduction and burst threat.',
  },

  // Sylvie (Healer)
  {
    id: 'leg-sylvie-chest',
    name: 'Daughter of the Forest Tunic',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +224, Haste +184',
    heroes: ['sylvie'],
    effectSummary: 'Fluttercall & Lifepetal blooms splash bonus healing across injured allies.',
  },
  {
    id: 'leg-sylvie-helm',
    name: 'Daughter of the Forest Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +234, Spirit +100',
    heroes: ['sylvie'],
    effectSummary: 'Bluey & Fey companions pulse accelerated HoT ticks during burst windows.',
  },
  {
    id: 'leg-sylvie-legs',
    name: 'Daughter of the Forest Leggings',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +259, Expertise +111',
    heroes: ['sylvie'],
    effectSummary: 'Nettlebolt & Vines amplify party damage while healing lowest-HP ally.',
  },

  // Vigour (Healer)
  {
    id: 'leg-vigour-helm',
    name: 'Lightshaper Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +234, Haste +100',
    heroes: ['vigour'],
    effectSummary: 'Radiant Runes overcharge Dawnbreaker heals and grant bonus Rune generation.',
  },
  {
    id: 'leg-vigour-chest',
    name: 'Lightshaper Vestments',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +224, Spirit +184',
    heroes: ['vigour'],
    effectSummary: 'Luminous Barrier & Circle of Light leave a protective absorb on allies.',
  },
  {
    id: 'leg-vigour-legs',
    name: 'Lightshaper Leggings',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +215, Expertise +156',
    heroes: ['vigour'],
    effectSummary: 'Soulbrand & Smite convert spell damage into smart-targeted party healing.',
  },

  // Aeona (Healer)
  {
    id: 'leg-aeona-chest',
    name: 'Timeweaver Dress',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +240, Critical Strike +168',
    heroes: ['aeona'],
    effectSummary: 'Chrono-Atonement & Temporal Echo replicate healing across staggered damage.',
  },
  {
    id: 'leg-aeona-legs',
    name: 'Timeweaver Leggings',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +259, Spirit +111',
    heroes: ['aeona'],
    effectSummary: 'Rewind & Sands of Time grant haste bursts to allies when dispelling or shielding.',
  },
  {
    id: 'leg-aeona-helm',
    name: 'Timeweaver Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +184, Expertise +150',
    heroes: ['aeona'],
    effectSummary: 'Chrono Blast & Paradox convert offensive crits into instant atonement shields.',
  },

  // Ardeos (DPS)
  {
    id: 'leg-ardeos-helm',
    name: 'Pyromancer Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +234, Expertise +100',
    heroes: ['ardeos'],
    effectSummary: 'Detonate & Engulfing Flames stack intensified burn mastery on priority targets.',
  },
  {
    id: 'leg-ardeos-chest',
    name: 'Pyromancer Robe',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +224, Haste +184',
    heroes: ['ardeos'],
    effectSummary: 'Wildfire & Infernal Frogs generate extra Ember charges for AoE packs.',
  },
  {
    id: 'leg-ardeos-legs',
    name: 'Pyromancer Codpiece',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +259, Expertise +111',
    heroes: ['ardeos'],
    effectSummary: 'Pyroblast & Fireball casts accelerate Combustion cooldown recovery.',
  },

  // Elarion (DPS)
  {
    id: 'leg-elarion-chest',
    name: 'Skystrider Hauberk',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +224, Critical Strike +184',
    heroes: ['elarion'],
    effectSummary: 'Highwind Arrow & Celestial Barrage fire bonus astral volleys.',
  },
  {
    id: 'leg-elarion-helm',
    name: 'Skystrider Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +234, Spirit +100',
    heroes: ['elarion'],
    effectSummary: 'Focused Shot & Starfall Volleys gain increased critical damage.',
  },
  {
    id: 'leg-elarion-legs',
    name: 'Skystrider Leggings',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +259, Expertise +111',
    heroes: ['elarion'],
    effectSummary: 'Skystrider Grace resets Multishot charges and boosts mobility.',
  },

  // Gunde (DPS)
  {
    id: 'leg-gunde-chest',
    name: "Northlander's Harness",
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +224, Expertise +184',
    heroes: ['gunde'],
    effectSummary: 'Heskyr Rampage & Reckless Cleave stack ferocious attack speed and bleed damage.',
  },
  {
    id: 'leg-gunde-helm',
    name: "Northlander's Helm",
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +234, Haste +100',
    heroes: ['gunde'],
    effectSummary: 'Bloodlust Roar & Execute strikes refund rage and cleave nearby targets.',
  },
  {
    id: 'leg-gunde-legs',
    name: "Northlander's Wraps",
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +215, Expertise +156',
    heroes: ['gunde'],
    effectSummary: 'Whirling Axes deal increased AoE rend damage and grant leech.',
  },

  // Mara (DPS)
  {
    id: 'leg-mara-legs',
    name: 'Hungering Blade Leggings',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +259, Expertise +111',
    heroes: ['mara'],
    effectSummary: 'Finishing moves empower Queen\'s Fang & Arachnid Venom bleeds.',
  },
  {
    id: 'leg-mara-helm',
    name: 'Hungering Blade Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +234, Haste +100',
    heroes: ['mara'],
    effectSummary: 'Shadowstep & Hemorrhage grant guaranteed critical openers and energy recovery.',
  },
  {
    id: 'leg-mara-chest',
    name: 'Hungering Blade Hauberk',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +224, Expertise +184',
    heroes: ['mara'],
    effectSummary: 'Fan of Blades & Crimson Tempest spread lethal poison stacks across pulls.',
  },

  // Rime (DPS)
  {
    id: 'leg-rime-helm',
    name: 'Harbinger of Winter Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +234, Expertise +100',
    heroes: ['rime'],
    effectSummary: 'Glacial Blast & Winter\'s Orbs shatter frozen targets for massive cleave.',
  },
  {
    id: 'leg-rime-chest',
    name: 'Harbinger of Winter Furs',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +224, Critical Strike +184',
    heroes: ['rime'],
    effectSummary: 'Freezing Torrent & Cold Snap generate extra Anima charges.',
  },
  {
    id: 'leg-rime-legs',
    name: 'Harbinger of Winter Leggings',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +259, Spirit +111',
    heroes: ['rime'],
    effectSummary: 'Ice Comet & Frost Swallows extend chill vulnerability on bosses.',
  },

  // Tariq (DPS)
  {
    id: 'leg-tariq-helm',
    name: 'Stormlord Helm',
    slot: 'Head',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +234, Critical Strike +100',
    heroes: ['tariq'],
    effectSummary: 'Heavy Strike & Thunder Call arc chain lightning across all nearby enemies.',
  },
  {
    id: 'leg-tariq-chest',
    name: 'Stormlord Harness',
    slot: 'Chest',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +224, Expertise +184',
    heroes: ['tariq'],
    effectSummary: 'Skull Crusher &Hammer Storm amplify Swing Timer empowers.',
  },
  {
    id: 'leg-tariq-legs',
    name: 'Stormlord Wraps',
    slot: 'Legs',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +259, Spirit +111',
    heroes: ['tariq'],
    effectSummary: 'Tempest Leap &Schism grant surging haste and Spirit generation.',
  },

  // Legacy / Classic Global Legendaries (FellowBIS Archive)
  {
    id: 'leg-chrono-amulet',
    name: 'Amulet of the Chrono Trigger',
    slot: 'Neck',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +397, Critical Strike +70',
    heroes: ['aeona'],
    effectSummary: 'Accelerates temporal cooldowns on Spirit Surge.',
  },
  {
    id: 'leg-unyielding-bloom',
    name: 'Amulet of Unyielding Bloom',
    slot: 'Neck',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +397, Haste +70',
    heroes: ['sylvie'],
    effectSummary: 'Overhealing seeds Life Petals on nearby party members.',
  },
  {
    id: 'leg-lightshaper-cloak',
    name: "Ancient Lightshaper's Cloak of Ceremony",
    slot: 'Back',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +158, Critical Strike +28',
    heroes: ['vigour'],
    effectSummary: 'Radiant Rune spenders echo a secondary heal.',
  },
  {
    id: 'leg-dawnbreaker-cloak',
    name: "Dawnbreaker's Cloak of Reverence",
    slot: 'Back',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +158, Spirit +28',
    heroes: ['vigour'],
    effectSummary: 'Dawnbreaker Orb grants increased crit healing.',
  },
  {
    id: 'leg-brimstone-boots',
    name: 'Apocalyptic Brimstone Boots',
    slot: 'Feet',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +221, Expertise +39',
    heroes: ['ardeos'],
    effectSummary: 'Scorching steps empower instant Pyroblast procs.',
  },
  {
    id: 'leg-shimmering-cape',
    name: 'Shimmering Silver Cape',
    slot: 'Back',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +158, Expertise +28',
    heroes: ['rime'],
    effectSummary: 'Winter Orbs pulse bonus frost damage.',
  },
  {
    id: 'leg-astronomer-bracers',
    name: "Master Astronomer's Bracers",
    slot: 'Wrists',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +158, Critical Strike +28',
    heroes: ['rime'],
    effectSummary: 'Reduces cast time of Glacial Blast after Freezing Torrent.',
  },
  {
    id: 'leg-starstriker-signet',
    name: "Signet of Starstriker's Ascent",
    slot: 'Ring',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +187, Spirit +80',
    heroes: ['elarion'],
    effectSummary: 'Starstriker shots refund focus and stack ranged haste.',
  },
  {
    id: 'leg-heavy-metal-cloak',
    name: 'Linked Heavy Metal Cloak',
    slot: 'Back',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +158, Expertise +28',
    heroes: ['helena'],
    effectSummary: 'Reduces physical damage taken while Shield Block is active.',
  },
  {
    id: 'leg-razor-loop',
    name: 'Masochistic Razor Loop',
    slot: 'Ring',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +187, Expertise +80',
    heroes: ['helena'],
    effectSummary: 'Reflects bleed damage to attackers when blocking.',
  },
  {
    id: 'leg-blackened-vanguard',
    name: 'Bindings of the Blackened Vanguard',
    slot: 'Wrists',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Expertise +158, Haste +28',
    heroes: ['helena'],
    effectSummary: 'Shield Slam empowers your next Toughness barrier.',
  },
  {
    id: 'leg-slayer-king-drape',
    name: 'Drape of the Slayer King',
    slot: 'Back',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +158, Haste +28',
    heroes: ['tariq'],
    effectSummary: 'Culling strikes unleash a shockwave of lightning.',
  },
  {
    id: 'leg-thundering-vortex',
    name: 'Loop of the Thundering Vortex',
    slot: 'Ring',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +187, Critical Strike +80',
    heroes: ['tariq'],
    effectSummary: 'Whirlwind & Thunder Call pull lightning bolts onto nearby foes.',
  },
  {
    id: 'leg-executioner-bands',
    name: "Executioner's Unsanitary Bands",
    slot: 'Wrists',
    category: 'Legendary',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +158, Expertise +28',
    heroes: ['mara'],
    effectSummary: 'Venomous bleeds tick faster on targets below 50% health.',
  },

  // ============================================================================
  // WEAPONS (All 12 Heroes — Method.gg & FellowBIS Verified)
  // ============================================================================
  {
    id: 'wpn-darkfrost-arms',
    name: 'Darkfrost Arms',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Haste +181, Expertise +148',
    heroes: ['helena'],
    effectSummary: 'Chilling weapon active slows enemy melee speed by 40% and deals AoE frost damage.',
  },
  {
    id: 'wpn-fateful-arms',
    name: 'Fateful Arms',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +195, Spirit +134',
    heroes: ['helena'],
    effectSummary: 'Grants defensive cooldown acceleration and steady block recovery.',
  },
  {
    id: 'wpn-sahrils-arms',
    name: "Sahril's Arms",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +164, Expertise +165',
    heroes: ['helena', 'xavian'],
    effectSummary: "Sahril's Aegis absorbs incoming damage and detonates back onto attackers.",
  },
  {
    id: 'wpn-darkfrost-talons',
    name: 'Darkfrost Talons',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Spirit +181, Haste +148',
    heroes: ['meiko'],
    effectSummary: '30s CD icicle 3s stun that explodes to slow movement by 65% and attack speed by 40%.',
  },
  {
    id: 'wpn-fists-of-fate',
    name: 'Fists of Fate',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +188, Spirit +141',
    heroes: ['meiko'],
    effectSummary: 'Accelerates Stone Shield and Palm finisher cooldown recovery.',
  },
  {
    id: 'wpn-sahrils-grasp',
    name: "Sahril's Grasp",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'any-dungeon',
    stats: 'Spirit +175, Expertise +154',
    heroes: ['meiko'],
    effectSummary: "90s CD Sahril's Aegis soak shield that explodes for AoE damage.",
  },
  {
    id: 'wpn-darkfrost-drakecarver',
    name: 'Darkfrost Drakecarver',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +148, Haste +181',
    heroes: ['xavian', 'helena'],
    effectSummary: 'Frost-forged tank blade with AoE attack-speed slow active.',
  },
  {
    id: 'wpn-fateful-dawnrender',
    name: 'Fateful Dawnrender',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'scryers-peak',
    stats: 'Haste +190, Spirit +160',
    heroes: ['xavian'],
    effectSummary: 'Radiant weapon active grants cooldown haste and aegis absorb.',
  },
  {
    id: 'wpn-elheryns-cache',
    name: "Elheryn's Cache",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Critical Strike +185, Haste +160',
    heroes: ['sylvie'],
    effectSummary: 'Channels emerald fey bolts that burst-heal injured party members.',
  },
  {
    id: 'wpn-branch-everliving',
    name: 'Branch of the Everliving',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'everdawn-grove',
    stats: 'Haste +190, Spirit +155',
    heroes: ['sylvie', 'ardeos'],
    effectSummary: 'Restores mana/spirit and amplifies nature & elemental spell throughput.',
  },
  {
    id: 'wpn-forbidden-tome',
    name: 'Forbidden Tome of Arcanistry',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'scryers-peak',
    stats: 'Critical Strike +190, Haste +155',
    heroes: ['vigour'],
    effectSummary: 'Unleashes arcane-light nova that heals allies and damages enemies.',
  },
  {
    id: 'wpn-faelight-history',
    name: 'History of the Faelight Gardens',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Haste +198, Spirit +147',
    heroes: ['vigour'],
    effectSummary: 'Grants surging Haste and Rune generation on use.',
  },
  {
    id: 'wpn-zeraleths-compendium',
    name: "Zeraleth's Compendium",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Critical Strike +175, Expertise +170',
    heroes: ['vigour'],
    effectSummary: 'Offensive healer codex converting shadow-light damage into party shields.',
  },
  {
    id: 'wpn-ancient-iceshaper-tome',
    name: "Ancient Iceshaper's Tome",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +180, Critical Strike +165',
    heroes: ['vigour', 'rime'],
    effectSummary: 'Crystalline tome granting spell crit and protective frost ward.',
  },
  {
    id: 'wpn-elheryns-sandglass',
    name: "Elheryn's Guiding Sandglass",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +205, Critical Strike +140',
    heroes: ['aeona'],
    effectSummary: 'bends time to accelerate party cooldowns and extend atonement windows.',
  },
  {
    id: 'wpn-fragments-frozen-time',
    name: 'Fragments of Frozen Time',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +188, Haste +157',
    heroes: ['aeona'],
    effectSummary: 'Freezes incoming stagger damage and pulses burst Chrono healing.',
  },
  {
    id: 'wpn-sand-of-seasons',
    name: 'The Sand of Seasons',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +180, Spirit +165',
    heroes: ['aeona'],
    effectSummary: 'Cycles temporal haste and restorative spirit waves.',
  },
  {
    id: 'wpn-devourers-hour',
    name: "The Devourer's Hour",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Critical Strike +176, Expertise +169',
    heroes: ['aeona'],
    effectSummary: 'High-damage Pinnacle hourglass siphoning boss vitality into party healing.',
  },
  {
    id: 'wpn-ashas-chronoshift-spire',
    name: "Asha's Chronoshift Spire",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Critical Strike +195, Haste +150',
    heroes: ['ardeos', 'rime'],
    effectSummary: 'Top-tier caster staff granting temporal spell haste and burst damage active.',
  },
  {
    id: 'wpn-frozen-staff-anzhyr',
    name: "Frozen Staff of An'zhyr",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +182, Expertise +163',
    heroes: ['ardeos', 'rime'],
    effectSummary: 'Unleashes piercing glacial lances for high single-target & cleave burst.',
  },
  {
    id: 'wpn-void-touched-conduit',
    name: 'Void-Touched Conduit',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +192, Expertise +153',
    heroes: ['ardeos', 'rime'],
    effectSummary: 'Channels void energy into escalating spell damage.',
  },
  {
    id: 'wpn-academy-staff',
    name: 'Academy Staff',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +175, Critical Strike +170',
    heroes: ['rime', 'ardeos', 'sylvie', 'vigour', 'aeona'],
    effectSummary: 'Versatile arcanist staff usable across caster & healer specs.',
  },
  {
    id: 'wpn-void-touched-bow',
    name: 'Void-Touched Bow',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Critical Strike +192, Haste +153',
    heroes: ['elarion'],
    effectSummary: 'Fires rift-charged arrows that detonate for AoE shadow-astral damage.',
  },
  {
    id: 'wpn-ashas-chronoshift-bow',
    name: "Asha's Chronoshift Bow",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'any-dungeon',
    stats: 'Expertise +200, Spirit +245',
    heroes: ['elarion'],
    effectSummary: 'Rewinds ranged ability cooldowns and grants attack speed.',
  },
  {
    id: 'wpn-arc-everliving',
    name: 'Arc of the Everliving',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Haste +198, Expertise +147',
    heroes: ['elarion'],
    effectSummary: 'Verdant longbow empowering sustained multi-target volleys.',
  },
  {
    id: 'wpn-fateful-cleavers',
    name: 'Fateful Cleavers',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +196, Expertise +149',
    heroes: ['gunde'],
    effectSummary: 'Twin berserker axes accelerating Rampage cooldowns and cleave.',
  },
  {
    id: 'wpn-forgefathers-axes',
    name: "Forgefather's Axes",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Critical Strike +190, Expertise +155',
    heroes: ['gunde'],
    effectSummary: 'Molten strikes sear armor and deal heavy AoE fire-physical burst.',
  },
  {
    id: 'wpn-rootbinders-choppers',
    name: "Rootbinder's Choppers",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Haste +184, Critical Strike +161',
    heroes: ['gunde'],
    effectSummary: 'Briar-forged twin axes stacking bleeding wounds.',
  },
  {
    id: 'wpn-voidbringers-renders',
    name: "Voidbringer's Renders",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Critical Strike +188, Haste +157',
    heroes: ['gunde', 'sylvie'],
    effectSummary: 'Rift-infused claws unleashing rapid void slashes.',
  },
  {
    id: 'wpn-sahrils-vengeance',
    name: "Sahril's Vengeance",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Critical Strike +200, Expertise +145',
    heroes: ['mara'],
    effectSummary: 'Twin assassin daggers dealing lethal shadow-bleed burst on active.',
  },
  {
    id: 'wpn-fateful-blades',
    name: 'Fateful Blades',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'silken-hollow',
    stats: 'Haste +190, Critical Strike +155',
    heroes: ['mara'],
    effectSummary: 'Refunds combo energy and accelerates shadow cooldowns.',
  },
  {
    id: 'wpn-void-touched-daggers',
    name: 'Void-Touched Daggers',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Critical Strike +182, Expertise +163',
    heroes: ['mara'],
    effectSummary: 'Pierces target armor with void-laced strikes.',
  },
  {
    id: 'wpn-wildstone-shards',
    name: 'Wildstone Shards',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Expertise +192, Haste +153',
    heroes: ['mara'],
    effectSummary: 'Jagged quarry daggers amplifying poison & bleed mastery.',
  },
  {
    id: 'wpn-fateful-basher',
    name: 'Fateful Basher',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +195, Critical Strike +150',
    heroes: ['tariq'],
    effectSummary: 'Tempest warhammer granting rapid Swing Timer resets and CDR.',
  },
  {
    id: 'wpn-sahrils-reckoning',
    name: "Sahril's Reckoning",
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Critical Strike +195, Expertise +150',
    heroes: ['tariq'],
    effectSummary: 'Crushes enemies with a devastating thunder-shadow slam.',
  },
  {
    id: 'wpn-void-touched-hammer',
    name: 'Void-Touched Hammer',
    slot: 'Weapon',
    category: 'Weapon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +182, Expertise +163',
    heroes: ['tariq'],
    effectSummary: 'Releases void shockwaves on Heavy Strike empowers.',
  },

  // ============================================================================
  // SET-BONUS ORB RELICS & CLASSIC DUNGEON RELICS (Usable by All Heroes)
  // ============================================================================
  {
    id: 'rel-orb-hidden-riches',
    name: 'Orb of Hidden Riches',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +200, Critical Strike +200',
    effectSummary: 'Empowers all socketed Gem Power by +25% (scales into endgame BIS).',
  },
  {
    id: 'rel-orb-gathering-storms',
    name: 'Orb of Gathering Storms',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +280, Expertise +120',
    effectSummary: '0.8 PPM proc granting +25% Haste for 20 seconds.',
  },
  {
    id: 'rel-orb-awakened-gaze',
    name: 'Orb of Awakened Gaze',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'scryers-peak',
    stats: 'Critical Strike +280, Haste +120',
    effectSummary: 'Critical strikes proc +18% Primary Stat for 15 seconds (~35% uptime).',
  },
  {
    id: 'rel-orb-inner-seas',
    name: 'Orb of Inner Seas',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Spirit +280, Haste +120',
    effectSummary: 'Activating your Spirit Ultimate grants +20% Primary Stat for 20 seconds.',
  },
  {
    id: 'rel-orb-sanguine-restoration',
    name: 'Orb of Sanguine Restoration',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Expertise +240, Spirit +160',
    effectSummary: '+5% passive Primary Stat and an emergency 40% max-HP heal proc.',
  },
  {
    id: 'rel-ancient-wardstone',
    name: 'Ancient Wardstone',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'any-dungeon',
    stats: 'Haste +200, Spirit +200',
    effectSummary: 'Instantly dispels harmful magic effects from yourself and nearby allies (2m CD).',
  },
  {
    id: 'rel-ancient-poultry-fetish',
    name: 'Ancient Poultry Fetish',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +120, Spirit +280',
    effectSummary: 'Transforms a non-boss enemy permanently into a harmless chicken (3m shared CD).',
  },
  {
    id: 'rel-sinbinding-stone',
    name: 'Sinbinding Stone',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +120, Expertise +280',
    effectSummary: 'Carves a protective sigil granting 15% party damage reduction.',
  },
  {
    id: 'rel-grimoire-resurrection',
    name: 'Grimoire of Resurrection',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'cithrels-fall',
    stats: 'Haste +240, Critical Strike +160',
    effectSummary: 'Combat resurrection charm bringing a fallen party member back to life (5m CD).',
  },
  {
    id: 'rel-obsidian-sigil',
    name: 'Obsidian Sigil',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'godfall-quarry',
    stats: 'Expertise +260, Haste +140',
    effectSummary: 'Unleashes a dark seismic pulse and defensive barrier.',
  },
  {
    id: 'rel-chalice-alzerac',
    name: "Chalice of Al'zerac's Essence",
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +240, Spirit +160',
    effectSummary: 'Restores 40% max HP instantly on a 2-minute cooldown.',
  },
  {
    id: 'rel-saltwash-elixir',
    name: 'Saltwash Elixir',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'sailors-abyss',
    stats: 'Haste +220, Spirit +180',
    effectSummary: 'Grants +50% party movement speed for 12 seconds.',
  },
  {
    id: 'rel-humming-portalstone',
    name: 'Humming Portalstone',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'scryers-peak',
    stats: 'Haste +260, Critical Strike +140',
    effectSummary: 'Opens an interactable party skip gateway (2m CD).',
  },
  {
    id: 'rel-orb-of-shadows',
    name: 'Orb of Shadows',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'silken-hollow',
    stats: 'Critical Strike +220, Expertise +180',
    effectSummary: 'Cloaks the entire 4-player party in invisibility for 15 seconds (6m CD).',
  },
  {
    id: 'rel-bloodrite-drums',
    name: 'Bloodrite Drums',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'urrak-markets',
    stats: 'Haste +260, Expertise +140',
    effectSummary: 'Rallies nearby allies with war drums on a 90-second cooldown.',
  },
  {
    id: 'rel-shard-of-antimatter',
    name: 'Shard of Antimatter',
    slot: 'Relic',
    category: 'Relic',
    dungeonSlug: 'scryers-peak',
    stats: 'Expertise +240, Critical Strike +160',
    effectSummary: 'Disrupts enemy spellcasting with an antimatter shock on a 90-second cooldown.',
  },

  // ============================================================================
  // DUNGEON DROPS BY DUNGEON (Season 2 Active Pool + Legacy S1 Dungeons)
  // ============================================================================

  // --- Stormwatch (Season 2) ---
  {
    id: 'dng-sw-broggs-mantle',
    name: "Brogg's Heavy Mantle",
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +163, Spirit +134',
  },
  {
    id: 'dng-sw-looted-leggings',
    name: 'Looted Leggings',
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Critical Strike +111, Haste +259',
  },
  {
    id: 'dng-sw-arsonist-seal',
    name: 'Arsonist Seal',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Critical Strike +147, Haste +120',
  },
  {
    id: 'dng-sw-flint-steel-bracers',
    name: 'Flint & Steel Bracers',
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Expertise +158, Spirit +28',
  },
  {
    id: 'dng-sw-watchman-helm',
    name: "Nightwatchman's Greathelm",
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +210, Expertise +124',
    heroes: STRENGTH_HEROES,
  },
  {
    id: 'dng-sw-stormcall-treads',
    name: 'Stormcaller Treads',
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +195, Critical Strike +65',
  },
  {
    id: 'dng-sw-garrison-cloak',
    name: 'Stormwatch Garrison Cloak',
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +136, Expertise +50',
  },
  {
    id: 'dng-sw-thunder-pendant',
    name: 'Thunderstruck Pendant',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'stormwatch',
    stats: 'Haste +310, Critical Strike +157',
  },

  // --- Cithrel's Fall (Season 2) ---
  {
    id: 'dng-cf-highwinter-helm',
    name: 'Highwinter Helm',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Haste +234, Expertise +100',
    heroes: STRENGTH_HEROES,
  },
  {
    id: 'dng-cf-frozen-guardplate',
    name: 'Frozen Guardplate',
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +62, Expertise +346',
    heroes: STRENGTH_HEROES,
  },
  {
    id: 'dng-cf-dragonpriest-mantle',
    name: 'Mantle of the Dragonpriest',
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +252, Haste +45',
    heroes: INTELLECT_HEROES,
  },
  {
    id: 'dng-cf-frost-speckled-robe',
    name: 'Frost-Speckled Robe',
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +184, Haste +224',
    heroes: INTELLECT_HEROES,
  },
  {
    id: 'dng-cf-aeldethi-boots',
    name: "Ael'dethi Boots",
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Haste +182, Expertise +78',
  },
  {
    id: 'dng-cf-alzerac-robe',
    name: "Al'zerac Cultist's Robe",
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Haste +248, Spirit +160',
    heroes: INTELLECT_HEROES,
  },
  {
    id: 'dng-cf-ancient-eldrin-greathelm',
    name: 'Ancient Eldrin Greathelm',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Expertise +210, Haste +124',
    heroes: STRENGTH_HEROES,
  },
  {
    id: 'dng-cf-ancient-niigano-shroud',
    name: 'Ancient Niigano Shroud',
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Haste +224, Expertise +184',
    heroes: AGILITY_HEROES,
  },
  {
    id: 'dng-cf-betrayers-choker',
    name: "Noor's Betrayer Choker",
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Critical Strike +290, Haste +177',
  },
  {
    id: 'dng-cf-rimebound-band',
    name: 'Rimebound Band',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'cithrels-fall',
    stats: 'Haste +187, Critical Strike +80',
  },

  // --- Empyrean Sands (Season 2) ---
  {
    id: 'dng-es-dusted-veil',
    name: 'Dusted Veil',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Critical Strike +284, Haste +50',
    heroes: INTELLECT_HEROES,
  },
  {
    id: 'dng-es-creeper-vine-loop',
    name: 'Creeper Vine Loop',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Critical Strike +187, Expertise +80',
  },
  {
    id: 'dng-es-adepts-clasp',
    name: "Adept's Clasp",
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +240, Critical Strike +130',
  },
  {
    id: 'dng-es-age-pitted-chestpiece',
    name: 'Age-pitted Chestpiece',
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +210, Expertise +198',
    heroes: STRENGTH_HEROES,
  },
  {
    id: 'dng-es-aged-leather-hood',
    name: 'Aged Leather Hood',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +220, Spirit +114',
    heroes: AGILITY_HEROES,
  },
  {
    id: 'dng-es-ancient-helmet',
    name: 'Ancient Helmet',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +190, Expertise +144',
    heroes: STRENGTH_HEROES,
  },
  {
    id: 'dng-es-ancient-sandals',
    name: 'Ancient Sandals',
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Critical Strike +182, Haste +78',
  },
  {
    id: 'dng-es-ancient-signet',
    name: 'Ancient Signet',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +195, Spirit +72',
  },
  {
    id: 'dng-es-ancient-weathered-cap',
    name: 'Ancient Weathered Cap',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Critical Strike +200, Expertise +134',
    heroes: AGILITY_HEROES,
  },
  {
    id: 'dng-es-sunscorched-wristwraps',
    name: 'Sunscorched Wristwraps',
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'empyrean-sands',
    stats: 'Haste +120, Critical Strike +66',
  },

  // --- Godfall Quarry (Season 2) ---
  {
    id: 'dng-gq-encrusted-mantle',
    name: 'Encrusted Mantle',
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Haste +45, Expertise +252',
  },
  {
    id: 'dng-gq-crystalized-boots',
    name: 'Crystalized Boots',
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Critical Strike +39, Haste +221',
  },
  {
    id: 'dng-gq-nezari-seal',
    name: 'Nezari Seal',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Critical Strike +80, Expertise +187',
  },
  {
    id: 'dng-gq-amethyst-ring',
    name: 'Amethyst Ring',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Critical Strike +195, Haste +72',
  },
  {
    id: 'dng-gq-titanforged-gauntlets',
    name: 'Titanforged Gauntlets',
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Haste +145, Expertise +78',
    heroes: STRENGTH_HEROES,
  },
  {
    id: 'dng-gq-quarrymaster-shawl',
    name: "Quarrymaster's Shawl",
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Critical Strike +118, Haste +68',
  },
  {
    id: 'dng-gq-vaerith-pendant',
    name: "Vaerith's Shard Pendant",
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'godfall-quarry',
    stats: 'Expertise +290, Haste +177',
  },

  // --- Silken Hollow (Season 2) ---
  {
    id: 'dng-sh-chitinous-battlegloves',
    name: 'Chitinous Battlegloves',
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'silken-hollow',
    stats: 'Haste +123, Expertise +100',
  },
  {
    id: 'dng-sh-bullys-bloody-bracers',
    name: "Bully's Bloody Bracers",
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'silken-hollow',
    stats: 'Haste +84, Expertise +102',
  },
  {
    id: 'dng-sh-amulet-silken-chains',
    name: 'Amulet of Silken Chains',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'silken-hollow',
    stats: 'Haste +320, Spirit +147',
  },
  {
    id: 'dng-sh-poisoners-waistwrap',
    name: "Poisoner's Waistwrap",
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'silken-hollow',
    stats: 'Critical Strike +225, Expertise +145',
  },
  {
    id: 'dng-sh-spinneret-spaulders',
    name: 'Spinneret Spaulders',
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'silken-hollow',
    stats: 'Critical Strike +185, Haste +112',
  },
  {
    id: 'dng-sh-venomweave-drape',
    name: 'Venomweave Drape',
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'silken-hollow',
    stats: 'Haste +132, Critical Strike +54',
  },
  {
    id: 'dng-sh-broodmother-grips',
    name: "Broodmother's Silk Grips",
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'silken-hollow',
    stats: 'Critical Strike +140, Haste +83',
    heroes: INTELLECT_HEROES,
  },

  // --- Urrak Markets (Season 2) ---
  {
    id: 'dng-um-butchers-nosering',
    name: "Butcher's Nosering",
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'urrak-markets',
    stats: 'Haste +147, Expertise +120',
  },
  {
    id: 'dng-um-bloodstained-legguards',
    name: 'Bloodstained Legguards',
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'urrak-markets',
    stats: 'Critical Strike +315, Haste +56',
  },
  {
    id: 'dng-um-cannibal-legwraps',
    name: 'Cannibal Legwraps',
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'urrak-markets',
    stats: 'Haste +245, Expertise +125',
  },
  {
    id: 'dng-um-fleshbroker-cuffs',
    name: "Fleshbroker's Shackle Cuffs",
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'urrak-markets',
    stats: 'Critical Strike +112, Haste +74',
  },
  {
    id: 'dng-um-market-stalker-boots',
    name: 'Market Stalker Sabatons',
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'urrak-markets',
    stats: 'Haste +178, Expertise +82',
  },
  {
    id: 'dng-um-brulls-collar',
    name: "Slavetrader Brull's Torque",
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'urrak-markets',
    stats: 'Haste +285, Expertise +182',
  },
  {
    id: 'dng-um-smugglers-mantle',
    name: "Bazaar Smuggler's Pauldrons",
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'urrak-markets',
    stats: 'Critical Strike +175, Expertise +122',
  },

  // --- Wraithtide Vault (Season 2) ---
  {
    id: 'dng-wv-barnacled-signet',
    name: 'Barnacled Signet',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +147, Expertise +120',
  },
  {
    id: 'dng-wv-brined-leather-gloves',
    name: 'Brined Leather Gloves',
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +189, Spirit +34',
  },
  {
    id: 'dng-wv-aging-grommet',
    name: 'Aging Grommet',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Critical Strike +160, Haste +107',
  },
  {
    id: 'dng-wv-aging-skullcap',
    name: 'Aging Skullcap',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +220, Critical Strike +114',
  },
  {
    id: 'dng-wv-ancient-gift',
    name: 'Ancient Gift',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +200, Spirit +67',
  },
  {
    id: 'dng-wv-ancient-gold-ring',
    name: 'Ancient Gold Ring',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Critical Strike +180, Expertise +87',
  },
  {
    id: 'dng-wv-corsair-greatcoat',
    name: "Deathless Katrine's Greatcoat",
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +232, Critical Strike +176',
  },
  {
    id: 'dng-wv-baelaurum-greaves',
    name: "Bael'Aurum's Gilded Sabatons",
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Critical Strike +168, Haste +92',
  },
  {
    id: 'dng-wv-plundered-medallion',
    name: 'Vaultkeeper Medallion',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'wraithtide-vault',
    stats: 'Haste +340, Expertise +127',
  },

  // --- Scryer's Peak (Season 2) ---
  {
    id: 'dng-sp-varux-crown',
    name: 'Crown of Overlord Varux',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'scryers-peak',
    stats: 'Critical Strike +242, Haste +92',
  },
  {
    id: 'dng-sp-starwatcher-mantle',
    name: "Scryer's Starwatcher Mantle",
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'scryers-peak',
    stats: 'Haste +198, Critical Strike +99',
  },
  {
    id: 'dng-sp-frostpeak-vambraces',
    name: 'Snowpeak Vambraces',
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'scryers-peak',
    stats: 'Haste +118, Expertise +68',
  },
  {
    id: 'dng-sp-astral-lens-pendant',
    name: 'Astral Scrying Locket',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'scryers-peak',
    stats: 'Critical Strike +312, Haste +155',
  },
  {
    id: 'dng-sp-windswept-cloak',
    name: 'Summit Windswept Drape',
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'scryers-peak',
    stats: 'Haste +140, Spirit +46',
  },
  {
    id: 'dng-sp-glacier-striders',
    name: 'Peakwalker Striders',
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'scryers-peak',
    stats: 'Haste +188, Expertise +72',
  },
  {
    id: 'dng-sp-oracle-loop',
    name: 'Ring of the Frozen Oracle',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'scryers-peak',
    stats: 'Haste +175, Critical Strike +92',
  },

  // --- Ruins of Regath (Season 2) ---
  {
    id: 'dng-ror-warden-cuirass',
    name: 'Regath Warden Hauberk',
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Haste +240, Expertise +168',
  },
  {
    id: 'dng-ror-xurath-gauntlets',
    name: "Xurath's Ironclad Grips",
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Expertise +135, Haste +88',
  },
  {
    id: 'dng-ror-bloodstone-band',
    name: 'Bloodtower Signet',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Critical Strike +165, Expertise +102',
  },
  {
    id: 'dng-ror-moorcastle-greaves',
    name: 'Moorguard Legplates',
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Haste +230, Spirit +140',
  },
  {
    id: 'dng-ror-sanguine-shroud',
    name: 'Cloak of Fallen Regath',
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Critical Strike +126, Expertise +60',
  },
  {
    id: 'dng-ror-crimson-talisman',
    name: 'Talisman of the Blood Ward',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'ruins-of-regath',
    stats: 'Haste +295, Spirit +172',
  },

  // --- Crown of the Wild (Season 2) ---
  {
    id: 'dng-cotw-scrofa-tusk-pauldrons',
    name: "Scrofa's Tusked Spaulders",
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Haste +190, Expertise +107',
  },
  {
    id: 'dng-cotw-wildheart-jerkin',
    name: 'Wildheart Bark Tunic',
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Critical Strike +212, Haste +196',
  },
  {
    id: 'dng-cotw-canopy-wristguards',
    name: 'Canopy Stalker Bindings',
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Haste +128, Spirit +58',
  },
  {
    id: 'dng-cotw-briarloop',
    name: 'Thornwoven Signet',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Haste +182, Critical Strike +85',
  },
  {
    id: 'dng-cotw-untamed-treads',
    name: 'Rootsprinter Boots',
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Critical Strike +172, Haste +88',
  },
  {
    id: 'dng-cotw-primal-seed-charm',
    name: 'Amulet of the Wild Crown',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'crown-of-the-wild',
    stats: 'Critical Strike +305, Expertise +162',
  },

  // --- Xul, The Blood Monolith (Season 2 Pinnacle) ---
  {
    id: 'dng-xul-velkorath-diadem',
    name: "Vel'korath's Sanctified Visage",
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Haste +240, Critical Strike +94',
  },
  {
    id: 'dng-xul-bloodbound-plate',
    name: 'Monolith Sentinel Breastplate',
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Haste +248, Expertise +160',
  },
  {
    id: 'dng-xul-haneth-grips',
    name: "Han-Eth's Ritual Gauntlets",
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Critical Strike +145, Expertise +78',
  },
  {
    id: 'dng-xul-crimson-obelisk-ring',
    name: 'Band of the Blood Monolith',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Haste +192, Expertise +75',
  },
  {
    id: 'dng-xul-sanctified-pendant',
    name: "Xul'vorith's Gatekeeper Chain",
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Haste +335, Critical Strike +132',
  },
  {
    id: 'dng-xul-sandtomb-mantle',
    name: 'Drape of the Crimson Obelisk',
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'xul-the-blood-monolith',
    stats: 'Haste +144, Expertise +42',
  },

  // --- Ransack of Drakheim (Legacy S1) ---
  {
    id: 'dng-rod-trollhide-leggings',
    name: 'Trollhide Leggings',
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'ransack-of-drakheim',
    stats: 'Critical Strike +111, Haste +259',
  },
  {
    id: 'dng-rod-augas-headwrap',
    name: "Auga's Headwrap",
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'ransack-of-drakheim',
    stats: 'Critical Strike +84, Spirit +102',
  },
  {
    id: 'dng-rod-darkwater-grips',
    name: 'Darkwater Grips',
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'ransack-of-drakheim',
    stats: 'Haste +189, Spirit +34',
  },
  {
    id: 'dng-rod-canvas-patch-cloak',
    name: 'Canvas Patch Cloak',
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'ransack-of-drakheim',
    stats: 'Critical Strike +84, Spirit +102',
  },
  {
    id: 'dng-rod-handhafis-blindfold',
    name: "Handhafi's Blindfold",
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'ransack-of-drakheim',
    stats: 'Critical Strike +184, Expertise +150',
  },
  {
    id: 'dng-rod-amulet-blinding-sight',
    name: 'Amulet of Blinding Sight',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'ransack-of-drakheim',
    stats: 'Critical Strike +310, Expertise +157',
  },

  // --- Everdawn Grove (Legacy S1) ---
  {
    id: 'dng-eg-godhide-drape',
    name: 'Godhide Drape',
    slot: 'Back',
    category: 'Dungeon',
    dungeonSlug: 'everdawn-grove',
    stats: 'Haste +158, Expertise +28',
  },
  {
    id: 'dng-eg-trackers-bands',
    name: "Tracker's Bands",
    slot: 'Wrists',
    category: 'Dungeon',
    dungeonSlug: 'everdawn-grove',
    stats: 'Critical Strike +84, Haste +102',
  },
  {
    id: 'dng-eg-antlered-shoulderpads',
    name: 'Antlered Shoulderpads',
    slot: 'Shoulders',
    category: 'Dungeon',
    dungeonSlug: 'everdawn-grove',
    stats: 'Haste +175, Spirit +122',
  },

  // --- The Heart of Tuzari (Legacy S1) ---
  {
    id: 'dng-hot-bloomended-legplates',
    name: 'Bloomended Legplates',
    slot: 'Legs',
    category: 'Dungeon',
    dungeonSlug: 'the-heart-of-tuzari',
    stats: 'Haste +315, Expertise +56',
  },
  {
    id: 'dng-hot-grips-of-the-wretched',
    name: 'Grips of the Wretched',
    slot: 'Hands',
    category: 'Dungeon',
    dungeonSlug: 'the-heart-of-tuzari',
    stats: 'Critical Strike +100, Expertise +123',
  },
  {
    id: 'dng-hot-manhunters-mark',
    name: "Manhunter's Mark",
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'the-heart-of-tuzari',
    stats: 'Haste +187, Expertise +80',
  },

  // --- Sailor's Abyss (Legacy S1) ---
  {
    id: 'dng-sa-spirited-cowl',
    name: 'Spirited Cowl',
    slot: 'Head',
    category: 'Dungeon',
    dungeonSlug: 'sailors-abyss',
    stats: 'Critical Strike +50, Haste +284',
  },
  {
    id: 'dng-sa-mariners-armor',
    name: "Mariner's Armor",
    slot: 'Chest',
    category: 'Dungeon',
    dungeonSlug: 'sailors-abyss',
    stats: 'Haste +224, Spirit +184',
  },
  {
    id: 'dng-sa-albatross-amulet',
    name: 'Albatross Amulet',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'sailors-abyss',
    stats: 'Haste +300, Spirit +167',
  },
  {
    id: 'dng-sa-amulet-of-the-tides',
    name: 'Amulet of the Tides',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'sailors-abyss',
    stats: 'Critical Strike +295, Haste +172',
  },
  {
    id: 'dng-sa-ancient-mariners-necklace',
    name: "Ancient Mariner's Necklace",
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'sailors-abyss',
    stats: 'Expertise +280, Haste +187',
  },

  // --- Wyrmheart (Legacy S1) ---
  {
    id: 'dng-wh-snowcrusted-boots',
    name: 'Snowcrusted Boots',
    slot: 'Feet',
    category: 'Dungeon',
    dungeonSlug: 'wyrmheart',
    stats: 'Haste +182, Spirit +78',
  },
  {
    id: 'dng-wh-frostscale-loop',
    name: 'Frostscale Loop',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'wyrmheart',
    stats: 'Haste +227, Spirit +40',
  },
  {
    id: 'dng-wh-ancient-eldrin-loop',
    name: 'Ancient Eldrin Loop',
    slot: 'Ring',
    category: 'Dungeon',
    dungeonSlug: 'wyrmheart',
    stats: 'Critical Strike +187, Haste +80',
  },

  // --- Global World / Any-Dungeon Necklaces & Rings ---
  {
    id: 'glb-runed-amulet-horizon',
    name: 'Runed Amulet of the Horizon',
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'any-dungeon',
    stats: 'Critical Strike +397, Haste +70',
  },
  {
    id: 'glb-chain-starstriker',
    name: "Chain of Starstriker's Ascent",
    slot: 'Neck',
    category: 'Dungeon',
    dungeonSlug: 'any-dungeon',
    stats: 'Spirit +340, Haste +127',
  },
] as const;

export interface ItemDatabaseQuery {
  heroId?: HeroId | null;
  /** Filter by UI GearSlot (e.g. 'Ring 1'/'Ring 2' both match CatalogSlot 'Ring') or 'all' */
  slotFilter?: GearSlot | 'all';
  /** 'all', 'season-2', 'any-dungeon', or specific dungeon slug */
  dungeonFilter?: string;
  categoryFilter?: ItemCategory | 'all';
  search?: string;
}

const SEASON_2_DUNGEON_SLUGS = new Set(
  DUNGEONS.filter((d) => d.seasonStatus === 'season-2').map((d) => d.slug)
);

export function catalogSlotMatchesGearSlot(
  catalogSlot: CatalogSlot,
  gearSlot: GearSlot
): boolean {
  if (gearSlot === 'Ring 1' || gearSlot === 'Ring 2') {
    return catalogSlot === 'Ring';
  }
  if (gearSlot === 'Relic 1' || gearSlot === 'Relic 2') {
    return catalogSlot === 'Relic';
  }
  return catalogSlot === gearSlot;
}

/**
 * Resolves the concrete character GearSlot when adding a catalog item.
 * Automatically picks Ring 2 / Relic 2 when Ring 1 / Relic 1 is already occupied,
 * unless the user explicitly filtered for a specific Ring/Relic slot.
 */
export function resolveTargetGearSlot(
  catalogSlot: CatalogSlot,
  existingItems: readonly BisItemEntry[],
  preferredSlot?: GearSlot | 'all'
): GearSlot {
  if (catalogSlot === 'Ring') {
    if (preferredSlot === 'Ring 1' || preferredSlot === 'Ring 2') {
      return preferredSlot;
    }
    const ring1Taken = existingItems.some((it) => it.slot === 'Ring 1');
    const ring2Taken = existingItems.some((it) => it.slot === 'Ring 2');
    if (!ring1Taken) return 'Ring 1';
    if (!ring2Taken) return 'Ring 2';
    return 'Ring 1';
  }

  if (catalogSlot === 'Relic') {
    if (preferredSlot === 'Relic 1' || preferredSlot === 'Relic 2') {
      return preferredSlot;
    }
    const relic1Taken = existingItems.some((it) => it.slot === 'Relic 1');
    const relic2Taken = existingItems.some((it) => it.slot === 'Relic 2');
    if (!relic1Taken) return 'Relic 1';
    if (!relic2Taken) return 'Relic 2';
    return 'Relic 1';
  }

  if (GEAR_SLOTS.includes(catalogSlot as GearSlot)) {
    return catalogSlot as GearSlot;
  }
  return 'Head';
}

const CATEGORY_RANK: Record<ItemCategory, number> = {
  Legendary: 0,
  Weapon: 1,
  Relic: 2,
  Dungeon: 3,
};

export function queryItemDatabase(
  query: ItemDatabaseQuery = {}
): CatalogItemEntry[] {
  const {
    heroId = null,
    slotFilter = 'all',
    dungeonFilter = 'all',
    categoryFilter = 'all',
    search = '',
  } = query;

  const trimmed = search.trim().toLowerCase();

  return FELLOWSHIP_ITEM_DATABASE.filter((item) => {
    if (heroId && item.heroes && item.heroes.length > 0) {
      if (!item.heroes.includes(heroId)) return false;
    }

    if (slotFilter !== 'all' && !catalogSlotMatchesGearSlot(item.slot, slotFilter)) {
      return false;
    }

    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    if (dungeonFilter === 'season-2') {
      if (
        item.dungeonSlug !== 'any-dungeon' &&
        !SEASON_2_DUNGEON_SLUGS.has(item.dungeonSlug)
      ) {
        return false;
      }
    } else if (dungeonFilter !== 'all') {
      if (item.dungeonSlug !== dungeonFilter) return false;
    }

    if (trimmed) {
      const dungeonName =
        item.dungeonSlug === 'any-dungeon'
          ? 'any dungeon global'
          : (DUNGEONS.find((d) => d.slug === item.dungeonSlug)?.name.toLowerCase() ??
              item.dungeonSlug);
      const haystack = `${item.name} ${item.slot} ${item.category} ${item.stats} ${
        item.effectSummary ?? ''
      } ${dungeonName}`.toLowerCase();
      if (!haystack.includes(trimmed)) return false;
    }

    return true;
  }).sort((a, b) => {
    // Hero-specific Legendaries & Weapons float to the top when filtering for a hero
    const aHeroSpecific = heroId && a.heroes?.includes(heroId) ? 0 : 1;
    const bHeroSpecific = heroId && b.heroes?.includes(heroId) ? 0 : 1;
    if (aHeroSpecific !== bHeroSpecific) return aHeroSpecific - bHeroSpecific;

    const catDiff = CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category];
    if (catDiff !== 0) return catDiff;

    return a.name.localeCompare(b.name);
  });
}
