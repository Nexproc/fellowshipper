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
