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
});


