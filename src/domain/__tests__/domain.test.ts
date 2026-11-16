import { describe, expect, it } from 'vitest';
import {
  BUILT_IN_ROUTES,
  createIdleLiveRunState,
  DUNGEONS,
  INITIAL_ETERNAL_CHECKLIST,
  INITIAL_MEMBERS,
} from '../catalog';
import {
  parseCombatLogLine,
  projectUnitsToTacticalMap,
  reduceCombatEvent,
} from '../combatLogParser';
import {
  computeDungeonPunchList,
  computeEternalSummary,
  computeEternalTargetScore,
  predictEmissaryVariant,
  selectBestRoute,
} from '../punchList';
import { SAMPLE_DRAKHEIM_COMBAT_LOG } from '../sampleCombatStream';

describe('Dungeon Punch List & Spreadsheet Parity', () => {
  it('matches PS2-Items-Individual and PS2ItemsTotal counts across Andy, Nick, Ting, and Duncan', () => {
    const summary = computeDungeonPunchList(INITIAL_MEMBERS, DUNGEONS);
    expect(summary.totalPartyItemsNeeded).toBe(18);

    const bySlug = Object.fromEntries(
      summary.rows.map((r) => [r.dungeon.slug, r.totalNeeded])
    );

    expect(bySlug['ransack-of-drakheim']).toBe(4);
    expect(bySlug['stormwatch']).toBe(3);
    expect(bySlug['empyrean-sands']).toBe(2);
    expect(bySlug['urrak-markets']).toBe(2);
    expect(bySlug['cithrels-fall']).toBe(1);
    expect(bySlug['everdawn-grove']).toBe(1);
    expect(bySlug['godfall-quarry']).toBe(1);
    expect(bySlug['the-heart-of-tuzari']).toBe(1);
    expect(bySlug['silken-hollow']).toBe(1);
    expect(bySlug['wraithtide-vault']).toBe(1);
    expect(bySlug['wyrmheart']).toBe(1);
    expect(bySlug['sailors-abyss']).toBe(0);
    expect(summary.topPriorityDungeon?.dungeon.slug).toBe('ransack-of-drakheim');
  });

  it('dynamically updates totals when a member toggles In Party (IN_PARTY_DUNCAN)', () => {
    const withoutDuncan = INITIAL_MEMBERS.map((m) =>
      m.id === 'duncan' ? { ...m, inParty: false } : m
    );
    const summary = computeDungeonPunchList(withoutDuncan, DUNGEONS);
    const drakheim = summary.rows.find(
      (r) => r.dungeon.slug === 'ransack-of-drakheim'
    );
    expect(drakheim?.totalNeeded).toBe(1);
    expect(summary.totalPartyItemsNeeded).toBe(13);
  });

  it('computes Spider Mount 10,000 Eternal Score checklist totals accurately', () => {
    expect(computeEternalTargetScore(1)).toBe(615);
    expect(computeEternalTargetScore(13)).toBe(795);
    expect(computeEternalTargetScore(16)).toBe(840);

    const eternal = computeEternalSummary(INITIAL_ETERNAL_CHECKLIST, 10000);
    expect(eternal.currentTotal).toBe(9951);
    expect(eternal.pointsRemaining).toBe(49);
  });

  it('predicts Capstone Emissary rotations matching Sheet4', () => {
    const drakheim = DUNGEONS.find((d) => d.slug === 'ransack-of-drakheim')!;
    expect(predictEmissaryVariant(drakheim, 4)).toBe('Ghorn');
    expect(predictEmissaryVariant(drakheim, 8)).toBe('Krumbug');
    expect(predictEmissaryVariant(drakheim, 12)).toBe('Eira');
    expect(predictEmissaryVariant(drakheim, 16)).toBe('Ghorn');
  });
});

describe('Fellowship CombatLog Stream Parser & Auto-Route Reducer', () => {
  it('auto-triggers dungeon & Emissary route selection and tracks 4-player coordinates across a full run', () => {
    let state = createIdleLiveRunState();
    let triggeredSlug: string | null = null;
    let triggeredVariant: string | null = null;
    let triggeredLevel: number | null = null;

    for (const line of SAMPLE_DRAKHEIM_COMBAT_LOG) {
      const event = parseCombatLogLine(line);
      if (!event) continue;
      const reduced = reduceCombatEvent(state, event);
      state = reduced.nextRun;
      if (reduced.autoRouteTrigger) {
        triggeredSlug = reduced.autoRouteTrigger.dungeonSlug;
        triggeredVariant = reduced.autoRouteTrigger.variant;
        triggeredLevel = reduced.autoRouteTrigger.eternalLevel;
      }
    }

    expect(triggeredSlug).toBe('ransack-of-drakheim');
    expect(triggeredVariant).toBe('Krumbug');
    expect(triggeredLevel).toBe(16);
    expect(state.status).toBe('completed');
    expect(state.killScoreCurrent).toBe(260);
    expect(state.timedSuccess).toBe(true);

    const players = Object.values(state.units).filter((u) => u.isPlayer);
    expect(players.map((p) => p.name).sort()).toEqual([
      'Andy',
      'Duncan',
      'Nick',
      'Ting',
    ]);
    expect(state.units['Player-1003']?.relicName).toBe('Invis');
    expect(state.units['Player-1003']?.relicCooldownSec).toBe(236);
    expect(state.units['Player-1001']?.relicName).toBe('Sinbind');
    expect(state.units['Player-1001']?.relicCooldownSec).toBe(117);
    expect(state.units['Player-1004']?.relicName).toBe('Wardstone');
    expect(state.units['Player-1004']?.relicCooldownSec).toBe(114);

    const drakheim = DUNGEONS.find((d) => d.slug === 'ransack-of-drakheim')!;
    const projected = projectUnitsToTacticalMap(players, drakheim.worldBounds);
    for (const p of projected) {
      expect(p.mapX).toBeGreaterThanOrEqual(8);
      expect(p.mapX).toBeLessThanOrEqual(92);
      expect(p.mapY).toBeGreaterThanOrEqual(12);
      expect(p.mapY).toBeLessThanOrEqual(88);
    }

    const bestRoute = selectBestRoute(
      BUILT_IN_ROUTES,
      triggeredSlug!,
      'Krumbug'
    );
    expect(bestRoute?.id).toBe('rod-krumbug');
  });

  it('resets live run back to idle when ZONE_CHANGE returns to The Stronghold (zone 17)', () => {
    const startEvent = parseCombatLogLine(
      '2026-11-15T20:14:06.850-08:00|DUNGEON_START|"Stormwatch"|12|48|[6,22]|0'
    )!;
    const afterStart = reduceCombatEvent(createIdleLiveRunState(), startEvent);
    expect(afterStart.nextRun.status).toBe('in_dungeon');
    expect(afterStart.autoRouteTrigger?.variant).toBe('Eira');

    const strongholdEvent = parseCombatLogLine(
      '2026-11-15T20:30:02.299-08:00|ZONE_CHANGE|"The Stronghold"|17|1|'
    )!;
    const afterReturn = reduceCombatEvent(afterStart.nextRun, strongholdEvent);
    expect(afterReturn.nextRun.status).toBe('idle');
  });
});

describe('GCP Firebase Account Ownership & Per-Character Permissions', () => {
  it('enforces owner-only character/BIS edits while allowing opt-in Party Lead loot checks', async () => {
    const {
      claimMemberSlot,
      evaluateMemberPermissions,
      releaseMemberSlot,
      resolveMemberIdForUser,
    } = await import('../ownership');

    const duncanUser = {
      uid: 'discord-uid-duncan',
      displayName: 'Duncan#1337',
      email: 'duncan@example.com',
      photoUrl: null,
      provider: 'discord' as const,
    };

    const nickLeadUser = {
      uid: 'google-uid-nick',
      displayName: 'Nick',
      email: 'nick@example.com',
      photoUrl: null,
      provider: 'google' as const,
    };

    const tingUser = {
      uid: 'google-uid-ting',
      displayName: 'Ting',
      email: 'ting@example.com',
      photoUrl: null,
      provider: 'google' as const,
    };

    const members = INITIAL_MEMBERS.map((m) => {
      if (m.id === 'duncan') return claimMemberSlot(m, duncanUser);
      if (m.id === 'nick') return claimMemberSlot(m, nickLeadUser);
      return m;
    });

    expect(resolveMemberIdForUser(members, 'discord-uid-duncan')).toBe('duncan');
    expect(resolveMemberIdForUser(members, 'google-uid-ting')).toBeNull();

    const duncanSlot = members.find((m) => m.id === 'duncan')!;
    const andyUnclaimedSlot = members.find((m) => m.id === 'andy')!;

    // 1. Duncan inspecting his own slot -> full edit permissions
    const ownerPerms = evaluateMemberPermissions(duncanSlot, {
      authEnforced: true,
      currentUser: duncanUser,
      leadMemberId: 'nick',
      members,
    });
    expect(ownerPerms.canEditBuilds).toBe(true);
    expect(ownerPerms.canToggleLootAndParty).toBe(true);
    expect(ownerPerms.canReleaseClaim).toBe(true);

    // 2. Ting (not lead, not owner) inspecting Duncan's slot -> view-only
    const peerPerms = evaluateMemberPermissions(duncanSlot, {
      authEnforced: true,
      currentUser: tingUser,
      leadMemberId: 'nick',
      members,
    });
    expect(peerPerms.canEditBuilds).toBe(false);
    expect(peerPerms.canToggleLootAndParty).toBe(false);

    // 3. Nick (Party Lead) inspecting Duncan's slot -> cannot edit builds, CAN check off loot drops
    const leadPerms = evaluateMemberPermissions(duncanSlot, {
      authEnforced: true,
      currentUser: nickLeadUser,
      leadMemberId: 'nick',
      members,
    });
    expect(leadPerms.canEditBuilds).toBe(false);
    expect(leadPerms.canToggleLootAndParty).toBe(true);

    // 4. Ting inspecting Andy's unclaimed slot -> can claim
    const unclaimedPerms = evaluateMemberPermissions(andyUnclaimedSlot, {
      authEnforced: true,
      currentUser: tingUser,
      leadMemberId: 'nick',
      members,
    });
    expect(unclaimedPerms.canClaim).toBe(true);

    // 5. Non-owner cannot release Duncan's slot; Duncan can release his own slot
    expect(releaseMemberSlot(duncanSlot, tingUser.uid).ownerUid).toBe(duncanUser.uid);
    expect(releaseMemberSlot(duncanSlot, duncanUser.uid).ownerUid).toBeNull();
  });

  it('resolves synchronized Method.gg embed URLs with dungeon-slug fallbacks', async () => {
    const { resolveMethodRouteUrl } = await import('../punchList');
    const { DUNGEONS } = await import('../catalog');
    const stormwatch = DUNGEONS.find((d) => d.slug === 'stormwatch')!;
    const swRoute = BUILT_IN_ROUTES.find((r) => r.id === 'sw-reg')!;

    expect(resolveMethodRouteUrl(stormwatch, swRoute)).toBe(
      'https://www.method.gg/fellowship/route-planner/stormwatch/YIWHe5JCMtWaSRnB'
    );
    expect(resolveMethodRouteUrl(stormwatch, null)).toBe(
      'https://www.method.gg/fellowship/route-planner/stormwatch'
    );
  });

  it('provides validated Season 2 R5 routes, pack tags, enemy summaries, and >=100% kill score across all 11 active dungeons', async () => {
    const { SEASON_2_ROUTES } = await import('../season2Routes');
    const { extractR5CodeFromInput } = await import('../punchList');

    const s2Dungeons = DUNGEONS.filter((d) => d.seasonStatus === 'season-2');
    const legacyDungeons = DUNGEONS.filter((d) => d.seasonStatus === 'legacy-s1');

    expect(s2Dungeons).toHaveLength(11);
    expect(legacyDungeons).toHaveLength(5);

    for (const legacy of legacyDungeons) {
      expect(legacy.defaultPulls).toEqual([]);
      const legacyRoutes = BUILT_IN_ROUTES.filter(
        (r) => r.dungeonSlug === legacy.slug
      );
      for (const lr of legacyRoutes) {
        expect(lr.pulls).toBeUndefined();
      }
    }

    for (const dungeon of s2Dungeons) {
      expect(dungeon.levelId).toBeTruthy();
      const regular = SEASON_2_ROUTES[dungeon.slug]?.Regular;
      expect(regular).toBeDefined();
      expect(regular!.r5Code.startsWith('R5.')).toBe(true);
      expect(regular!.totalPercent).toBeGreaterThanOrEqual(100);
      expect(regular!.pulls.length).toBeGreaterThanOrEqual(5);
      expect(
        regular!.pulls.some((p) => (p.packTags?.length ?? 0) > 0)
      ).toBe(true);
      expect(
        regular!.pulls.some((p) => (p.enemySummary?.length ?? 0) > 0)
      ).toBe(true);
    }

    // Ruins of Regath requires 3 Blood Towers (20 blood each = 60 blood)
    expect(SEASON_2_ROUTES['ruins-of-regath']?.Regular?.blood).toBeGreaterThanOrEqual(60);

    // R5 code parser handles bare codes, hashes, and full share URLs
    const sampleR5 = SEASON_2_ROUTES.stormwatch!.Regular!.r5Code;
    const sampleHash = SEASON_2_ROUTES.stormwatch!.Regular!.shareHash;
    expect(extractR5CodeFromInput(sampleR5)).toBe(sampleR5);
    expect(extractR5CodeFromInput(sampleHash)).toBe(sampleR5);
    expect(
      extractR5CodeFromInput(
        `https://www.nicktitcombe.com/fellowshipper/planner/index.html?dungeon=Level.ID.NightPatrol${sampleHash}`
      )
    ).toBe(sampleR5);
  });

  it('starts uncreated rooms clean with zero pre-populated players and enforces >= 1 Party Owner once created', async () => {
    const { createDefaultPartyState, createOwnedPartyState } = await import('../catalog');
    const {
      claimUnownedPartyState,
      evaluateMemberPermissions,
      evaluatePartyPermissions,
      promotePartyOwner,
      releaseMemberSlot,
      removePartyOwner,
    } = await import('../ownership');

    // Uncreated default room has no fake Nick/Andy/Ting/Duncan roster and 0 Eternal score
    const blank = createDefaultPartyState('friday-keys');
    expect(blank.partyName).toBe('Friday Keys');
    expect(blank.members).toEqual([]);
    expect(blank.ownerUids).toEqual([]);
    expect(blank.eternalChecklist).toHaveLength(11);
    expect(blank.eternalChecklist.every((r) => r.currentScore === 0 && !r.finished)).toBe(
      true
    );

    const creator = {
      uid: 'discord-uid-creator',
      displayName: 'Alex',
      email: null,
      photoUrl: null,
      provider: 'discord' as const,
    };
    const friend = {
      uid: 'discord-uid-friend',
      displayName: 'Sam',
      email: null,
      photoUrl: null,
      provider: 'discord' as const,
    };

    // Creating a party binds creator as initial Party Owner + claimed Main slot with empty BIS
    const owned = createOwnedPartyState({
      roomId: 'friday-keys',
      partyName: 'Friday Push',
      owner: creator,
      memberDisplayName: 'Alex',
      heroId: 'helena',
    });
    expect(owned.ownerUids).toEqual(['discord-uid-creator']);
    expect(owned.members).toHaveLength(1);
    expect(owned.members[0].ownerUid).toBe('discord-uid-creator');
    expect(owned.members[0].characters[0].bisSets[0].items).toEqual([]);

    // Sole Party Owner cannot step down, unbind, or delete their own slot
    expect(
      removePartyOwner(owned.ownerUids, creator.uid, creator.uid)
    ).toEqual(['discord-uid-creator']);
    expect(
      releaseMemberSlot(
        owned.members[0],
        creator.uid,
        owned.ownerUids,
        owned.members
      ).ownerUid
    ).toBe('discord-uid-creator');

    const soleOwnerPerms = evaluateMemberPermissions(owned.members[0], {
      authEnforced: true,
      currentUser: creator,
      leadMemberId: owned.leadMemberId,
      members: owned.members,
      partyOwnerUids: owned.ownerUids,
    });
    expect(soleOwnerPerms.isPartyOwnerSlot).toBe(true);
    expect(soleOwnerPerms.canReleaseClaim).toBe(false);
    expect(soleOwnerPerms.canRemoveSlot).toBe(false);

    // Promoting a claimed teammate to Co-Owner allows the first owner to step down while keeping >= 1 owner
    const friendMember = {
      ...owned.members[0],
      id: 'sam',
      displayName: 'Sam',
      ownerUid: friend.uid,
      ownerDisplayName: friend.displayName,
    };
    const twoMembers = [...owned.members, friendMember];
    const coOwners = promotePartyOwner(owned.ownerUids, friendMember, creator.uid);
    expect(coOwners).toEqual(['discord-uid-creator', 'discord-uid-friend']);

    const coOwnerPartyPerms = evaluatePartyPermissions({
      authEnforced: true,
      currentUser: creator,
      leadMemberId: owned.leadMemberId,
      members: twoMembers,
      partyOwnerUids: coOwners,
    });
    expect(coOwnerPartyPerms.canRelinquishOwnership).toBe(true);

    const afterStepDown = removePartyOwner(coOwners, creator.uid, creator.uid);
    expect(afterStepDown).toEqual(['discord-uid-friend']);

    // Legacy unowned room can be claimed cleanly
    const legacyState = {
      ...blank,
      members: [{ ...owned.members[0], ownerUid: null, ownerDisplayName: null }],
    };
    const claimedLegacy = claimUnownedPartyState(legacyState, friend);
    expect(claimedLegacy.ownerUids).toEqual(['discord-uid-friend']);
    expect(claimedLegacy.members[0].ownerUid).toBe('discord-uid-friend');
  });

  it('validates Fellowship Item Database coverage across all 12 heroes, 16 dungeons, and smart Ring/Relic slot assignment', async () => {
    const { HEROES } = await import('../catalog');
    const {
      FELLOWSHIP_ITEM_DATABASE,
      queryItemDatabase,
      resolveTargetGearSlot,
    } = await import('../itemDatabase');

    expect(FELLOWSHIP_ITEM_DATABASE.length).toBeGreaterThanOrEqual(150);

    const ids = new Set<string>();
    const validSlugs = new Set([
      'any-dungeon',
      ...DUNGEONS.map((d) => d.slug),
    ]);

    for (const item of FELLOWSHIP_ITEM_DATABASE) {
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
      expect(validSlugs.has(item.dungeonSlug)).toBe(true);
      expect(item.stats.length).toBeGreaterThan(3);
    }

    // Every one of the 12 heroes has at least 3 Legendaries and >= 2 Weapons in the catalog
    for (const hero of HEROES) {
      const heroLegendaries = queryItemDatabase({
        heroId: hero.id,
        categoryFilter: 'Legendary',
      });
      const heroWeapons = queryItemDatabase({
        heroId: hero.id,
        categoryFilter: 'Weapon',
      });
      expect(heroLegendaries.length).toBeGreaterThanOrEqual(3);
      expect(heroWeapons.length).toBeGreaterThanOrEqual(2);
    }

    // Smart Ring 1 -> Ring 2 and Relic 1 -> Relic 2 slot resolution
    expect(resolveTargetGearSlot('Ring', [])).toBe('Ring 1');
    expect(
      resolveTargetGearSlot('Ring', [
        {
          id: 'r1',
          slot: 'Ring 1',
          itemName: 'Barnacled Signet',
          dungeonSlug: 'wraithtide-vault',
          stats: 'Haste +147',
          acquired: false,
        },
      ])
    ).toBe('Ring 2');
    expect(resolveTargetGearSlot('Relic', [])).toBe('Relic 1');
    expect(
      resolveTargetGearSlot('Relic', [
        {
          id: 'rel1',
          slot: 'Relic 1',
          itemName: 'Orb of Hidden Riches',
          dungeonSlug: 'wraithtide-vault',
          stats: 'Haste +200',
          acquired: false,
        },
      ])
    ).toBe('Relic 2');
  });
});

describe('Per-Member Dungeon Score & Highest Cleared Difficulty Tracking', () => {
  it('round-trips Fellowship difficulty IDs and strictly orders Contender < Adept < Champion < Paragon < Eternal', async () => {
    const {
      compareDungeonClears,
      DIFFICULTY_LEAGUES,
      estimateDungeonClearScore,
      fromDifficultyRaw,
      mergeHigherDungeonClear,
      toDifficultyRaw,
    } = await import('../dungeonScore');

    for (const league of DIFFICULTY_LEAGUES) {
      const levels = league === 'Eternal' ? [1, 8, 16, 35] : [1, 4, 7];
      for (const lvl of levels) {
        const raw = toDifficultyRaw(league, lvl);
        expect(fromDifficultyRaw(raw)).toEqual({ league, level: lvl });
      }
    }

    // Eternal 1 matches computeEternalTargetScore(1) === 615 and Eternal 16 === 840
    expect(estimateDungeonClearScore('Eternal', 1, true)).toBe(615);
    expect(estimateDungeonClearScore('Eternal', 16, true)).toBe(840);
    expect(estimateDungeonClearScore('Paragon', 7, true)).toBe(585);
    expect(estimateDungeonClearScore('Champion', 7, true)).toBe(465);
    expect(estimateDungeonClearScore('Adept', 7, true)).toBe(345);
    expect(estimateDungeonClearScore('Contender', 7, true)).toBe(225);

    const paragon7 = {
      dungeonSlug: 'stormwatch',
      league: 'Paragon' as const,
      level: 7,
      timed: true,
      score: 585,
    };
    const eternal1Overtime = {
      dungeonSlug: 'stormwatch',
      league: 'Eternal' as const,
      level: 1,
      timed: false,
      score: 600,
    };
    const eternal1Timed = {
      dungeonSlug: 'stormwatch',
      league: 'Eternal' as const,
      level: 1,
      timed: true,
      score: 615,
    };

    expect(compareDungeonClears(eternal1Overtime, paragon7)).toBeGreaterThan(0);
    expect(compareDungeonClears(eternal1Timed, eternal1Overtime)).toBeGreaterThan(0);

    // Running an easier Paragon 7 farm key after clearing Eternal 1 Timed never regresses personal best
    const mergedAfterFarm = mergeHigherDungeonClear(eternal1Timed, paragon7);
    expect(mergedAfterFarm.league).toBe('Eternal');
    expect(mergedAfterFarm.level).toBe(1);
    expect(mergedAfterFarm.timed).toBe(true);
    expect(mergedAfterFarm.score).toBe(615);
  });

  it('computes per-member and party-wide Dungeon Score summaries and auto-records live CombatLog clears', async () => {
    const { createOwnedPartyState } = await import('../catalog');
    const {
      applyCombatClearToPartyState,
      computePartyProgressionSummary,
      formatDungeonClearLabel,
    } = await import('../dungeonScore');

    const baseParty = createOwnedPartyState({
      roomId: 'score-test',
      partyName: 'Push Squad',
      owner: {
        uid: 'uid-nick',
        displayName: 'Nick',
        provider: 'discord',
        photoUrl: null,
      },
      memberDisplayName: 'Nick',
      heroId: 'helena',
    });

    const fourStack = {
      ...baseParty,
      members: [
        baseParty.members[0],
        {
          id: 'andy',
          displayName: 'Andy',
          inParty: true,
          activeCharacterId: 'andy-sylvie',
          characters: [
            {
              id: 'andy-sylvie',
              heroId: 'sylvie' as const,
              activeBisSetId: 'set-a',
              bisSets: [{ id: 'set-a', name: 'Season 2 BIS', items: [] }],
            },
          ],
          dungeonClears: {
            stormwatch: {
              dungeonSlug: 'stormwatch',
              league: 'Paragon' as const,
              level: 6,
              timed: true,
              score: 570,
            },
          },
        },
      ],
    };

    // 1. Stream Legacy S1 Drakheim Eternal 16 CombatLog -> records personal best & allTimeScore without polluting S2 checklist
    let runState = createIdleLiveRunState();
    let clearTrigger = null;
    for (const line of SAMPLE_DRAKHEIM_COMBAT_LOG) {
      const ev = parseCombatLogLine(line);
      if (!ev) continue;
      const reduced = reduceCombatEvent(runState, ev);
      runState = reduced.nextRun;
      if (reduced.completedClearTrigger) {
        clearTrigger = reduced.completedClearTrigger;
      }
    }

    expect(clearTrigger).not.toBeNull();
    expect(clearTrigger?.dungeonSlug).toBe('ransack-of-drakheim');
    expect(clearTrigger?.difficultyRaw).toBe(48); // Eternal 16
    expect(clearTrigger?.timedSuccess).toBe(true);

    const afterLegacyClear = applyCombatClearToPartyState(fourStack, clearTrigger!);
    expect(afterLegacyClear.updatedMemberIds).toEqual(['nick', 'andy']);
    expect(afterLegacyClear.checklistUpdated).toBe(false);

    // 2. Stream a Season 2 Stormwatch Eternal 16 timed clear -> upgrades Andy's Paragon 6 (570) -> Eternal 16 (840) and updates S2 checklist
    const swStart = parseCombatLogLine(
      '2026-11-15T21:00:00.000-08:00|DUNGEON_START|"Stormwatch"|12|48|[6,22]|0'
    )!;
    const swEnd = parseCombatLogLine(
      '2026-11-15T21:14:30.000-08:00|DUNGEON_END|"Stormwatch"|12|48|[6,22]|1|0|870.0|1'
    )!;
    const swMid = reduceCombatEvent(createIdleLiveRunState(), swStart).nextRun;
    const swFinal = reduceCombatEvent(swMid, swEnd);
    expect(swFinal.completedClearTrigger?.dungeonSlug).toBe('stormwatch');

    const afterS2Clear = applyCombatClearToPartyState(
      {
        ...fourStack,
        members: afterLegacyClear.members,
        eternalChecklist: afterLegacyClear.eternalChecklist,
      },
      swFinal.completedClearTrigger!
    );
    expect(afterS2Clear.updatedMemberIds).toEqual(['nick', 'andy']);
    expect(afterS2Clear.checklistUpdated).toBe(true);

    const partyProg = computePartyProgressionSummary(afterS2Clear.members, DUNGEONS);
    const nickSummary = partyProg.memberSummaries.find((s) => s.memberId === 'nick')!;
    const andySummary = partyProg.memberSummaries.find((s) => s.memberId === 'andy')!;

    // Season 2 score counts Stormwatch (840); allTimeScore includes Legacy S1 Drakheim (840 + 840 = 1,680)
    expect(nickSummary.totalScore).toBe(840);
    expect(nickSummary.allTimeScore).toBe(1680);
    expect(formatDungeonClearLabel(nickSummary.highestClear)).toBe('Eternal 16 ★');

    expect(andySummary.totalScore).toBe(840);
    expect(andySummary.allTimeScore).toBe(1680);
    expect(formatDungeonClearLabel(andySummary.highestClear)).toBe('Eternal 16 ★');
    expect(partyProg.averageScore).toBe(840);
  });
});




