/**
 * Authentic pipe-delimited Fellowship CombatLog*.txt event stream
 * modeled directly on Saved/CombatLogs output for live simulation & testing.
 */
export const SAMPLE_DRAKHEIM_COMBAT_LOG: readonly string[] = [
  '2026-11-15T20:14:01.100-08:00|LOGGING_STARTED|4|0.4.2 cl:114820|1',
  '2026-11-15T20:14:04.210-08:00|ZONE_CHANGE|"Ransack of Drakheim"|23|48|',
  '2026-11-15T20:14:06.850-08:00|DUNGEON_START|"Ransack of Drakheim"|23|48|[6,4,21]|0',
  // Pull 1: Outer Gate Triple Pack
  '2026-11-15T20:14:12.125-08:00|ABILITY_ACTIVATED|Player-1001|"Nick"|985|"Shield Throw"|1|Npc-3126854336-12|"Drakheim Pillager"|342000|342000|0|1200.0|4800.0|0.785|[(3,48000.0,55600.0),(4,18.5,100.00)]',
  '2026-11-15T20:14:13.340-08:00|SWING_DAMAGE|Npc-3126854336-12|"Drakheim Pillager"|Player-1001|"Nick"|207|"Attack"|0|6120|0|-1|3100|24000|Physical|Block|620000|640000|0|1650.0|5400.0|3.92|[]|331000|342000|0|1450.0|5100.0|0.785|[(3,46500.0,55600.0),(4,24.0,100.00)]',
  '2026-11-15T20:14:14.220-08:00|ABILITY_DAMAGE|Player-1002|"Duncan"|Npc-3126854336-12|"Drakheim Pillager"|126|"Starfall Volley"|0|0|0|-1|0|19400|Magical|CriticalStrike|168900|168900|0|820.0|3950.0|0.85|[(2,81.9,100.00),(4,38.4,100.00)]|490000|640000|0|1650.0|5400.0|3.92|[]',
  '2026-11-15T20:14:14.890-08:00|ABILITY_DAMAGE|Player-1003|"Ting"|Npc-2314207808-13|"Frenzied Looter"|982|"Crimson Lacerate"|0|0|0|-1|0|22800|Physical|CriticalStrike|174200|174200|0|1580.0|5280.0|1.02|[(2,74.0,100.00),(4,44.2,100.00)]|410000|520000|0|1790.0|5560.0|3.75|[]',
  '2026-11-15T20:14:15.445-08:00|ABILITY_PERIODIC_HEAL|Player-1004|"Andy"|Player-1001|"Nick"|1445|"Fluttercall: Heal"|1060|0|0|14825|0|0|Magical|Hit|161800|161800|0|640.0|3600.0|0.91|[(1,1440.00,1440.00),(4,51.7,100.00)]|342000|342000|0|1520.0|5220.0|0.82|[(3,51000.0,55600.0),(4,31.0,100.00)]',
  '2026-11-15T20:14:18.100-08:00|UNIT_DEATH|Npc-3126854336-12|"Drakheim Pillager"|Player-1002|"Duncan"|126|"Starfall Volley"|0|28.0',
  '2026-11-15T20:14:19.200-08:00|UNIT_DEATH|Npc-2314207808-13|"Frenzied Looter"|Player-1003|"Ting"|982|"Crimson Lacerate"|0|26.0',

  // Pull 2 & Boss 1: Chilgar the Drowned
  '2026-11-15T20:16:02.110-08:00|ABILITY_DAMAGE|Player-1001|"Nick"|Npc-4489120-15|"Icebite Reaver"|990|"Thunder Slam"|0|0|0|-1|0|15200|Physical|Hit|338000|342000|0|5100.0|18200.0|0.64|[(3,52000.0,55600.0),(4,62.0,100.00)]|180000|480000|0|5340.0|18600.0|3.80|[]',
  '2026-11-15T20:16:03.400-08:00|ABILITY_DAMAGE|Player-1002|"Duncan"|Npc-4489120-15|"Icebite Reaver"|1313|"Heartseeker Barrage"|0|0|0|-1|0|34800|Physical|CriticalStrike|168900|168900|0|4450.0|16900.0|0.72|[(2,65.0,100.00),(4,78.5,100.00)]|0|480000|0|5340.0|18600.0|3.80|[]',
  '2026-11-15T20:16:03.450-08:00|UNIT_DEATH|Npc-4489120-15|"Icebite Reaver"|Player-1002|"Duncan"|1313|"Heartseeker Barrage"|0|42.0',
  '2026-11-15T20:17:10.000-08:00|ENCOUNTER_START|19|["Chilgar the Drowned"]',
  '2026-11-15T20:17:14.250-08:00|ABILITY_DAMAGE|Player-1003|"Ting"|Npc-90019-20|"Chilgar the Drowned"|994|"Shadow Ambush"|0|0|0|-1|0|48200|Physical|CriticalStrike|171000|174200|0|6420.0|29800.0|1.15|[(2,48.0,100.00),(4,96.0,100.00)]|5120000|6800000|0|6600.0|30400.0|4.12|[]',
  '2026-11-15T20:17:16.800-08:00|ABILITY_PERIODIC_HEAL|Player-1004|"Andy"|Player-1003|"Ting"|1448|"Fluttercall: Restore Life"|1061|0|0|21500|0|0|Magical|Hit|161800|161800|0|5880.0|28400.0|1.08|[(1,1380.0,1440.0),(4,88.0,100.00)]|174200|174200|0|6420.0|29800.0|1.15|[(2,52.0,100.00),(4,100.0,100.00)]',
  '2026-11-15T20:18:45.900-08:00|ENCOUNTER_END|19|["Chilgar the Drowned"]|1',

  // Emissary Pocket: Krumbug the Naughty (+60s Timer Refund)
  '2026-11-15T20:20:12.300-08:00|ABILITY_DAMAGE|Player-1001|"Nick"|Npc-28200-21|"Krumbug the Naughty"|985|"Shield Throw"|0|0|0|-1|0|18900|Physical|Hit|329000|342000|0|9400.0|24500.0|0.42|[(3,49000.0,55600.0),(4,84.0,100.00)]|1850000|2400000|0|9750.0|25100.0|3.55|[]',
  '2026-11-15T20:20:14.600-08:00|ABILITY_DAMAGE|Player-1002|"Duncan"|Npc-28200-21|"Krumbug the Naughty"|1877|"Lunarlight Salvo"|0|0|0|-1|0|52400|Magical|CriticalStrike|168900|168900|0|8800.0|23600.0|0.55|[(2,90.0,100.00),(4,100.0,100.00)]|420000|2400000|0|9750.0|25100.0|3.55|[]',
  '2026-11-15T20:20:18.900-08:00|UNIT_DEATH|Npc-28200-21|"Krumbug the Naughty"|Player-1003|"Ting"|994|"Shadow Ambush"|0|64.0',

  // Citadel Ascent & Final Boss: Auga Handhafi the Blind
  '2026-11-15T20:23:10.000-08:00|ABILITY_ACTIVATED|Player-1003|"Ting"|4108|"Orb of Shadows"|1|Player-1003|"Ting"|174200|174200|0|13800.0|38400.0|0.95|[(2,88.0,100.00),(4,88.0,100.00)]',
  '2026-11-15T20:24:10.100-08:00|ABILITY_DAMAGE|Player-1001|"Nick"|Npc-31300-18|"Glacial Bear"|990|"Thunder Slam"|0|0|0|-1|0|24100|Physical|Hit|318000|342000|0|14200.0|39200.0|0.92|[(3,44000.0,55600.0),(4,72.0,100.00)]|120000|920000|0|14500.0|39800.0|4.05|[]',
  '2026-11-15T20:24:11.000-08:00|ABILITY_ACTIVATED|Player-1001|"Nick"|4102|"Sinbinding Stone"|1|Player-1001|"Nick"|318000|342000|0|14200.0|39200.0|0.92|[(3,44000.0,55600.0),(4,72.0,100.00)]',
  '2026-11-15T20:24:12.500-08:00|UNIT_DEATH|Npc-31300-18|"Glacial Bear"|Player-1002|"Duncan"|126|"Starfall Volley"|0|100.0',
  '2026-11-15T20:25:05.000-08:00|ENCOUNTER_START|22|["Auga Handhafi the Blind"]',
  '2026-11-15T20:25:08.500-08:00|ABILITY_ACTIVATED|Player-1004|"Andy"|4106|"Ancient Wardstone"|1|Player-1001|"Nick"|161800|161800|0|15400.0|46200.0|1.08|[(1,1380.0,1440.0),(4,88.0,100.00)]',
  '2026-11-15T20:25:12.442-08:00|ABILITY_DAMAGE|Player-1002|"Duncan"|Npc-42467360-18|"Auga Handhafi the Blind"|1312|"Heartseeker Barrage"|0|12678|0|-1|0|61565|Physical|CriticalStrike|168941|168941|4402|15950.0|46800.0|1.22|[(2,94.02,100.00),(4,92.4,100.00)]|940000|9234655|0|16480.0|48200.0|4.35|[]',
  '2026-11-15T20:25:14.120-08:00|ABILITY_DAMAGE|Player-1003|"Ting"|Npc-42467360-18|"Auga Handhafi the Blind"|994|"Executioner\'s Fang"|0|0|0|-1|0|78400|Physical|CriticalStrike|174200|174200|0|16320.0|47950.0|1.30|[(2,88.0,100.00),(4,100.0,100.00)]|0|9234655|0|16480.0|48200.0|4.35|[]',
  '2026-11-15T20:25:14.125-08:00|UNIT_DEATH|Npc-42467360-18|"Auga Handhafi the Blind"|Player-1003|"Ting"|994|"Executioner\'s Fang"|0|1.0',
  '2026-11-15T20:25:14.126-08:00|ENCOUNTER_END|22|["Auga Handhafi the Blind"]|1',
  '2026-11-15T20:25:14.130-08:00|DUNGEON_END|"Ransack of Drakheim"|23|48|[6,4,21]|1|868|1412.400000|1|0',
];
