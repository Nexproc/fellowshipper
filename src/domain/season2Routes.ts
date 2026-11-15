import type { BossVariant, PullNode } from './types.ts';

export interface Season2RouteData {
  r5Code: string;
  shareHash: string;
  totalScore: number;
  requiredScore: number;
  totalPercent: number;
  blood: number;
  pulls: PullNode[];
}

export const SEASON_2_ROUTES: Record<string, Partial<Record<BossVariant, Season2RouteData>>> = {
  "empyrean-sands": {
    "Regular": {
      "r5Code": "R5.APYJAEVtcHlyZWFuIFNhbmRzIOKAlCBTMiBTdGFuZGFyZCBQdXNoFDR40S8NCwxZuKkRk42RMabMhx0jpG9IAsUAU2luLU1hZ2lyAFyA",
      "shareHash": "#r5=APYJAEVtcHlyZWFuIFNhbmRzIOKAlCBTMiBTdGFuZGFyZCBQdXNoFDR40S8NCwxZuKkRk42RMabMhx0jpG9IAsUAU2luLU1hZ2lyAFyA",
      "totalScore": 143,
      "requiredScore": 140,
      "totalPercent": 102.14,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G27 + G21 · Lost Soul ×2, Ravenous Brood ×2",
          "x": 21.3,
          "y": 82.4,
          "killScore": 15,
          "killPercent": 10.71,
          "mobCount": 7,
          "packTags": [
            "G27",
            "G21"
          ],
          "enemySummary": [
            "Lost Soul ×2",
            "Ravenous Brood ×2",
            "Crimson Zealot",
            "Acolyte of Sinnari",
            "Stalking Grim"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×2, Ravenous Brood ×2, Crimson Zealot"
        },
        {
          "index": 2,
          "label": "G41 · Stalking Grim ×2, Tombguard Reaver",
          "x": 27.8,
          "y": 81.2,
          "killScore": 13,
          "killPercent": 9.29,
          "mobCount": 4,
          "packTags": [
            "G41"
          ],
          "enemySummary": [
            "Stalking Grim ×2",
            "Tombguard Reaver",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×2, Tombguard Reaver, Ascended Bloodweaver"
        },
        {
          "index": 3,
          "label": "G33 + G37 · Crimson Zealot ×2, Sandsworn Husk ×2",
          "x": 30.7,
          "y": 71.1,
          "killScore": 21,
          "killPercent": 15,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G37"
          ],
          "enemySummary": [
            "Crimson Zealot ×2",
            "Sandsworn Husk ×2",
            "Dunesnare Hunter",
            "Gravebreaker Brute",
            "Tombguard Reaver"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×2, Sandsworn Husk ×2, Dunesnare Hunter"
        },
        {
          "index": 4,
          "label": "G30 + G24 · Sandsworn Husk ×4, Sanguine Echo ×2",
          "x": 36.3,
          "y": 61.5,
          "killScore": 20,
          "killPercent": 14.29,
          "mobCount": 8,
          "packTags": [
            "G30",
            "G24"
          ],
          "enemySummary": [
            "Sandsworn Husk ×4",
            "Sanguine Echo ×2",
            "Crimson Zealot",
            "Nightbound Magi"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×4, Sanguine Echo ×2, Crimson Zealot"
        },
        {
          "index": 5,
          "label": "G28 + G31 + G29 · Sandsworn Husk ×4, Sanguine Echo ×2",
          "x": 49.9,
          "y": 55.7,
          "killScore": 22,
          "killPercent": 15.71,
          "mobCount": 9,
          "packTags": [
            "G28",
            "G31",
            "G29"
          ],
          "enemySummary": [
            "Sandsworn Husk ×4",
            "Sanguine Echo ×2",
            "Crimson Zealot",
            "Ascended Bloodweaver",
            "Water Surger"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×4, Sanguine Echo ×2, Crimson Zealot"
        },
        {
          "index": 6,
          "label": "G7 + G12 + G26 · Ravenous Brood ×3, Sanguine Echo ×2",
          "x": 58.4,
          "y": 45.2,
          "killScore": 16,
          "killPercent": 11.43,
          "mobCount": 7,
          "packTags": [
            "G7",
            "G12",
            "G26"
          ],
          "enemySummary": [
            "Ravenous Brood ×3",
            "Sanguine Echo ×2",
            "Stalking Grim ×2"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×3, Sanguine Echo ×2, Stalking Grim ×2"
        },
        {
          "index": 7,
          "label": "G2 + G8 · Crimson Zealot ×3, Lost Soul ×2",
          "x": 63.8,
          "y": 35,
          "killScore": 19,
          "killPercent": 13.57,
          "mobCount": 8,
          "packTags": [
            "G2",
            "G8"
          ],
          "enemySummary": [
            "Crimson Zealot ×3",
            "Lost Soul ×2",
            "Ravenous Brood ×2",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×3, Lost Soul ×2, Ravenous Brood ×2"
        },
        {
          "index": 8,
          "label": "G17 · Tombguard Reaver ×2, Stalking Grim ×2",
          "x": 66.4,
          "y": 15.3,
          "killScore": 17,
          "killPercent": 12.14,
          "mobCount": 5,
          "packTags": [
            "G17"
          ],
          "enemySummary": [
            "Tombguard Reaver ×2",
            "Stalking Grim ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Tombguard Reaver ×2, Stalking Grim ×2, Sanguine Oracle"
        },
        {
          "index": 9,
          "label": "Sin-Magir",
          "x": 76.1,
          "y": 15.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Sin-Magir"
          ],
          "kind": "boss",
          "notes": "Sin-Magir"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.APYcRW1weXJlYW4gU2FuZHMg4oCUIFMyIEdob3JuFDR40S8NCwxQ5EZONkTGmzIcdI6RvSELBABHaG9ybiB0aGUgQXZhbGFuY2hlICgrMjBzIEJvb24pYoBTaW4tTWFnaXIIXKA",
      "shareHash": "#r5=APYcRW1weXJlYW4gU2FuZHMg4oCUIFMyIEdob3JuFDR40S8NCwxQ5EZONkTGmzIcdI6RvSELBABHaG9ybiB0aGUgQXZhbGFuY2hlICgrMjBzIEJvb24pYoBTaW4tTWFnaXIIXKA",
      "totalScore": 143,
      "requiredScore": 140,
      "totalPercent": 102.14,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G27 + G21 · Lost Soul ×2, Ravenous Brood ×2",
          "x": 21.3,
          "y": 82.4,
          "killScore": 15,
          "killPercent": 10.71,
          "mobCount": 7,
          "packTags": [
            "G27",
            "G21"
          ],
          "enemySummary": [
            "Lost Soul ×2",
            "Ravenous Brood ×2",
            "Crimson Zealot",
            "Acolyte of Sinnari",
            "Stalking Grim"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×2, Ravenous Brood ×2, Crimson Zealot"
        },
        {
          "index": 2,
          "label": "G41 · Stalking Grim ×2, Tombguard Reaver",
          "x": 27.8,
          "y": 81.2,
          "killScore": 13,
          "killPercent": 9.29,
          "mobCount": 4,
          "packTags": [
            "G41"
          ],
          "enemySummary": [
            "Stalking Grim ×2",
            "Tombguard Reaver",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×2, Tombguard Reaver, Ascended Bloodweaver"
        },
        {
          "index": 3,
          "label": "G33 + G37 · Crimson Zealot ×2, Sandsworn Husk ×2",
          "x": 30.7,
          "y": 71.1,
          "killScore": 21,
          "killPercent": 15,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G37"
          ],
          "enemySummary": [
            "Crimson Zealot ×2",
            "Sandsworn Husk ×2",
            "Dunesnare Hunter",
            "Gravebreaker Brute",
            "Tombguard Reaver"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×2, Sandsworn Husk ×2, Dunesnare Hunter"
        },
        {
          "index": 4,
          "label": "Ghorn the Avalanche (+20s Boon)",
          "x": 35.9,
          "y": 61.7,
          "killScore": 20,
          "killPercent": 14.29,
          "mobCount": 1,
          "packTags": [
            "Ghorn"
          ],
          "enemySummary": [
            "Ghorn"
          ],
          "kind": "miniboss",
          "notes": "Ghorn"
        },
        {
          "index": 5,
          "label": "G28 + G31 + G29 · Sandsworn Husk ×4, Sanguine Echo ×2",
          "x": 49.9,
          "y": 55.7,
          "killScore": 22,
          "killPercent": 15.71,
          "mobCount": 9,
          "packTags": [
            "G28",
            "G31",
            "G29"
          ],
          "enemySummary": [
            "Sandsworn Husk ×4",
            "Sanguine Echo ×2",
            "Crimson Zealot",
            "Ascended Bloodweaver",
            "Water Surger"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×4, Sanguine Echo ×2, Crimson Zealot"
        },
        {
          "index": 6,
          "label": "G7 + G12 + G26 · Ravenous Brood ×3, Sanguine Echo ×2",
          "x": 58.4,
          "y": 45.2,
          "killScore": 16,
          "killPercent": 11.43,
          "mobCount": 7,
          "packTags": [
            "G7",
            "G12",
            "G26"
          ],
          "enemySummary": [
            "Ravenous Brood ×3",
            "Sanguine Echo ×2",
            "Stalking Grim ×2"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×3, Sanguine Echo ×2, Stalking Grim ×2"
        },
        {
          "index": 7,
          "label": "G2 + G8 · Crimson Zealot ×3, Lost Soul ×2",
          "x": 63.8,
          "y": 35,
          "killScore": 19,
          "killPercent": 13.57,
          "mobCount": 8,
          "packTags": [
            "G2",
            "G8"
          ],
          "enemySummary": [
            "Crimson Zealot ×3",
            "Lost Soul ×2",
            "Ravenous Brood ×2",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×3, Lost Soul ×2, Ravenous Brood ×2"
        },
        {
          "index": 8,
          "label": "G17 · Tombguard Reaver ×2, Stalking Grim ×2",
          "x": 66.4,
          "y": 15.3,
          "killScore": 17,
          "killPercent": 12.14,
          "mobCount": 5,
          "packTags": [
            "G17"
          ],
          "enemySummary": [
            "Tombguard Reaver ×2",
            "Stalking Grim ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Tombguard Reaver ×2, Stalking Grim ×2, Sanguine Oracle"
        },
        {
          "index": 9,
          "label": "Sin-Magir",
          "x": 76.1,
          "y": 15.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Sin-Magir"
          ],
          "kind": "boss",
          "notes": "Sin-Magir"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.APYbRW1weXJlYW4gU2FuZHMg4oCUIFMyIEVpcmEUJXJF2hYYs3FSIycbImNNmQ46R0jekgWCEEVpcmEgdGhlIFdoaXRlIFdpdGNoICgrOTBzIEJvb24pYoBTaW4tTWFnaXIgXJA",
      "shareHash": "#r5=APYbRW1weXJlYW4gU2FuZHMg4oCUIFMyIEVpcmEUJXJF2hYYs3FSIycbImNNmQ46R0jekgWCEEVpcmEgdGhlIFdoaXRlIFdpdGNoICgrOTBzIEJvb24pYoBTaW4tTWFnaXIgXJA",
      "totalScore": 142,
      "requiredScore": 140,
      "totalPercent": 101.43,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G11 · Sandsworn Husk ×2, Crimson Zealot",
          "x": 20.3,
          "y": 75.4,
          "killScore": 7,
          "killPercent": 5,
          "mobCount": 3,
          "packTags": [
            "G11"
          ],
          "enemySummary": [
            "Sandsworn Husk ×2",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×2, Crimson Zealot"
        },
        {
          "index": 2,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 24.1,
          "y": 71.6,
          "killScore": 20,
          "killPercent": 14.29,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 3,
          "label": "G33 + G37 · Crimson Zealot ×2, Sandsworn Husk ×2",
          "x": 30.7,
          "y": 71.1,
          "killScore": 21,
          "killPercent": 15,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G37"
          ],
          "enemySummary": [
            "Crimson Zealot ×2",
            "Sandsworn Husk ×2",
            "Dunesnare Hunter",
            "Gravebreaker Brute",
            "Tombguard Reaver"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×2, Sandsworn Husk ×2, Dunesnare Hunter"
        },
        {
          "index": 4,
          "label": "G30 + G24 · Sandsworn Husk ×4, Sanguine Echo ×2",
          "x": 36.3,
          "y": 61.5,
          "killScore": 20,
          "killPercent": 14.29,
          "mobCount": 8,
          "packTags": [
            "G30",
            "G24"
          ],
          "enemySummary": [
            "Sandsworn Husk ×4",
            "Sanguine Echo ×2",
            "Crimson Zealot",
            "Nightbound Magi"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×4, Sanguine Echo ×2, Crimson Zealot"
        },
        {
          "index": 5,
          "label": "G28 + G31 + G29 · Sandsworn Husk ×4, Sanguine Echo ×2",
          "x": 49.9,
          "y": 55.7,
          "killScore": 22,
          "killPercent": 15.71,
          "mobCount": 9,
          "packTags": [
            "G28",
            "G31",
            "G29"
          ],
          "enemySummary": [
            "Sandsworn Husk ×4",
            "Sanguine Echo ×2",
            "Crimson Zealot",
            "Ascended Bloodweaver",
            "Water Surger"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×4, Sanguine Echo ×2, Crimson Zealot"
        },
        {
          "index": 6,
          "label": "G7 + G12 + G26 · Ravenous Brood ×3, Sanguine Echo ×2",
          "x": 58.4,
          "y": 45.2,
          "killScore": 16,
          "killPercent": 11.43,
          "mobCount": 7,
          "packTags": [
            "G7",
            "G12",
            "G26"
          ],
          "enemySummary": [
            "Ravenous Brood ×3",
            "Sanguine Echo ×2",
            "Stalking Grim ×2"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×3, Sanguine Echo ×2, Stalking Grim ×2"
        },
        {
          "index": 7,
          "label": "G2 + G8 · Crimson Zealot ×3, Lost Soul ×2",
          "x": 63.8,
          "y": 35,
          "killScore": 19,
          "killPercent": 13.57,
          "mobCount": 8,
          "packTags": [
            "G2",
            "G8"
          ],
          "enemySummary": [
            "Crimson Zealot ×3",
            "Lost Soul ×2",
            "Ravenous Brood ×2",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×3, Lost Soul ×2, Ravenous Brood ×2"
        },
        {
          "index": 8,
          "label": "G17 · Tombguard Reaver ×2, Stalking Grim ×2",
          "x": 66.4,
          "y": 15.3,
          "killScore": 17,
          "killPercent": 12.14,
          "mobCount": 5,
          "packTags": [
            "G17"
          ],
          "enemySummary": [
            "Tombguard Reaver ×2",
            "Stalking Grim ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Tombguard Reaver ×2, Stalking Grim ×2, Sanguine Oracle"
        },
        {
          "index": 9,
          "label": "Sin-Magir",
          "x": 76.1,
          "y": 15.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Sin-Magir"
          ],
          "kind": "boss",
          "notes": "Sin-Magir"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.APYIAEVtcHlyZWFuIFNhbmRzIOKAlCBTMiBFbXBvd2VyZWQWNHjRLwlaGZcyz4kIrVWqs2ipNwSOkb0gBYpTaW4tTWFnaXIALmA",
      "shareHash": "#r5=APYIAEVtcHlyZWFuIFNhbmRzIOKAlCBTMiBFbXBvd2VyZWQWNHjRLwlaGZcyz4kIrVWqs2ipNwSOkb0gBYpTaW4tTWFnaXIALmA",
      "totalScore": 143,
      "requiredScore": 140,
      "totalPercent": 102.14,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G27 + G21 · Lost Soul ×2, Ravenous Brood ×2",
          "x": 21.3,
          "y": 82.4,
          "killScore": 15,
          "killPercent": 10.71,
          "mobCount": 7,
          "packTags": [
            "G27",
            "G21"
          ],
          "enemySummary": [
            "Lost Soul ×2",
            "Ravenous Brood ×2",
            "Crimson Zealot",
            "Acolyte of Sinnari",
            "Stalking Grim"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×2, Ravenous Brood ×2, Crimson Zealot"
        },
        {
          "index": 2,
          "label": "G41 · Stalking Grim ×2, Tombguard Reaver",
          "x": 27.8,
          "y": 81.2,
          "killScore": 13,
          "killPercent": 9.29,
          "mobCount": 4,
          "packTags": [
            "G41"
          ],
          "enemySummary": [
            "Stalking Grim ×2",
            "Tombguard Reaver",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×2, Tombguard Reaver, Ascended Bloodweaver"
        },
        {
          "index": 3,
          "label": "G33 · Crimson Zealot ×2, Dunesnare Hunter",
          "x": 29.5,
          "y": 72.6,
          "killScore": 14,
          "killPercent": 10,
          "mobCount": 4,
          "packTags": [
            "G33"
          ],
          "enemySummary": [
            "Crimson Zealot ×2",
            "Dunesnare Hunter",
            "Gravebreaker Brute"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×2, Dunesnare Hunter, Gravebreaker Brute"
        },
        {
          "index": 4,
          "label": "G37 + G30 · Sandsworn Husk ×2, Sanguine Echo ×2",
          "x": 33.7,
          "y": 65.5,
          "killScore": 20,
          "killPercent": 14.29,
          "mobCount": 6,
          "packTags": [
            "G37",
            "G30"
          ],
          "enemySummary": [
            "Sandsworn Husk ×2",
            "Sanguine Echo ×2",
            "Tombguard Reaver",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×2, Sanguine Echo ×2, Tombguard Reaver"
        },
        {
          "index": 5,
          "label": "G24 + G28 · Sandsworn Husk ×6, Nightbound Magi",
          "x": 40.5,
          "y": 60.4,
          "killScore": 20,
          "killPercent": 14.29,
          "mobCount": 8,
          "packTags": [
            "G24",
            "G28"
          ],
          "enemySummary": [
            "Sandsworn Husk ×6",
            "Nightbound Magi",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Sandsworn Husk ×6, Nightbound Magi, Crimson Zealot"
        },
        {
          "index": 6,
          "label": "G31 + G29 + G7 · Sanguine Echo ×4, Sandsworn Husk ×2",
          "x": 53.1,
          "y": 53.2,
          "killScore": 19,
          "killPercent": 13.57,
          "mobCount": 8,
          "packTags": [
            "G31",
            "G29",
            "G7"
          ],
          "enemySummary": [
            "Sanguine Echo ×4",
            "Sandsworn Husk ×2",
            "Ascended Bloodweaver",
            "Water Surger"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×4, Sandsworn Husk ×2, Ascended Bloodweaver"
        },
        {
          "index": 7,
          "label": "G12 + G2 · Stalking Grim ×2, Crimson Zealot ×2",
          "x": 61,
          "y": 40.6,
          "killScore": 18,
          "killPercent": 12.86,
          "mobCount": 7,
          "packTags": [
            "G12",
            "G2"
          ],
          "enemySummary": [
            "Stalking Grim ×2",
            "Crimson Zealot ×2",
            "Lost Soul ×2",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×2, Crimson Zealot ×2, Lost Soul ×2"
        },
        {
          "index": 8,
          "label": "G8 · Ravenous Brood ×2, Crimson Zealot",
          "x": 66.5,
          "y": 27,
          "killScore": 7,
          "killPercent": 5,
          "mobCount": 3,
          "packTags": [
            "G8"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Crimson Zealot"
        },
        {
          "index": 9,
          "label": "G17 · Tombguard Reaver ×2, Stalking Grim ×2",
          "x": 66.4,
          "y": 15.3,
          "killScore": 17,
          "killPercent": 12.14,
          "mobCount": 5,
          "packTags": [
            "G17"
          ],
          "enemySummary": [
            "Tombguard Reaver ×2",
            "Stalking Grim ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Tombguard Reaver ×2, Stalking Grim ×2, Sanguine Oracle"
        },
        {
          "index": 10,
          "label": "Sin-Magir",
          "x": 76.1,
          "y": 15.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Sin-Magir"
          ],
          "kind": "boss",
          "notes": "Sin-Magir"
        }
      ]
    }
  },
  "godfall-quarry": {
    "Regular": {
      "r5Code": "R5.AVvb5OCen5KWmJOjEFiaWFRUqfCoYYpCsJFCcEliXkpiUYpCQGlxhphBI-vMYhbjHkOlr-5PQrv-K1U-mtZt1PvkzsQ_DWIWMBNCMksS8xj0HAA",
      "shareHash": "#r5=AVvb5OCen5KWmJOjEFiaWFRUqfCoYYpCsJFCcEliXkpiUYpCQGlxhphBI-vMYhbjHkOlr-5PQrv-K1U-mtZt1PvkzsQ_DWIWMBNCMksS8xj0HAA",
      "totalScore": 135,
      "requiredScore": 135,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G33 + G25 · Dredge ×4, Quarry Stalker ×2",
          "x": 57.1,
          "y": 89.8,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G25"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Quarry Stalker ×2",
            "Brutal Taskmaster"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Quarry Stalker ×2, Brutal Taskmaster"
        },
        {
          "index": 2,
          "label": "G9 + G28 · Skittershard ×3, Brutal Taskmaster ×2",
          "x": 56.2,
          "y": 83.4,
          "killScore": 15,
          "killPercent": 11.11,
          "mobCount": 8,
          "packTags": [
            "G9",
            "G28"
          ],
          "enemySummary": [
            "Skittershard ×3",
            "Brutal Taskmaster ×2",
            "Dredge ×2",
            "Arcane Dominator"
          ],
          "kind": "pack",
          "notes": "Skittershard ×3, Brutal Taskmaster ×2, Dredge ×2"
        },
        {
          "index": 3,
          "label": "G31 + G23 + G14 · Dredge ×4, Cruel Warden ×2",
          "x": 52.6,
          "y": 80.5,
          "killScore": 20,
          "killPercent": 14.81,
          "mobCount": 9,
          "packTags": [
            "G31",
            "G23",
            "G14"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Cruel Warden ×2",
            "Nezari Bolter ×2",
            "Quarry Stalker"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Cruel Warden ×2, Nezari Bolter ×2"
        },
        {
          "index": 4,
          "label": "G17 + G20 + G36 · Brutal Taskmaster ×2, Dredge ×2",
          "x": 49.4,
          "y": 75,
          "killScore": 14,
          "killPercent": 10.37,
          "mobCount": 8,
          "packTags": [
            "G17",
            "G20",
            "G36"
          ],
          "enemySummary": [
            "Brutal Taskmaster ×2",
            "Dredge ×2",
            "Godfall Wardstone ×2",
            "Skittershard ×2"
          ],
          "kind": "pack",
          "notes": "Brutal Taskmaster ×2, Dredge ×2, Godfall Wardstone ×2"
        },
        {
          "index": 5,
          "label": "G15 + G27 + G7 · Skittershard ×2, Godstone Goliath",
          "x": 44.6,
          "y": 73.1,
          "killScore": 15,
          "killPercent": 11.11,
          "mobCount": 5,
          "packTags": [
            "G15",
            "G27",
            "G7"
          ],
          "enemySummary": [
            "Skittershard ×2",
            "Godstone Goliath",
            "Godfall Wardstone",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Skittershard ×2, Godstone Goliath, Godfall Wardstone"
        },
        {
          "index": 6,
          "label": "G29 + G22 + G16 · Skittershard ×4, Nezari Bolter ×2",
          "x": 40.9,
          "y": 60.5,
          "killScore": 15,
          "killPercent": 11.11,
          "mobCount": 9,
          "packTags": [
            "G29",
            "G22",
            "G16"
          ],
          "enemySummary": [
            "Skittershard ×4",
            "Nezari Bolter ×2",
            "Dredge ×2",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Skittershard ×4, Nezari Bolter ×2, Dredge ×2"
        },
        {
          "index": 7,
          "label": "G2 + G30 · Skittershard ×2, Godstone Goliath",
          "x": 41,
          "y": 52.6,
          "killScore": 8,
          "killPercent": 5.93,
          "mobCount": 3,
          "packTags": [
            "G2",
            "G30"
          ],
          "enemySummary": [
            "Skittershard ×2",
            "Godstone Goliath"
          ],
          "kind": "pack",
          "notes": "Skittershard ×2, Godstone Goliath"
        },
        {
          "index": 8,
          "label": "G4 · Cruel Warden ×2, Arcane Dominator ×2",
          "x": 42.9,
          "y": 43.1,
          "killScore": 18,
          "killPercent": 13.33,
          "mobCount": 4,
          "packTags": [
            "G4"
          ],
          "enemySummary": [
            "Cruel Warden ×2",
            "Arcane Dominator ×2"
          ],
          "kind": "pack",
          "notes": "Cruel Warden ×2, Arcane Dominator ×2"
        },
        {
          "index": 9,
          "label": "G21 · Brutal Taskmaster ×2, Arcane Dominator ×2",
          "x": 47.1,
          "y": 34.2,
          "killScore": 19,
          "killPercent": 14.07,
          "mobCount": 5,
          "packTags": [
            "G21"
          ],
          "enemySummary": [
            "Brutal Taskmaster ×2",
            "Arcane Dominator ×2",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Brutal Taskmaster ×2, Arcane Dominator ×2, Cruel Warden"
        },
        {
          "index": 10,
          "label": "Godfall Titan",
          "x": 48.8,
          "y": 10.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Godfall Titan"
          ],
          "kind": "boss",
          "notes": "Godfall Titan"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.AVvbzuCen5KWmJOjEFiaWFRUqfCoYYpCsJGCe0Z-UZ6EQSPrhJdvzhl0X5WfGKb9pb39iI7bTL7Zk-zcPzHqCDCAFSmUZKQqOJYl5iTmJWekKmhoGxkUKzjl5-dpJjfAzA7JLEnMY5iuAQA",
      "shareHash": "#r5=AVvbzuCen5KWmJOjEFiaWFRUqfCoYYpCsJGCe0Z-UZ6EQSPrhJdvzhl0X5WfGKb9pb39iI7bTL7Zk-zcPzHqCDCAFSmUZKQqOJYl5iTmJWekKmhoGxkUKzjl5-dpJjfAzA7JLEnMY5iuAQA",
      "totalScore": 136,
      "requiredScore": 135,
      "totalPercent": 100.74,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G33 + G25 · Dredge ×4, Quarry Stalker ×2",
          "x": 57.1,
          "y": 89.8,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G25"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Quarry Stalker ×2",
            "Brutal Taskmaster"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Quarry Stalker ×2, Brutal Taskmaster"
        },
        {
          "index": 2,
          "label": "G28 + G11 · Dredge ×4, Brutal Taskmaster ×2",
          "x": 54.2,
          "y": 84.7,
          "killScore": 12,
          "killPercent": 8.89,
          "mobCount": 7,
          "packTags": [
            "G28",
            "G11"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Brutal Taskmaster ×2",
            "Nezari Bolter"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Brutal Taskmaster ×2, Nezari Bolter"
        },
        {
          "index": 3,
          "label": "G31 + G23 · Dredge ×4, Cruel Warden",
          "x": 53.9,
          "y": 79.6,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 6,
          "packTags": [
            "G31",
            "G23"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Cruel Warden",
            "Quarry Stalker"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Cruel Warden, Quarry Stalker"
        },
        {
          "index": 4,
          "label": "G17 + G20 + G36 · Brutal Taskmaster ×2, Dredge ×2",
          "x": 49.4,
          "y": 75,
          "killScore": 14,
          "killPercent": 10.37,
          "mobCount": 8,
          "packTags": [
            "G17",
            "G20",
            "G36"
          ],
          "enemySummary": [
            "Brutal Taskmaster ×2",
            "Dredge ×2",
            "Godfall Wardstone ×2",
            "Skittershard ×2"
          ],
          "kind": "pack",
          "notes": "Brutal Taskmaster ×2, Dredge ×2, Godfall Wardstone ×2"
        },
        {
          "index": 5,
          "label": "G15 + G27 + G29 · Skittershard ×2, Nezari Bolter ×2",
          "x": 43.3,
          "y": 67,
          "killScore": 21,
          "killPercent": 15.56,
          "mobCount": 9,
          "packTags": [
            "G15",
            "G27",
            "G29"
          ],
          "enemySummary": [
            "Skittershard ×2",
            "Nezari Bolter ×2",
            "Dredge ×2",
            "Godstone Goliath",
            "Godfall Wardstone",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Skittershard ×2, Nezari Bolter ×2, Dredge ×2"
        },
        {
          "index": 6,
          "label": "G3 + G22 + G16 · Skittershard ×4, Dredge ×2",
          "x": 39.8,
          "y": 59.4,
          "killScore": 6,
          "killPercent": 4.44,
          "mobCount": 6,
          "packTags": [
            "G3",
            "G22",
            "G16"
          ],
          "enemySummary": [
            "Skittershard ×4",
            "Dredge ×2"
          ],
          "kind": "pack",
          "notes": "Skittershard ×4, Dredge ×2"
        },
        {
          "index": 7,
          "label": "G5 + G2 · Dredge ×4, Brutal Taskmaster ×2",
          "x": 38.9,
          "y": 54.1,
          "killScore": 16,
          "killPercent": 11.85,
          "mobCount": 9,
          "packTags": [
            "G5",
            "G2"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Brutal Taskmaster ×2",
            "Skittershard ×2",
            "Arcane Dominator"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Brutal Taskmaster ×2, Skittershard ×2"
        },
        {
          "index": 8,
          "label": "Ghorn the Avalanche (+20s Boon)",
          "x": 41.4,
          "y": 44.2,
          "killScore": 20,
          "killPercent": 14.81,
          "mobCount": 1,
          "packTags": [
            "Ghorn"
          ],
          "enemySummary": [
            "Ghorn"
          ],
          "kind": "miniboss",
          "notes": "Ghorn"
        },
        {
          "index": 9,
          "label": "G21 · Brutal Taskmaster ×2, Arcane Dominator ×2",
          "x": 47.1,
          "y": 34.2,
          "killScore": 19,
          "killPercent": 14.07,
          "mobCount": 5,
          "packTags": [
            "G21"
          ],
          "enemySummary": [
            "Brutal Taskmaster ×2",
            "Arcane Dominator ×2",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Brutal Taskmaster ×2, Arcane Dominator ×2, Cruel Warden"
        },
        {
          "index": 10,
          "label": "G19 · Dredge ×3, Brutal Taskmaster",
          "x": 49.1,
          "y": 34.9,
          "killScore": 6,
          "killPercent": 4.44,
          "mobCount": 4,
          "packTags": [
            "G19"
          ],
          "enemySummary": [
            "Dredge ×3",
            "Brutal Taskmaster"
          ],
          "kind": "pack",
          "notes": "Dredge ×3, Brutal Taskmaster"
        },
        {
          "index": 11,
          "label": "Godfall Titan",
          "x": 48.8,
          "y": 10.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Godfall Titan"
          ],
          "kind": "boss",
          "notes": "Godfall Titan"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.AVvbdsA9PyUtMSdHIbA0saioUuFRwxSFYCMF18yiRAmDRtYJL9-cM-i-Kj8xTPvrqusau137BPfMnmQ_QTChBaREoSQjVSE8I7MkVSE8syQ5Q0FD29KgWMEpPz9PM7kBZnRIZkliHqO4CgA",
      "shareHash": "#r5=AVvbdsA9PyUtMSdHIbA0saioUuFRwxSFYCMF18yiRAmDRtYJL9-cM-i-Kj8xTPvrqusau137BPfMnmQ_QTChBaREoSQjVSE8I7MkVSE8syQ5Q0FD29KgWMEpPz9PM7kBZnRIZkliHqO4CgA",
      "totalScore": 136,
      "requiredScore": 135,
      "totalPercent": 100.74,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G33 + G25 · Dredge ×4, Quarry Stalker ×2",
          "x": 57.1,
          "y": 89.8,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G25"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Quarry Stalker ×2",
            "Brutal Taskmaster"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Quarry Stalker ×2, Brutal Taskmaster"
        },
        {
          "index": 2,
          "label": "G28 + G11 · Dredge ×4, Brutal Taskmaster ×2",
          "x": 54.2,
          "y": 84.7,
          "killScore": 12,
          "killPercent": 8.89,
          "mobCount": 7,
          "packTags": [
            "G28",
            "G11"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Brutal Taskmaster ×2",
            "Nezari Bolter"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Brutal Taskmaster ×2, Nezari Bolter"
        },
        {
          "index": 3,
          "label": "G31 + G23 · Dredge ×4, Cruel Warden",
          "x": 53.9,
          "y": 79.6,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 6,
          "packTags": [
            "G31",
            "G23"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Cruel Warden",
            "Quarry Stalker"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Cruel Warden, Quarry Stalker"
        },
        {
          "index": 4,
          "label": "G17 + G20 + G36 · Brutal Taskmaster ×2, Dredge ×2",
          "x": 49.4,
          "y": 75,
          "killScore": 14,
          "killPercent": 10.37,
          "mobCount": 8,
          "packTags": [
            "G17",
            "G20",
            "G36"
          ],
          "enemySummary": [
            "Brutal Taskmaster ×2",
            "Dredge ×2",
            "Godfall Wardstone ×2",
            "Skittershard ×2"
          ],
          "kind": "pack",
          "notes": "Brutal Taskmaster ×2, Dredge ×2, Godfall Wardstone ×2"
        },
        {
          "index": 5,
          "label": "G15 + G27 + G29 · Skittershard ×2, Nezari Bolter ×2",
          "x": 43.3,
          "y": 67,
          "killScore": 21,
          "killPercent": 15.56,
          "mobCount": 9,
          "packTags": [
            "G15",
            "G27",
            "G29"
          ],
          "enemySummary": [
            "Skittershard ×2",
            "Nezari Bolter ×2",
            "Dredge ×2",
            "Godstone Goliath",
            "Godfall Wardstone",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Skittershard ×2, Nezari Bolter ×2, Dredge ×2"
        },
        {
          "index": 6,
          "label": "G22 + G16 · Skittershard ×4",
          "x": 39.9,
          "y": 57.3,
          "killScore": 4,
          "killPercent": 2.96,
          "mobCount": 4,
          "packTags": [
            "G22",
            "G16"
          ],
          "enemySummary": [
            "Skittershard ×4"
          ],
          "kind": "pack",
          "notes": "Skittershard ×4"
        },
        {
          "index": 7,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 38.2,
          "y": 54.6,
          "killScore": 20,
          "killPercent": 14.81,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 8,
          "label": "G2 + G24 · Skittershard ×4, Dredge ×2",
          "x": 41.2,
          "y": 48.5,
          "killScore": 6,
          "killPercent": 4.44,
          "mobCount": 6,
          "packTags": [
            "G2",
            "G24"
          ],
          "enemySummary": [
            "Skittershard ×4",
            "Dredge ×2"
          ],
          "kind": "pack",
          "notes": "Skittershard ×4, Dredge ×2"
        },
        {
          "index": 9,
          "label": "G4 · Cruel Warden ×2, Arcane Dominator ×2",
          "x": 42.9,
          "y": 43.1,
          "killScore": 18,
          "killPercent": 13.33,
          "mobCount": 4,
          "packTags": [
            "G4"
          ],
          "enemySummary": [
            "Cruel Warden ×2",
            "Arcane Dominator ×2"
          ],
          "kind": "pack",
          "notes": "Cruel Warden ×2, Arcane Dominator ×2"
        },
        {
          "index": 10,
          "label": "G21 · Brutal Taskmaster ×2, Arcane Dominator ×2",
          "x": 47.1,
          "y": 34.2,
          "killScore": 19,
          "killPercent": 14.07,
          "mobCount": 5,
          "packTags": [
            "G21"
          ],
          "enemySummary": [
            "Brutal Taskmaster ×2",
            "Arcane Dominator ×2",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Brutal Taskmaster ×2, Arcane Dominator ×2, Cruel Warden"
        },
        {
          "index": 11,
          "label": "Godfall Titan",
          "x": 48.8,
          "y": 10.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Godfall Titan"
          ],
          "kind": "boss",
          "notes": "Godfall Titan"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AVvbxOCen5KWmJOjEFiaWFRUqfCoYYpCsJGCa25BfnlqUWqKmEEj68xvW0Oe9Hb9T-sXm9B-vNqsb-Ke2ZPsJzAdh2sOySxJzGPQSwAA",
      "shareHash": "#r5=AVvbxOCen5KWmJOjEFiaWFRUqfCoYYpCsJGCa25BfnlqUWqKmEEj68xvW0Oe9Hb9T-sXm9B-vNqsb-Ke2ZPsJzAdh2sOySxJzGPQSwAA",
      "totalScore": 136,
      "requiredScore": 135,
      "totalPercent": 100.74,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G33 + G25 · Dredge ×4, Quarry Stalker ×2",
          "x": 57.1,
          "y": 89.8,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G25"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Quarry Stalker ×2",
            "Brutal Taskmaster"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Quarry Stalker ×2, Brutal Taskmaster"
        },
        {
          "index": 2,
          "label": "G28 + G31 · Dredge ×4, Brutal Taskmaster ×2",
          "x": 54.7,
          "y": 83.1,
          "killScore": 15,
          "killPercent": 11.11,
          "mobCount": 7,
          "packTags": [
            "G28",
            "G31"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Brutal Taskmaster ×2",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Brutal Taskmaster ×2, Cruel Warden"
        },
        {
          "index": 3,
          "label": "G23 + G17 · Dredge ×4, Brutal Taskmaster ×2",
          "x": 51.7,
          "y": 77.1,
          "killScore": 18,
          "killPercent": 13.33,
          "mobCount": 7,
          "packTags": [
            "G23",
            "G17"
          ],
          "enemySummary": [
            "Dredge ×4",
            "Brutal Taskmaster ×2",
            "Quarry Stalker"
          ],
          "kind": "pack",
          "notes": "Dredge ×4, Brutal Taskmaster ×2, Quarry Stalker"
        },
        {
          "index": 4,
          "label": "G20 + G36 + G15 · Godfall Wardstone ×2, Skittershard ×2",
          "x": 47.9,
          "y": 73.5,
          "killScore": 12,
          "killPercent": 8.89,
          "mobCount": 5,
          "packTags": [
            "G20",
            "G36",
            "G15"
          ],
          "enemySummary": [
            "Godfall Wardstone ×2",
            "Skittershard ×2",
            "Godstone Goliath"
          ],
          "kind": "pack",
          "notes": "Godfall Wardstone ×2, Skittershard ×2, Godstone Goliath"
        },
        {
          "index": 5,
          "label": "G27 + G29 · Skittershard ×2, Nezari Bolter ×2",
          "x": 43,
          "y": 66.3,
          "killScore": 15,
          "killPercent": 11.11,
          "mobCount": 8,
          "packTags": [
            "G27",
            "G29"
          ],
          "enemySummary": [
            "Skittershard ×2",
            "Nezari Bolter ×2",
            "Dredge ×2",
            "Godfall Wardstone",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Skittershard ×2, Nezari Bolter ×2, Dredge ×2"
        },
        {
          "index": 6,
          "label": "G22 + G16 + G2 · Skittershard ×6",
          "x": 39.9,
          "y": 55.7,
          "killScore": 6,
          "killPercent": 4.44,
          "mobCount": 6,
          "packTags": [
            "G22",
            "G16",
            "G2"
          ],
          "enemySummary": [
            "Skittershard ×6"
          ],
          "kind": "pack",
          "notes": "Skittershard ×6"
        },
        {
          "index": 7,
          "label": "G30 + G24 · Dredge ×2, Skittershard ×2",
          "x": 42.2,
          "y": 47.6,
          "killScore": 22,
          "killPercent": 16.3,
          "mobCount": 5,
          "packTags": [
            "G30",
            "G24"
          ],
          "enemySummary": [
            "Dredge ×2",
            "Skittershard ×2",
            "Godstone Goliath"
          ],
          "kind": "pack",
          "notes": "Dredge ×2, Skittershard ×2, Godstone Goliath"
        },
        {
          "index": 8,
          "label": "G4 · Cruel Warden ×2, Arcane Dominator ×2",
          "x": 42.9,
          "y": 43.1,
          "killScore": 18,
          "killPercent": 13.33,
          "mobCount": 4,
          "packTags": [
            "G4"
          ],
          "enemySummary": [
            "Cruel Warden ×2",
            "Arcane Dominator ×2"
          ],
          "kind": "pack",
          "notes": "Cruel Warden ×2, Arcane Dominator ×2"
        },
        {
          "index": 9,
          "label": "G21 · Brutal Taskmaster ×2, Arcane Dominator ×2",
          "x": 47.1,
          "y": 34.2,
          "killScore": 19,
          "killPercent": 14.07,
          "mobCount": 5,
          "packTags": [
            "G21"
          ],
          "enemySummary": [
            "Brutal Taskmaster ×2",
            "Arcane Dominator ×2",
            "Cruel Warden"
          ],
          "kind": "pack",
          "notes": "Brutal Taskmaster ×2, Arcane Dominator ×2, Cruel Warden"
        },
        {
          "index": 10,
          "label": "Godfall Titan",
          "x": 48.8,
          "y": 10.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Godfall Titan"
          ],
          "kind": "boss",
          "notes": "Godfall Titan"
        }
      ]
    }
  },
  "cithrels-fall": {
    "Regular": {
      "r5Code": "R5.Advb5OCcWZJRlJqjXqzglpiTo_CoYYpCsJFCcEliXkpiUYpCQGlxhowgD98n5-ZDy2aoqb2Z2By2zEibyds5fHnJ2rNcNzOSyiZ-CvfkcO1zzEvOTM0rUfDOL8ovTjTwy88v0lEIyUhVcEotKUqsTC1KYoBaxuF6AgA",
      "shareHash": "#r5=Advb5OCcWZJRlJqjXqzglpiTo_CoYYpCsJFCcEliXkpiUYpCQGlxhowgD98n5-ZDy2aoqb2Z2By2zEibyds5fHnJ2rNcNzOSyiZ-CvfkcO1zzEvOTM0rUfDOL8ovTjTwy88v0lEIyUhVcEotKUqsTC1KYoBaxuF6AgA",
      "totalScore": 188,
      "requiredScore": 188,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G48 + G28 + G36 · Ice Shardling ×2, Icewyrm Sentinel ×2",
          "x": 45.6,
          "y": 79.2,
          "killScore": 21,
          "killPercent": 11.17,
          "mobCount": 7,
          "packTags": [
            "G48",
            "G28",
            "G36"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Icewyrm Sentinel ×2",
            "Elder Glacial Bear",
            "Raging Ice Elemental",
            "Blade of Cithrel"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Icewyrm Sentinel ×2, Elder Glacial Bear"
        },
        {
          "index": 2,
          "label": "G9 + G12 + G16 · Dire Wolf ×3, Frozen Remnant ×2",
          "x": 51.1,
          "y": 64.5,
          "killScore": 20,
          "killPercent": 10.64,
          "mobCount": 9,
          "packTags": [
            "G9",
            "G12",
            "G16"
          ],
          "enemySummary": [
            "Dire Wolf ×3",
            "Frozen Remnant ×2",
            "Raging Ice Elemental ×2",
            "Ice Shardling ×2"
          ],
          "kind": "pack",
          "notes": "Dire Wolf ×3, Frozen Remnant ×2, Raging Ice Elemental ×2"
        },
        {
          "index": 3,
          "label": "G47 + G14 · Ice Shardling ×2, Glacial Colossus",
          "x": 64.4,
          "y": 53.9,
          "killScore": 16,
          "killPercent": 8.51,
          "mobCount": 5,
          "packTags": [
            "G47",
            "G14"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Glacial Colossus",
            "Deceitful Scholar",
            "Blade of Cithrel"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Glacial Colossus, Deceitful Scholar"
        },
        {
          "index": 4,
          "label": "Ancient Koros",
          "x": 67.4,
          "y": 52.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Ancient Koros"
          ],
          "kind": "boss",
          "notes": "Ancient Koros"
        },
        {
          "index": 5,
          "label": "G18 · Ice Shardling ×2, Blade of Cithrel ×2",
          "x": 59.4,
          "y": 47.3,
          "killScore": 18,
          "killPercent": 9.57,
          "mobCount": 6,
          "packTags": [
            "G18"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Blade of Cithrel ×2",
            "Al'zerac Corruptor",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Blade of Cithrel ×2, Al'zerac Corruptor"
        },
        {
          "index": 6,
          "label": "G22 + G42 · Tundra Stalker ×2, Eldrin Swordsman ×2",
          "x": 55.9,
          "y": 45.4,
          "killScore": 16,
          "killPercent": 8.51,
          "mobCount": 7,
          "packTags": [
            "G22",
            "G42"
          ],
          "enemySummary": [
            "Tundra Stalker ×2",
            "Eldrin Swordsman ×2",
            "Icewyrm Sentinel ×2",
            "Eldrin Chronomancer"
          ],
          "kind": "pack",
          "notes": "Tundra Stalker ×2, Eldrin Swordsman ×2, Icewyrm Sentinel ×2"
        },
        {
          "index": 7,
          "label": "G24 + G13 + G31 · Blade of Cithrel ×3, Icewyrm Sentinel ×2",
          "x": 49,
          "y": 41.3,
          "killScore": 25,
          "killPercent": 13.3,
          "mobCount": 9,
          "packTags": [
            "G24",
            "G13",
            "G31"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Icewyrm Sentinel ×2",
            "Frozen Remnant ×2",
            "Elder Glacial Bear",
            "Coldbrine Fiend"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Icewyrm Sentinel ×2, Frozen Remnant ×2"
        },
        {
          "index": 8,
          "label": "G8 + G25 · Blade of Cithrel ×3, Eldrin Swordsman ×2",
          "x": 42.2,
          "y": 40.4,
          "killScore": 22,
          "killPercent": 11.7,
          "mobCount": 8,
          "packTags": [
            "G8",
            "G25"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Eldrin Swordsman ×2",
            "Icewyrm Sentinel ×2",
            "Al'zerac Corruptor"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Eldrin Swordsman ×2, Icewyrm Sentinel ×2"
        },
        {
          "index": 9,
          "label": "Noor, The Betrayer",
          "x": 31.3,
          "y": 34.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Noor, The Betrayer"
          ],
          "kind": "boss",
          "notes": "Noor, The Betrayer"
        },
        {
          "index": 10,
          "label": "G32 + G44 · Dire Wolf ×2, Blade of Cithrel ×2",
          "x": 48.9,
          "y": 32.9,
          "killScore": 18,
          "killPercent": 9.57,
          "mobCount": 6,
          "packTags": [
            "G32",
            "G44"
          ],
          "enemySummary": [
            "Dire Wolf ×2",
            "Blade of Cithrel ×2",
            "Elder Glacial Bear",
            "Icewyrm Sentinel"
          ],
          "kind": "pack",
          "notes": "Dire Wolf ×2, Blade of Cithrel ×2, Elder Glacial Bear"
        },
        {
          "index": 11,
          "label": "G37 + G11 · Al'zerac Corruptor ×2, Blade of Cithrel ×2",
          "x": 53.9,
          "y": 31.3,
          "killScore": 21,
          "killPercent": 11.17,
          "mobCount": 5,
          "packTags": [
            "G37",
            "G11"
          ],
          "enemySummary": [
            "Al'zerac Corruptor ×2",
            "Blade of Cithrel ×2",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Al'zerac Corruptor ×2, Blade of Cithrel ×2, Raging Ice Elemental"
        },
        {
          "index": 12,
          "label": "G15 · Icewyrm Sentinel ×2, Deceitful Scholar",
          "x": 56.7,
          "y": 19.2,
          "killScore": 11,
          "killPercent": 5.85,
          "mobCount": 3,
          "packTags": [
            "G15"
          ],
          "enemySummary": [
            "Icewyrm Sentinel ×2",
            "Deceitful Scholar"
          ],
          "kind": "pack",
          "notes": "Icewyrm Sentinel ×2, Deceitful Scholar"
        },
        {
          "index": 13,
          "label": "Cithrel",
          "x": 58.4,
          "y": 12.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Cithrel"
          ],
          "kind": "boss",
          "notes": "Cithrel"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.AdvbzuCcWZJRlJqjXqzglpiTo_CoYYpCsJGCe0Z-UZ6MIA_fJ-fmQ8tmqKm9mdgctsxIm8nbOXx5ydqzXDczksomfgr35HDtc8xLzkzNK1Hwzi_KL0408MvPL9JRCMlIVXBKLSlKrEwtSoJZwuF6AgA",
      "shareHash": "#r5=AdvbzuCcWZJRlJqjXqzglpiTo_CoYYpCsJGCe0Z-UZ6MIA_fJ-fmQ8tmqKm9mdgctsxIm8nbOXx5ydqzXDczksomfgr35HDtc8xLzkzNK1Hwzi_KL0408MvPL9JRCMlIVXBKLSlKrEwtSoJZwuF6AgA",
      "totalScore": 188,
      "requiredScore": 188,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G48 + G28 + G36 · Ice Shardling ×2, Icewyrm Sentinel ×2",
          "x": 45.6,
          "y": 79.2,
          "killScore": 21,
          "killPercent": 11.17,
          "mobCount": 7,
          "packTags": [
            "G48",
            "G28",
            "G36"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Icewyrm Sentinel ×2",
            "Elder Glacial Bear",
            "Raging Ice Elemental",
            "Blade of Cithrel"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Icewyrm Sentinel ×2, Elder Glacial Bear"
        },
        {
          "index": 2,
          "label": "G9 + G12 + G16 · Dire Wolf ×3, Frozen Remnant ×2",
          "x": 51.1,
          "y": 64.5,
          "killScore": 20,
          "killPercent": 10.64,
          "mobCount": 9,
          "packTags": [
            "G9",
            "G12",
            "G16"
          ],
          "enemySummary": [
            "Dire Wolf ×3",
            "Frozen Remnant ×2",
            "Raging Ice Elemental ×2",
            "Ice Shardling ×2"
          ],
          "kind": "pack",
          "notes": "Dire Wolf ×3, Frozen Remnant ×2, Raging Ice Elemental ×2"
        },
        {
          "index": 3,
          "label": "G47 + G14 · Ice Shardling ×2, Glacial Colossus",
          "x": 64.4,
          "y": 53.9,
          "killScore": 16,
          "killPercent": 8.51,
          "mobCount": 5,
          "packTags": [
            "G47",
            "G14"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Glacial Colossus",
            "Deceitful Scholar",
            "Blade of Cithrel"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Glacial Colossus, Deceitful Scholar"
        },
        {
          "index": 4,
          "label": "Ancient Koros",
          "x": 67.4,
          "y": 52.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Ancient Koros"
          ],
          "kind": "boss",
          "notes": "Ancient Koros"
        },
        {
          "index": 5,
          "label": "G18 · Ice Shardling ×2, Blade of Cithrel ×2",
          "x": 59.4,
          "y": 47.3,
          "killScore": 18,
          "killPercent": 9.57,
          "mobCount": 6,
          "packTags": [
            "G18"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Blade of Cithrel ×2",
            "Al'zerac Corruptor",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Blade of Cithrel ×2, Al'zerac Corruptor"
        },
        {
          "index": 6,
          "label": "G22 + G42 · Tundra Stalker ×2, Eldrin Swordsman ×2",
          "x": 55.9,
          "y": 45.4,
          "killScore": 16,
          "killPercent": 8.51,
          "mobCount": 7,
          "packTags": [
            "G22",
            "G42"
          ],
          "enemySummary": [
            "Tundra Stalker ×2",
            "Eldrin Swordsman ×2",
            "Icewyrm Sentinel ×2",
            "Eldrin Chronomancer"
          ],
          "kind": "pack",
          "notes": "Tundra Stalker ×2, Eldrin Swordsman ×2, Icewyrm Sentinel ×2"
        },
        {
          "index": 7,
          "label": "G24 + G13 + G31 · Blade of Cithrel ×3, Icewyrm Sentinel ×2",
          "x": 49,
          "y": 41.3,
          "killScore": 25,
          "killPercent": 13.3,
          "mobCount": 9,
          "packTags": [
            "G24",
            "G13",
            "G31"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Icewyrm Sentinel ×2",
            "Frozen Remnant ×2",
            "Elder Glacial Bear",
            "Coldbrine Fiend"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Icewyrm Sentinel ×2, Frozen Remnant ×2"
        },
        {
          "index": 8,
          "label": "G8 + G25 · Blade of Cithrel ×3, Eldrin Swordsman ×2",
          "x": 42.2,
          "y": 40.4,
          "killScore": 22,
          "killPercent": 11.7,
          "mobCount": 8,
          "packTags": [
            "G8",
            "G25"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Eldrin Swordsman ×2",
            "Icewyrm Sentinel ×2",
            "Al'zerac Corruptor"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Eldrin Swordsman ×2, Icewyrm Sentinel ×2"
        },
        {
          "index": 9,
          "label": "Noor, The Betrayer",
          "x": 31.3,
          "y": 34.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Noor, The Betrayer"
          ],
          "kind": "boss",
          "notes": "Noor, The Betrayer"
        },
        {
          "index": 10,
          "label": "G32 + G44 · Dire Wolf ×2, Blade of Cithrel ×2",
          "x": 48.9,
          "y": 32.9,
          "killScore": 18,
          "killPercent": 9.57,
          "mobCount": 6,
          "packTags": [
            "G32",
            "G44"
          ],
          "enemySummary": [
            "Dire Wolf ×2",
            "Blade of Cithrel ×2",
            "Elder Glacial Bear",
            "Icewyrm Sentinel"
          ],
          "kind": "pack",
          "notes": "Dire Wolf ×2, Blade of Cithrel ×2, Elder Glacial Bear"
        },
        {
          "index": 11,
          "label": "G37 + G11 · Al'zerac Corruptor ×2, Blade of Cithrel ×2",
          "x": 53.9,
          "y": 31.3,
          "killScore": 21,
          "killPercent": 11.17,
          "mobCount": 5,
          "packTags": [
            "G37",
            "G11"
          ],
          "enemySummary": [
            "Al'zerac Corruptor ×2",
            "Blade of Cithrel ×2",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Al'zerac Corruptor ×2, Blade of Cithrel ×2, Raging Ice Elemental"
        },
        {
          "index": 12,
          "label": "G15 · Icewyrm Sentinel ×2, Deceitful Scholar",
          "x": 56.7,
          "y": 19.2,
          "killScore": 11,
          "killPercent": 5.85,
          "mobCount": 3,
          "packTags": [
            "G15"
          ],
          "enemySummary": [
            "Icewyrm Sentinel ×2",
            "Deceitful Scholar"
          ],
          "kind": "pack",
          "notes": "Icewyrm Sentinel ×2, Deceitful Scholar"
        },
        {
          "index": 13,
          "label": "Cithrel",
          "x": 58.4,
          "y": 12.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Cithrel"
          ],
          "kind": "boss",
          "notes": "Cithrel"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.AdvbdsA5sySjKDVHvVjBLTEnR-FRwxSFYCMF18yiRDmlJynP5DKjJhlkLHyUdySMZVrber-3spXahYKH3kzk8Xs28VO4p5PSQQ6QYoWSjFSF8IzMklSF8MyS5AwFDW1Lg2IFp_z8PM3kBse85MzUvBIF7_yi_OJEA7_8_CIdhZCMVAWn1JKixMrUoiQGqDuclJ40AAA",
      "shareHash": "#r5=AdvbdsA5sySjKDVHvVjBLTEnR-FRwxSFYCMF18yiRDmlJynP5DKjJhlkLHyUdySMZVrber-3spXahYKH3kzk8Xs28VO4p5PSQQ6QYoWSjFSF8IzMklSF8MyS5AwFDW1Lg2IFp_z8PM3kBse85MzUvBIF7_yi_OJEA7_8_CIdhZCMVAWn1JKixMrUoiQGqDuclJ40AAA",
      "totalScore": 188,
      "requiredScore": 188,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 48.6,
          "y": 59.2,
          "killScore": 20,
          "killPercent": 10.64,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 2,
          "label": "G29 + G39 + G42 · Icewyrm Sentinel ×2, Blade of Cithrel",
          "x": 52.2,
          "y": 45.8,
          "killScore": 11,
          "killPercent": 5.85,
          "mobCount": 4,
          "packTags": [
            "G29",
            "G39",
            "G42"
          ],
          "enemySummary": [
            "Icewyrm Sentinel ×2",
            "Blade of Cithrel",
            "Tundra Stalker"
          ],
          "kind": "pack",
          "notes": "Icewyrm Sentinel ×2, Blade of Cithrel, Tundra Stalker"
        },
        {
          "index": 3,
          "label": "G22 · Tundra Stalker ×2, Eldrin Swordsman ×2",
          "x": 57,
          "y": 46,
          "killScore": 10,
          "killPercent": 5.32,
          "mobCount": 5,
          "packTags": [
            "G22"
          ],
          "enemySummary": [
            "Tundra Stalker ×2",
            "Eldrin Swordsman ×2",
            "Eldrin Chronomancer"
          ],
          "kind": "pack",
          "notes": "Tundra Stalker ×2, Eldrin Swordsman ×2, Eldrin Chronomancer"
        },
        {
          "index": 4,
          "label": "G18 · Ice Shardling ×2, Blade of Cithrel ×2",
          "x": 59.4,
          "y": 47.3,
          "killScore": 18,
          "killPercent": 9.57,
          "mobCount": 6,
          "packTags": [
            "G18"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Blade of Cithrel ×2",
            "Al'zerac Corruptor",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Blade of Cithrel ×2, Al'zerac Corruptor"
        },
        {
          "index": 5,
          "label": "G4 + G14 · Frozen Remnant ×2, Eldrin Swordsman ×2",
          "x": 63.5,
          "y": 53,
          "killScore": 14,
          "killPercent": 7.45,
          "mobCount": 8,
          "packTags": [
            "G4",
            "G14"
          ],
          "enemySummary": [
            "Frozen Remnant ×2",
            "Eldrin Swordsman ×2",
            "Ice Shardling ×2",
            "Deceitful Scholar",
            "Blade of Cithrel"
          ],
          "kind": "pack",
          "notes": "Frozen Remnant ×2, Eldrin Swordsman ×2, Ice Shardling ×2"
        },
        {
          "index": 6,
          "label": "Ancient Koros",
          "x": 67.4,
          "y": 52.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Ancient Koros"
          ],
          "kind": "boss",
          "notes": "Ancient Koros"
        },
        {
          "index": 7,
          "label": "G24 + G13 + G31 · Blade of Cithrel ×3, Icewyrm Sentinel ×2",
          "x": 49,
          "y": 41.3,
          "killScore": 25,
          "killPercent": 13.3,
          "mobCount": 9,
          "packTags": [
            "G24",
            "G13",
            "G31"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Icewyrm Sentinel ×2",
            "Frozen Remnant ×2",
            "Elder Glacial Bear",
            "Coldbrine Fiend"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Icewyrm Sentinel ×2, Frozen Remnant ×2"
        },
        {
          "index": 8,
          "label": "G8 + G25 · Blade of Cithrel ×3, Eldrin Swordsman ×2",
          "x": 42.2,
          "y": 40.4,
          "killScore": 22,
          "killPercent": 11.7,
          "mobCount": 8,
          "packTags": [
            "G8",
            "G25"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Eldrin Swordsman ×2",
            "Icewyrm Sentinel ×2",
            "Al'zerac Corruptor"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Eldrin Swordsman ×2, Icewyrm Sentinel ×2"
        },
        {
          "index": 9,
          "label": "G38 + G45 · Tundra Stalker ×2, Eldrin Swordsman ×2",
          "x": 35.9,
          "y": 36.8,
          "killScore": 9,
          "killPercent": 4.79,
          "mobCount": 5,
          "packTags": [
            "G38",
            "G45"
          ],
          "enemySummary": [
            "Tundra Stalker ×2",
            "Eldrin Swordsman ×2",
            "Icewyrm Sentinel"
          ],
          "kind": "pack",
          "notes": "Tundra Stalker ×2, Eldrin Swordsman ×2, Icewyrm Sentinel"
        },
        {
          "index": 10,
          "label": "Noor, The Betrayer",
          "x": 31.3,
          "y": 34.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Noor, The Betrayer"
          ],
          "kind": "boss",
          "notes": "Noor, The Betrayer"
        },
        {
          "index": 11,
          "label": "G20 + G32 + G44 · Blade of Cithrel ×3, Dire Wolf ×2",
          "x": 47.5,
          "y": 34.3,
          "killScore": 24,
          "killPercent": 12.77,
          "mobCount": 9,
          "packTags": [
            "G20",
            "G32",
            "G44"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Dire Wolf ×2",
            "Tundra Stalker",
            "Eldrin Swordsman",
            "Elder Glacial Bear",
            "Icewyrm Sentinel"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Dire Wolf ×2, Tundra Stalker"
        },
        {
          "index": 12,
          "label": "G37 + G11 + G35 · Blade of Cithrel ×3, Al'zerac Corruptor ×2",
          "x": 54.3,
          "y": 29.8,
          "killScore": 24,
          "killPercent": 12.77,
          "mobCount": 6,
          "packTags": [
            "G37",
            "G11",
            "G35"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Al'zerac Corruptor ×2",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Al'zerac Corruptor ×2, Raging Ice Elemental"
        },
        {
          "index": 13,
          "label": "G15 · Icewyrm Sentinel ×2, Deceitful Scholar",
          "x": 56.7,
          "y": 19.2,
          "killScore": 11,
          "killPercent": 5.85,
          "mobCount": 3,
          "packTags": [
            "G15"
          ],
          "enemySummary": [
            "Icewyrm Sentinel ×2",
            "Deceitful Scholar"
          ],
          "kind": "pack",
          "notes": "Icewyrm Sentinel ×2, Deceitful Scholar"
        },
        {
          "index": 14,
          "label": "Cithrel",
          "x": 58.4,
          "y": 12.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Cithrel"
          ],
          "kind": "boss",
          "notes": "Cithrel"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AdvbxOCcWZJRlJqjXqzglpiTo_CoYYpCsJGCa25BfnlqUWqKlCAP3yfn5kPLZqipvbnYNEmbyduJberOhdEqzsI7l9RMveSkdJzBMS85MzWvRME7vyi_ONHALz-_SEchJCNVwSm1pCixMrUoCWYNR_cMAA",
      "shareHash": "#r5=AdvbxOCcWZJRlJqjXqzglpiTo_CoYYpCsJGCa25BfnlqUWqKlCAP3yfn5kPLZqipvbnYNEmbyduJberOhdEqzsI7l9RMveSkdJzBMS85MzWvRME7vyi_ONHALz-_SEchJCNVwSm1pCixMrUoCWYNR_cMAA",
      "totalScore": 190,
      "requiredScore": 188,
      "totalPercent": 101.06,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G48 + G28 + G36 · Ice Shardling ×2, Icewyrm Sentinel ×2",
          "x": 45.6,
          "y": 79.2,
          "killScore": 21,
          "killPercent": 11.17,
          "mobCount": 7,
          "packTags": [
            "G48",
            "G28",
            "G36"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Icewyrm Sentinel ×2",
            "Elder Glacial Bear",
            "Raging Ice Elemental",
            "Blade of Cithrel"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Icewyrm Sentinel ×2, Elder Glacial Bear"
        },
        {
          "index": 2,
          "label": "G9 + G12 + G16 · Dire Wolf ×3, Frozen Remnant ×2",
          "x": 51.1,
          "y": 64.5,
          "killScore": 30,
          "killPercent": 15.96,
          "mobCount": 9,
          "packTags": [
            "G9",
            "G12",
            "G16"
          ],
          "enemySummary": [
            "Dire Wolf ×3",
            "Frozen Remnant ×2",
            "Raging Ice Elemental ×2",
            "Ice Shardling ×2"
          ],
          "kind": "pack",
          "notes": "Dire Wolf ×3, Frozen Remnant ×2, Raging Ice Elemental ×2"
        },
        {
          "index": 3,
          "label": "G47 + G14 · Ice Shardling ×2, Glacial Colossus",
          "x": 64.4,
          "y": 53.9,
          "killScore": 16,
          "killPercent": 8.51,
          "mobCount": 5,
          "packTags": [
            "G47",
            "G14"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Glacial Colossus",
            "Deceitful Scholar",
            "Blade of Cithrel"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Glacial Colossus, Deceitful Scholar"
        },
        {
          "index": 4,
          "label": "Ancient Koros",
          "x": 67.4,
          "y": 52.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Ancient Koros"
          ],
          "kind": "boss",
          "notes": "Ancient Koros"
        },
        {
          "index": 5,
          "label": "G18 + G42 · Ice Shardling ×2, Blade of Cithrel ×2",
          "x": 57.8,
          "y": 46.5,
          "killScore": 24,
          "killPercent": 12.77,
          "mobCount": 8,
          "packTags": [
            "G18",
            "G42"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Blade of Cithrel ×2",
            "Icewyrm Sentinel ×2",
            "Al'zerac Corruptor",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Blade of Cithrel ×2, Icewyrm Sentinel ×2"
        },
        {
          "index": 6,
          "label": "G24 + G13 + G31 · Blade of Cithrel ×3, Icewyrm Sentinel ×2",
          "x": 49,
          "y": 41.3,
          "killScore": 25,
          "killPercent": 13.3,
          "mobCount": 9,
          "packTags": [
            "G24",
            "G13",
            "G31"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Icewyrm Sentinel ×2",
            "Frozen Remnant ×2",
            "Elder Glacial Bear",
            "Coldbrine Fiend"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Icewyrm Sentinel ×2, Frozen Remnant ×2"
        },
        {
          "index": 7,
          "label": "G25 · Blade of Cithrel ×2, Al'zerac Corruptor",
          "x": 40.7,
          "y": 39.1,
          "killScore": 11,
          "killPercent": 5.85,
          "mobCount": 3,
          "packTags": [
            "G25"
          ],
          "enemySummary": [
            "Blade of Cithrel ×2",
            "Al'zerac Corruptor"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×2, Al'zerac Corruptor"
        },
        {
          "index": 8,
          "label": "Noor, The Betrayer",
          "x": 31.3,
          "y": 34.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Noor, The Betrayer"
          ],
          "kind": "boss",
          "notes": "Noor, The Betrayer"
        },
        {
          "index": 9,
          "label": "G32 + G44 · Dire Wolf ×2, Blade of Cithrel ×2",
          "x": 48.9,
          "y": 32.9,
          "killScore": 18,
          "killPercent": 9.57,
          "mobCount": 6,
          "packTags": [
            "G32",
            "G44"
          ],
          "enemySummary": [
            "Dire Wolf ×2",
            "Blade of Cithrel ×2",
            "Elder Glacial Bear",
            "Icewyrm Sentinel"
          ],
          "kind": "pack",
          "notes": "Dire Wolf ×2, Blade of Cithrel ×2, Elder Glacial Bear"
        },
        {
          "index": 10,
          "label": "G37 + G11 + G35 · Blade of Cithrel ×3, Al'zerac Corruptor ×2",
          "x": 54.3,
          "y": 29.8,
          "killScore": 24,
          "killPercent": 12.77,
          "mobCount": 6,
          "packTags": [
            "G37",
            "G11",
            "G35"
          ],
          "enemySummary": [
            "Blade of Cithrel ×3",
            "Al'zerac Corruptor ×2",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Blade of Cithrel ×3, Al'zerac Corruptor ×2, Raging Ice Elemental"
        },
        {
          "index": 11,
          "label": "G15 · Icewyrm Sentinel ×2, Deceitful Scholar",
          "x": 56.7,
          "y": 19.2,
          "killScore": 21,
          "killPercent": 11.17,
          "mobCount": 3,
          "packTags": [
            "G15"
          ],
          "enemySummary": [
            "Icewyrm Sentinel ×2",
            "Deceitful Scholar"
          ],
          "kind": "pack",
          "notes": "Icewyrm Sentinel ×2, Deceitful Scholar"
        },
        {
          "index": 12,
          "label": "Cithrel",
          "x": 58.4,
          "y": 12.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Cithrel"
          ],
          "kind": "boss",
          "notes": "Cithrel"
        }
      ]
    }
  },
  "ruins-of-regath": {
    "Regular": {
      "r5Code": "R5.AJNglFJ1aW5zIG9mIFJlZ2F0aCDigJQgUzIgU3RhbmRhcmQgUHVzaB4RWbRwIzi-6yKU3TiRnggdyZ3EV-zLhqUDMm7JXRoM7REOX1RFJxr0SPEjiQACw2BYdXJhdGgsIEZpc3Qgb2YgdGhlIFdhcmRlbgAC5AA",
      "shareHash": "#r5=AJNglFJ1aW5zIG9mIFJlZ2F0aCDigJQgUzIgU3RhbmRhcmQgUHVzaB4RWbRwIzi-6yKU3TiRnggdyZ3EV-zLhqUDMm7JXRoM7REOX1RFJxr0SPEjiQACw2BYdXJhdGgsIEZpc3Qgb2YgdGhlIFdhcmRlbgAC5AA",
      "totalScore": 153,
      "requiredScore": 152,
      "totalPercent": 100.66,
      "blood": 81,
      "pulls": [
        {
          "index": 1,
          "label": "G62 + G29 + G85 · Stalking Grim ×3, Rotheart Recluse ×2",
          "x": 28.5,
          "y": 81.6,
          "killScore": 25,
          "killPercent": 16.45,
          "mobCount": 8,
          "packTags": [
            "G62",
            "G29",
            "G85"
          ],
          "enemySummary": [
            "Stalking Grim ×3",
            "Rotheart Recluse ×2",
            "Crimson Zealot ×2",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×3, Rotheart Recluse ×2, Crimson Zealot ×2"
        },
        {
          "index": 2,
          "label": "G98 + G91 + G77 · Ravenous Brood ×2, Forgotten Champion",
          "x": 41.5,
          "y": 84.9,
          "killScore": 11,
          "killPercent": 7.24,
          "mobCount": 4,
          "packTags": [
            "G98",
            "G91",
            "G77"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Forgotten Champion",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Forgotten Champion, Gravesnare Kidnapper"
        },
        {
          "index": 3,
          "label": "G81 + G16 + G53 · Rotheart Recluse ×4",
          "x": 43.1,
          "y": 75.7,
          "killScore": 12,
          "killPercent": 7.89,
          "mobCount": 4,
          "packTags": [
            "G81",
            "G16",
            "G53"
          ],
          "enemySummary": [
            "Rotheart Recluse ×4"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×4"
        },
        {
          "index": 4,
          "label": "G32 + G49 + G67 · Sanguine Echo ×3, Restless Protector ×2",
          "x": 39.2,
          "y": 67.1,
          "killScore": 18,
          "killPercent": 11.84,
          "mobCount": 7,
          "packTags": [
            "G32",
            "G49",
            "G67"
          ],
          "enemySummary": [
            "Sanguine Echo ×3",
            "Restless Protector ×2",
            "Forgotten Champion",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×3, Restless Protector ×2, Forgotten Champion"
        },
        {
          "index": 5,
          "label": "G87 · Sanguine Echo",
          "x": 32.6,
          "y": 56,
          "killScore": 2,
          "killPercent": 1.32,
          "mobCount": 1,
          "packTags": [
            "G87"
          ],
          "enemySummary": [
            "Sanguine Echo"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo"
        },
        {
          "index": 6,
          "label": "G47 + G86 + G73 · Wild Bloom ×2, Gravesnare Kidnapper",
          "x": 44.8,
          "y": 66.2,
          "killScore": 11,
          "killPercent": 7.24,
          "mobCount": 4,
          "packTags": [
            "G47",
            "G86",
            "G73"
          ],
          "enemySummary": [
            "Wild Bloom ×2",
            "Gravesnare Kidnapper",
            "Barbarous Lasher (burried)"
          ],
          "kind": "pack",
          "notes": "Wild Bloom ×2, Gravesnare Kidnapper, Barbarous Lasher (burried)"
        },
        {
          "index": 7,
          "label": "G37 + G96 · Wild Bloom ×3, Rotheart Recluse ×2",
          "x": 42.6,
          "y": 59.1,
          "killScore": 13,
          "killPercent": 8.55,
          "mobCount": 6,
          "packTags": [
            "G37",
            "G96"
          ],
          "enemySummary": [
            "Wild Bloom ×3",
            "Rotheart Recluse ×2",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Wild Bloom ×3, Rotheart Recluse ×2, Gravesnare Kidnapper"
        },
        {
          "index": 8,
          "label": "G75 · Heart of Corruption",
          "x": 25.1,
          "y": 11.8,
          "killScore": 5,
          "killPercent": 3.29,
          "mobCount": 1,
          "packTags": [
            "G75"
          ],
          "enemySummary": [
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Heart of Corruption"
        },
        {
          "index": 9,
          "label": "G105 · Rotheart Recluse ×2",
          "x": 44.5,
          "y": 56,
          "killScore": 6,
          "killPercent": 3.95,
          "mobCount": 2,
          "packTags": [
            "G105"
          ],
          "enemySummary": [
            "Rotheart Recluse ×2"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×2"
        },
        {
          "index": 10,
          "label": "G19 + G107 · Sanguine Echo ×2",
          "x": 27.3,
          "y": 18.1,
          "killScore": 4,
          "killPercent": 2.63,
          "mobCount": 2,
          "packTags": [
            "G19",
            "G107"
          ],
          "enemySummary": [
            "Sanguine Echo ×2"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×2"
        },
        {
          "index": 11,
          "label": "G66 + G102 + G59 · Stalking Grim ×2, Rotheart Recluse ×2",
          "x": 50.8,
          "y": 62.4,
          "killScore": 23,
          "killPercent": 15.13,
          "mobCount": 8,
          "packTags": [
            "G66",
            "G102",
            "G59"
          ],
          "enemySummary": [
            "Stalking Grim ×2",
            "Rotheart Recluse ×2",
            "Ravenous Brood ×2",
            "Gravesnare Kidnapper",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×2, Rotheart Recluse ×2, Ravenous Brood ×2"
        },
        {
          "index": 12,
          "label": "G5 + G114 + G109 · Ravenous Brood ×4, Sanguine Echo ×2",
          "x": 49,
          "y": 49.5,
          "killScore": 17,
          "killPercent": 11.18,
          "mobCount": 7,
          "packTags": [
            "G5",
            "G114",
            "G109"
          ],
          "enemySummary": [
            "Ravenous Brood ×4",
            "Sanguine Echo ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×4, Sanguine Echo ×2, Sanguine Oracle"
        },
        {
          "index": 13,
          "label": "G41 · Stalking Grim, Forgotten Champion",
          "x": 55.5,
          "y": 49.5,
          "killScore": 6,
          "killPercent": 3.95,
          "mobCount": 2,
          "packTags": [
            "G41"
          ],
          "enemySummary": [
            "Stalking Grim",
            "Forgotten Champion"
          ],
          "kind": "pack",
          "notes": "Stalking Grim, Forgotten Champion"
        },
        {
          "index": 14,
          "label": "Xurath, Fist of the Warden",
          "x": 73.9,
          "y": 55.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Xurath, Fist of the Warden"
          ],
          "kind": "boss",
          "notes": "Xurath, Fist of the Warden"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.AZuceCGoNDOvWCE_TSEoNT2xJEPhUcMUhWAjBfeM_KI8KdUqZYvp3yZ_F5wy5ZfiiaUuekfyIiSP-Fa8mLgo72SNxyNHpoMMYJUKJRmpCo5liTmJeckZqQoa2kYGxQpO-fl5mokbIkqLEksydBTcMotLQBaBlIYnFqWk5rFwTwEA",
      "shareHash": "#r5=AZuceCGoNDOvWCE_TSEoNT2xJEPhUcMUhWAjBfeM_KI8KdUqZYvp3yZ_F5wy5ZfiiaUuekfyIiSP-Fa8mLgo72SNxyNHpoMMYJUKJRmpCo5liTmJeckZqQoa2kYGxQpO-fl5mokbIkqLEksydBTcMotLQBaBlIYnFqWk5rFwTwEA",
      "totalScore": 152,
      "requiredScore": 152,
      "totalPercent": 100,
      "blood": 77,
      "pulls": [
        {
          "index": 1,
          "label": "G29 · Crimson Zealot ×2, Ascended Bloodweaver",
          "x": 31.2,
          "y": 87.3,
          "killScore": 10,
          "killPercent": 6.58,
          "mobCount": 3,
          "packTags": [
            "G29"
          ],
          "enemySummary": [
            "Crimson Zealot ×2",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×2, Ascended Bloodweaver"
        },
        {
          "index": 2,
          "label": "G98 + G56 + G28 · Ravenous Brood ×2, Restless Protector ×2",
          "x": 41.1,
          "y": 87.4,
          "killScore": 11,
          "killPercent": 7.24,
          "mobCount": 5,
          "packTags": [
            "G98",
            "G56",
            "G28"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Restless Protector ×2",
            "Forgotten Champion"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Restless Protector ×2, Forgotten Champion"
        },
        {
          "index": 3,
          "label": "G49 · Sanguine Echo ×2, Heart of Corruption",
          "x": 36.6,
          "y": 66.8,
          "killScore": 9,
          "killPercent": 5.92,
          "mobCount": 3,
          "packTags": [
            "G49"
          ],
          "enemySummary": [
            "Sanguine Echo ×2",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×2, Heart of Corruption"
        },
        {
          "index": 4,
          "label": "G91 + G18 + G112 · Forgotten Champion ×2, Forlorn Acolyte ×2",
          "x": 43.5,
          "y": 88.3,
          "killScore": 13,
          "killPercent": 8.55,
          "mobCount": 5,
          "packTags": [
            "G91",
            "G18",
            "G112"
          ],
          "enemySummary": [
            "Forgotten Champion ×2",
            "Forlorn Acolyte ×2",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Forgotten Champion ×2, Forlorn Acolyte ×2, Crimson Zealot"
        },
        {
          "index": 5,
          "label": "Ghorn the Avalanche (+20s Boon)",
          "x": 48.6,
          "y": 89,
          "killScore": 20,
          "killPercent": 13.16,
          "mobCount": 1,
          "packTags": [
            "Ghorn"
          ],
          "enemySummary": [
            "Ghorn"
          ],
          "kind": "miniboss",
          "notes": "Ghorn"
        },
        {
          "index": 6,
          "label": "G24 + G81 + G100 · Forgotten Champion ×3, Rotheart Recluse ×2",
          "x": 47.5,
          "y": 78.2,
          "killScore": 24,
          "killPercent": 15.79,
          "mobCount": 8,
          "packTags": [
            "G24",
            "G81",
            "G100"
          ],
          "enemySummary": [
            "Forgotten Champion ×3",
            "Rotheart Recluse ×2",
            "Forlorn Acolyte",
            "Crimson Zealot",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Forgotten Champion ×3, Rotheart Recluse ×2, Forlorn Acolyte"
        },
        {
          "index": 7,
          "label": "G44 + G102 + G79 · Restless Protector ×2, Rotheart Recluse ×2",
          "x": 51.3,
          "y": 71.3,
          "killScore": 18,
          "killPercent": 11.84,
          "mobCount": 7,
          "packTags": [
            "G44",
            "G102",
            "G79"
          ],
          "enemySummary": [
            "Restless Protector ×2",
            "Rotheart Recluse ×2",
            "Forlorn Acolyte ×2",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Restless Protector ×2, Rotheart Recluse ×2, Forlorn Acolyte ×2"
        },
        {
          "index": 8,
          "label": "G113 + G80 + G5 · Ravenous Brood ×4, Forgotten Champion ×2",
          "x": 50.8,
          "y": 55.2,
          "killScore": 21,
          "killPercent": 13.82,
          "mobCount": 9,
          "packTags": [
            "G113",
            "G80",
            "G5"
          ],
          "enemySummary": [
            "Ravenous Brood ×4",
            "Forgotten Champion ×2",
            "Wild Bloom ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×4, Forgotten Champion ×2, Wild Bloom ×2"
        },
        {
          "index": 9,
          "label": "G27 · Ravenous Brood ×3, Sanguine Oracle",
          "x": 31.5,
          "y": 30.5,
          "killScore": 11,
          "killPercent": 7.24,
          "mobCount": 4,
          "packTags": [
            "G27"
          ],
          "enemySummary": [
            "Ravenous Brood ×3",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×3, Sanguine Oracle"
        },
        {
          "index": 10,
          "label": "G75 · Heart of Corruption",
          "x": 25.1,
          "y": 11.8,
          "killScore": 5,
          "killPercent": 3.29,
          "mobCount": 1,
          "packTags": [
            "G75"
          ],
          "enemySummary": [
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Heart of Corruption"
        },
        {
          "index": 11,
          "label": "G9 · Ravenous Brood ×2, Stalking Grim ×2",
          "x": 53.5,
          "y": 58,
          "killScore": 10,
          "killPercent": 6.58,
          "mobCount": 4,
          "packTags": [
            "G9"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Stalking Grim ×2"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Stalking Grim ×2"
        },
        {
          "index": 12,
          "label": "Xurath, Fist of the Warden",
          "x": 73.9,
          "y": 55.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Xurath, Fist of the Warden"
          ],
          "kind": "boss",
          "notes": "Xurath, Fist of the Warden"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.AZuceCCoNDOvWCE_TSEoNT2xJEPhUcMUhWAjBdfMokQxwW97pxTZX5neKRv0eKHShHubt0jPcD2xXPh0p7jS5EkSM-4uKVRwbRIAqVUoyUhVCM_ILElVCM8sSc5Q0NC2NChWcMrPz9NM3BBRWpRYkqGj4JZZXAKyC6w4sSglNY9JzwMA",
      "shareHash": "#r5=AZuceCCoNDOvWCE_TSEoNT2xJEPhUcMUhWAjBdfMokQxwW97pxTZX5neKRv0eKHShHubt0jPcD2xXPh0p7jS5EkSM-4uKVRwbRIAqVUoyUhVCM_ILElVCM8sSc5Q0NC2NChWcMrPz9NM3BBRWpRYkqGj4JZZXAKyC6w4sSglNY9JzwMA",
      "totalScore": 152,
      "requiredScore": 152,
      "totalPercent": 100,
      "blood": 80,
      "pulls": [
        {
          "index": 1,
          "label": "G29 + G74 + G31 · Ravenous Brood ×3, Crimson Zealot ×2",
          "x": 29.3,
          "y": 85,
          "killScore": 20,
          "killPercent": 13.16,
          "mobCount": 7,
          "packTags": [
            "G29",
            "G74",
            "G31"
          ],
          "enemySummary": [
            "Ravenous Brood ×3",
            "Crimson Zealot ×2",
            "Ascended Bloodweaver",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×3, Crimson Zealot ×2, Ascended Bloodweaver"
        },
        {
          "index": 2,
          "label": "G33 + G34 + G8 · Ravenous Brood ×3, Crimson Zealot",
          "x": 27.7,
          "y": 70.7,
          "killScore": 16,
          "killPercent": 10.53,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G34",
            "G8"
          ],
          "enemySummary": [
            "Ravenous Brood ×3",
            "Crimson Zealot",
            "Forlorn Acolyte",
            "Forgotten Champion",
            "Restless Protector"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×3, Crimson Zealot, Forlorn Acolyte"
        },
        {
          "index": 3,
          "label": "G6 + G49 + G23 · Sanguine Echo ×2, Stalking Grim ×2",
          "x": 32.1,
          "y": 64.8,
          "killScore": 22,
          "killPercent": 14.47,
          "mobCount": 8,
          "packTags": [
            "G6",
            "G49",
            "G23"
          ],
          "enemySummary": [
            "Sanguine Echo ×2",
            "Stalking Grim ×2",
            "Ravenous Brood",
            "Restless Protector",
            "Heart of Corruption",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×2, Stalking Grim ×2, Ravenous Brood"
        },
        {
          "index": 4,
          "label": "G45 + G3 + G46 · Ravenous Brood ×5, Crimson Zealot",
          "x": 29.5,
          "y": 49.9,
          "killScore": 19,
          "killPercent": 12.5,
          "mobCount": 8,
          "packTags": [
            "G45",
            "G3",
            "G46"
          ],
          "enemySummary": [
            "Ravenous Brood ×5",
            "Crimson Zealot",
            "Forgotten Champion",
            "Stalking Grim"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×5, Crimson Zealot, Forgotten Champion"
        },
        {
          "index": 5,
          "label": "G7 + G30 · Wild Bloom ×2, Ravenous Brood ×2",
          "x": 31.6,
          "y": 35.4,
          "killScore": 9,
          "killPercent": 5.92,
          "mobCount": 5,
          "packTags": [
            "G7",
            "G30"
          ],
          "enemySummary": [
            "Wild Bloom ×2",
            "Ravenous Brood ×2",
            "Water Surger"
          ],
          "kind": "pack",
          "notes": "Wild Bloom ×2, Ravenous Brood ×2, Water Surger"
        },
        {
          "index": 6,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 31.4,
          "y": 30.2,
          "killScore": 20,
          "killPercent": 13.16,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 7,
          "label": "G65 + G61 + G95 · Ravenous Brood ×4, Crimson Zealot",
          "x": 35.8,
          "y": 34.7,
          "killScore": 16,
          "killPercent": 10.53,
          "mobCount": 7,
          "packTags": [
            "G65",
            "G61",
            "G95"
          ],
          "enemySummary": [
            "Ravenous Brood ×4",
            "Crimson Zealot",
            "Restless Protector",
            "Stalking Grim"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×4, Crimson Zealot, Restless Protector"
        },
        {
          "index": 8,
          "label": "G58 + G71 + G5 · Ravenous Brood ×6, Crimson Zealot",
          "x": 45.2,
          "y": 46.8,
          "killScore": 20,
          "killPercent": 13.16,
          "mobCount": 8,
          "packTags": [
            "G58",
            "G71",
            "G5"
          ],
          "enemySummary": [
            "Ravenous Brood ×6",
            "Crimson Zealot",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×6, Crimson Zealot, Sanguine Oracle"
        },
        {
          "index": 9,
          "label": "G109 + G114 + G41 · Sanguine Echo ×2, Stalking Grim",
          "x": 53.8,
          "y": 49.5,
          "killScore": 10,
          "killPercent": 6.58,
          "mobCount": 4,
          "packTags": [
            "G109",
            "G114",
            "G41"
          ],
          "enemySummary": [
            "Sanguine Echo ×2",
            "Stalking Grim",
            "Forgotten Champion"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×2, Stalking Grim, Forgotten Champion"
        },
        {
          "index": 10,
          "label": "Xurath, Fist of the Warden",
          "x": 73.9,
          "y": 55.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Xurath, Fist of the Warden"
          ],
          "kind": "boss",
          "notes": "Xurath, Fist of the Warden"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AJNghFJ1aW5zIG9mIFJlZ2F0aCDigJQgUzIgRW1wb3dlcmVkHCVmIziUugjeEd3IzwQO5M7m-V-OORkUz2Ihk9pv-ZaZvNWTdI4kABYbWHVyYXRoLCBGaXN0IG9mIHRoZSBXYXJkZW4ABcw",
      "shareHash": "#r5=AJNghFJ1aW5zIG9mIFJlZ2F0aCDigJQgUzIgRW1wb3dlcmVkHCVmIziUugjeEd3IzwQO5M7m-V-OORkUz2Ihk9pv-ZaZvNWTdI4kABYbWHVyYXRoLCBGaXN0IG9mIHRoZSBXYXJkZW4ABcw",
      "totalScore": 152,
      "requiredScore": 152,
      "totalPercent": 100,
      "blood": 67,
      "pulls": [
        {
          "index": 1,
          "label": "G62 · Rotheart Recluse ×2, Stalking Grim",
          "x": 24.8,
          "y": 81.8,
          "killScore": 15,
          "killPercent": 9.87,
          "mobCount": 3,
          "packTags": [
            "G62"
          ],
          "enemySummary": [
            "Rotheart Recluse ×2",
            "Stalking Grim"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×2, Stalking Grim"
        },
        {
          "index": 2,
          "label": "G98 + G28 + G91 · Ravenous Brood ×2, Restless Protector ×2",
          "x": 41.4,
          "y": 87.4,
          "killScore": 11,
          "killPercent": 7.24,
          "mobCount": 5,
          "packTags": [
            "G98",
            "G28",
            "G91"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Restless Protector ×2",
            "Forgotten Champion"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Restless Protector ×2, Forgotten Champion"
        },
        {
          "index": 3,
          "label": "G77 + G81 + G53 · Rotheart Recluse ×3, Gravesnare Kidnapper",
          "x": 43.8,
          "y": 76.8,
          "killScore": 21,
          "killPercent": 13.82,
          "mobCount": 4,
          "packTags": [
            "G77",
            "G81",
            "G53"
          ],
          "enemySummary": [
            "Rotheart Recluse ×3",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×3, Gravesnare Kidnapper"
        },
        {
          "index": 4,
          "label": "G32 + G49 + G67 · Sanguine Echo ×3, Restless Protector ×2",
          "x": 39.2,
          "y": 67.1,
          "killScore": 18,
          "killPercent": 11.84,
          "mobCount": 7,
          "packTags": [
            "G32",
            "G49",
            "G67"
          ],
          "enemySummary": [
            "Sanguine Echo ×3",
            "Restless Protector ×2",
            "Forgotten Champion",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×3, Restless Protector ×2, Forgotten Champion"
        },
        {
          "index": 5,
          "label": "G87 · Sanguine Echo",
          "x": 32.6,
          "y": 56,
          "killScore": 2,
          "killPercent": 1.32,
          "mobCount": 1,
          "packTags": [
            "G87"
          ],
          "enemySummary": [
            "Sanguine Echo"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo"
        },
        {
          "index": 6,
          "label": "G86 + G96 · Wild Bloom ×3, Barbarous Lasher (burried)",
          "x": 46.2,
          "y": 62.4,
          "killScore": 8,
          "killPercent": 5.26,
          "mobCount": 4,
          "packTags": [
            "G86",
            "G96"
          ],
          "enemySummary": [
            "Wild Bloom ×3",
            "Barbarous Lasher (burried)"
          ],
          "kind": "pack",
          "notes": "Wild Bloom ×3, Barbarous Lasher (burried)"
        },
        {
          "index": 7,
          "label": "G107 + G75 · Sanguine Echo, Heart of Corruption",
          "x": 25.9,
          "y": 15.3,
          "killScore": 11,
          "killPercent": 7.24,
          "mobCount": 2,
          "packTags": [
            "G107",
            "G75"
          ],
          "enemySummary": [
            "Sanguine Echo",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo, Heart of Corruption"
        },
        {
          "index": 8,
          "label": "G97 · Witch of the Tides, Water Surger",
          "x": 24.1,
          "y": 38.8,
          "killScore": 15,
          "killPercent": 9.87,
          "mobCount": 2,
          "packTags": [
            "G97"
          ],
          "enemySummary": [
            "Witch of the Tides",
            "Water Surger"
          ],
          "kind": "pack",
          "notes": "Witch of the Tides, Water Surger"
        },
        {
          "index": 9,
          "label": "G105 + G66 + G59 · Rotheart Recluse ×2, Stalking Grim ×2",
          "x": 48.7,
          "y": 57.6,
          "killScore": 19,
          "killPercent": 12.5,
          "mobCount": 7,
          "packTags": [
            "G105",
            "G66",
            "G59"
          ],
          "enemySummary": [
            "Rotheart Recluse ×2",
            "Stalking Grim ×2",
            "Ravenous Brood ×2",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×2, Stalking Grim ×2, Ravenous Brood ×2"
        },
        {
          "index": 10,
          "label": "G5 + G114 · Ravenous Brood ×4, Sanguine Oracle",
          "x": 48.5,
          "y": 49.7,
          "killScore": 15,
          "killPercent": 9.87,
          "mobCount": 6,
          "packTags": [
            "G5",
            "G114"
          ],
          "enemySummary": [
            "Ravenous Brood ×4",
            "Sanguine Oracle",
            "Sanguine Echo"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×4, Sanguine Oracle, Sanguine Echo"
        },
        {
          "index": 11,
          "label": "G92 · Water Surger",
          "x": 41.2,
          "y": 29.6,
          "killScore": 9,
          "killPercent": 5.92,
          "mobCount": 1,
          "packTags": [
            "G92"
          ],
          "enemySummary": [
            "Water Surger"
          ],
          "kind": "pack",
          "notes": "Water Surger"
        },
        {
          "index": 12,
          "label": "G109 + G41 · Sanguine Echo, Stalking Grim",
          "x": 54.3,
          "y": 49.2,
          "killScore": 8,
          "killPercent": 5.26,
          "mobCount": 3,
          "packTags": [
            "G109",
            "G41"
          ],
          "enemySummary": [
            "Sanguine Echo",
            "Stalking Grim",
            "Forgotten Champion"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo, Stalking Grim, Forgotten Champion"
        },
        {
          "index": 13,
          "label": "Xurath, Fist of the Warden",
          "x": 73.9,
          "y": 55.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Xurath, Fist of the Warden"
          ],
          "kind": "boss",
          "notes": "Xurath, Fist of the Warden"
        }
      ]
    }
  },
  "stormwatch": {
    "Regular": {
      "r5Code": "R5.AZue0BBckl-UW55Ykpyh8KhhikKwkUJwSWJeSmJRikJAaXGGmOCeVDfBWNF_Sn96jrkelP6kGDlncpGigV6RdkjsRM5JWVN3OXRzN4QnFuXkF6UoOBXlp6craDgVZaakp2omJqCJu2XmJeZoMuk5AAA",
      "shareHash": "#r5=AZue0BBckl-UW55Ykpyh8KhhikKwkUJwSWJeSmJRikJAaXGGmOCeVDfBWNF_Sn96jrkelP6kGDlncpGigV6RdkjsRM5JWVN3OXRzN4QnFuXkF6UoOBXlp6craDgVZaakp2omJqCJu2XmJeZoMuk5AAA",
      "totalScore": 156,
      "requiredScore": 155,
      "totalPercent": 100.65,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G43 + G6 + G33 · Skulking Cutthroat ×2, Bloodfang Panther ×2",
          "x": 54,
          "y": 82.4,
          "killScore": 17,
          "killPercent": 10.97,
          "mobCount": 6,
          "packTags": [
            "G43",
            "G6",
            "G33"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Bloodfang Panther ×2",
            "Mounted Raider",
            "Hoofed Outrunner"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Bloodfang Panther ×2, Mounted Raider"
        },
        {
          "index": 2,
          "label": "G15 + G39 + G7 · Mancatcher ×2, Bloodfang Panther ×2",
          "x": 51.7,
          "y": 73,
          "killScore": 22,
          "killPercent": 14.19,
          "mobCount": 8,
          "packTags": [
            "G15",
            "G39",
            "G7"
          ],
          "enemySummary": [
            "Mancatcher ×2",
            "Bloodfang Panther ×2",
            "Hoofed Outrunner ×2",
            "Cruel Slaver",
            "Gorestained Butcher"
          ],
          "kind": "pack",
          "notes": "Mancatcher ×2, Bloodfang Panther ×2, Hoofed Outrunner ×2"
        },
        {
          "index": 3,
          "label": "G11 + G25 + G5 · Ritual Devotee ×2, Hoofed Outrunner ×2",
          "x": 48.6,
          "y": 72.6,
          "killScore": 17,
          "killPercent": 10.97,
          "mobCount": 8,
          "packTags": [
            "G11",
            "G25",
            "G5"
          ],
          "enemySummary": [
            "Ritual Devotee ×2",
            "Hoofed Outrunner ×2",
            "Cruel Slaver",
            "Bloodrite Chanter",
            "Sanguine Echo",
            "Savage Hunter"
          ],
          "kind": "pack",
          "notes": "Ritual Devotee ×2, Hoofed Outrunner ×2, Cruel Slaver"
        },
        {
          "index": 4,
          "label": "G42 + G16 + G13 · Raging Razorback ×2, Mancatcher ×2",
          "x": 50.9,
          "y": 57.1,
          "killScore": 18,
          "killPercent": 11.61,
          "mobCount": 8,
          "packTags": [
            "G42",
            "G16",
            "G13"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Mancatcher ×2",
            "Raging Pillager ×2",
            "Savage Hunter ×2"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Mancatcher ×2, Raging Pillager ×2"
        },
        {
          "index": 5,
          "label": "G3 + G20 + G10 · Ritual Devotee ×2, Skulking Cutthroat ×2",
          "x": 51.9,
          "y": 50.2,
          "killScore": 22,
          "killPercent": 14.19,
          "mobCount": 8,
          "packTags": [
            "G3",
            "G20",
            "G10"
          ],
          "enemySummary": [
            "Ritual Devotee ×2",
            "Skulking Cutthroat ×2",
            "Diabolical Hellcaller",
            "Hellspawned Bulgore",
            "Profane Defiler",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Ritual Devotee ×2, Skulking Cutthroat ×2, Diabolical Hellcaller"
        },
        {
          "index": 6,
          "label": "Warlord Brogg (Bridge)",
          "x": 49.8,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Warlord Brogg (Bridge)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Bridge)"
        },
        {
          "index": 7,
          "label": "G23 + G32 + G19 · Mounted Raider ×2, Raging Pillager ×2",
          "x": 46.2,
          "y": 33.6,
          "killScore": 20,
          "killPercent": 12.9,
          "mobCount": 6,
          "packTags": [
            "G23",
            "G32",
            "G19"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Raging Pillager ×2",
            "Gorestained Butcher",
            "Vile Executioner"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Raging Pillager ×2, Gorestained Butcher"
        },
        {
          "index": 8,
          "label": "G12 + G14 + G38 · Mounted Raider ×2, Profane Defiler ×2",
          "x": 41.6,
          "y": 34.4,
          "killScore": 22,
          "killPercent": 14.19,
          "mobCount": 7,
          "packTags": [
            "G12",
            "G14",
            "G38"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Profane Defiler ×2",
            "Bloodfang Panther ×2",
            "Hellspawned Bulgore"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Profane Defiler ×2, Bloodfang Panther ×2"
        },
        {
          "index": 9,
          "label": "G4 + G45 + G18 · Skulking Cutthroat ×4, Bloodfang Panther ×2",
          "x": 41.7,
          "y": 21.1,
          "killScore": 18,
          "killPercent": 11.61,
          "mobCount": 6,
          "packTags": [
            "G4",
            "G45",
            "G18"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×4",
            "Bloodfang Panther ×2"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×4, Bloodfang Panther ×2"
        },
        {
          "index": 10,
          "label": "Warlord Brogg (Final)",
          "x": 45.9,
          "y": 14.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G50"
          ],
          "enemySummary": [
            "Warlord Brogg (Final)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Final)"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.AZue2BBckl-UW55Ykpyh8KhhikKwkYJ7Rn5RnpTgntIFrnVLffU7ipTePem99Z_NKWf2RM7G4oncQb8Vei9t93CJgChVKMlIVXAsS8xJzEvOSFXQ0DYyKFZwys_P00wsCE8syskvSlFwKspPT1fQcCrKTElP1UxMQBN3y8xLzNHk6J4CAA",
      "shareHash": "#r5=AZue2BBckl-UW55Ykpyh8KhhikKwkYJ7Rn5RnpTgntIFrnVLffU7ipTePem99Z_NKWf2RM7G4oncQb8Vei9t93CJgChVKMlIVXAsS8xJzEvOSFXQ0DYyKFZwys_P00wsCE8syskvSlFwKspPT1fQcCrKTElP1UxMQBN3y8xLzNHk6J4CAA",
      "totalScore": 155,
      "requiredScore": 155,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G43 + G21 + G6 · Skulking Cutthroat ×2, Raging Razorback",
          "x": 53.2,
          "y": 86,
          "killScore": 11,
          "killPercent": 7.1,
          "mobCount": 4,
          "packTags": [
            "G43",
            "G21",
            "G6"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Raging Razorback",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Raging Razorback, Mounted Raider"
        },
        {
          "index": 2,
          "label": "G33 + G15 + G2 · Bloodfang Panther ×2, Mancatcher ×2",
          "x": 53,
          "y": 77.9,
          "killScore": 18,
          "killPercent": 11.61,
          "mobCount": 7,
          "packTags": [
            "G33",
            "G15",
            "G2"
          ],
          "enemySummary": [
            "Bloodfang Panther ×2",
            "Mancatcher ×2",
            "Hoofed Outrunner",
            "Cruel Slaver",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Bloodfang Panther ×2, Mancatcher ×2, Hoofed Outrunner"
        },
        {
          "index": 3,
          "label": "G39 · Bloodfang Panther ×2",
          "x": 53,
          "y": 71.8,
          "killScore": 6,
          "killPercent": 3.87,
          "mobCount": 2,
          "packTags": [
            "G39"
          ],
          "enemySummary": [
            "Bloodfang Panther ×2"
          ],
          "kind": "pack",
          "notes": "Bloodfang Panther ×2"
        },
        {
          "index": 4,
          "label": "Ghorn the Avalanche (+20s Boon)",
          "x": 51.2,
          "y": 68.5,
          "killScore": 20,
          "killPercent": 12.9,
          "mobCount": 1,
          "packTags": [
            "Ghorn"
          ],
          "enemySummary": [
            "Ghorn"
          ],
          "kind": "miniboss",
          "notes": "Ghorn"
        },
        {
          "index": 5,
          "label": "G11 + G42 + G46 · Raging Razorback ×2, Cruel Slaver",
          "x": 49.5,
          "y": 62.2,
          "killScore": 9,
          "killPercent": 5.81,
          "mobCount": 4,
          "packTags": [
            "G11",
            "G42",
            "G46"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Cruel Slaver",
            "Raging Pillager"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Cruel Slaver, Raging Pillager"
        },
        {
          "index": 6,
          "label": "G16 + G13 + G3 · Mancatcher ×2, Raging Pillager ×2",
          "x": 50.7,
          "y": 55.8,
          "killScore": 18,
          "killPercent": 11.61,
          "mobCount": 7,
          "packTags": [
            "G16",
            "G13",
            "G3"
          ],
          "enemySummary": [
            "Mancatcher ×2",
            "Raging Pillager ×2",
            "Savage Hunter ×2",
            "Diabolical Hellcaller"
          ],
          "kind": "pack",
          "notes": "Mancatcher ×2, Raging Pillager ×2, Savage Hunter ×2"
        },
        {
          "index": 7,
          "label": "G20 + G10 · Ritual Devotee ×2, Skulking Cutthroat ×2",
          "x": 52.3,
          "y": 49.8,
          "killScore": 18,
          "killPercent": 11.61,
          "mobCount": 7,
          "packTags": [
            "G20",
            "G10"
          ],
          "enemySummary": [
            "Ritual Devotee ×2",
            "Skulking Cutthroat ×2",
            "Hellspawned Bulgore",
            "Profane Defiler",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Ritual Devotee ×2, Skulking Cutthroat ×2, Hellspawned Bulgore"
        },
        {
          "index": 8,
          "label": "Warlord Brogg (Bridge)",
          "x": 49.8,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Warlord Brogg (Bridge)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Bridge)"
        },
        {
          "index": 9,
          "label": "G23 + G32 + G19 · Mounted Raider ×2, Raging Pillager ×2",
          "x": 46.2,
          "y": 33.6,
          "killScore": 20,
          "killPercent": 12.9,
          "mobCount": 6,
          "packTags": [
            "G23",
            "G32",
            "G19"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Raging Pillager ×2",
            "Gorestained Butcher",
            "Vile Executioner"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Raging Pillager ×2, Gorestained Butcher"
        },
        {
          "index": 10,
          "label": "G12 + G14 + G4 · Mounted Raider ×2, Profane Defiler ×2",
          "x": 42.9,
          "y": 32.6,
          "killScore": 19,
          "killPercent": 12.26,
          "mobCount": 6,
          "packTags": [
            "G12",
            "G14",
            "G4"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Profane Defiler ×2",
            "Hellspawned Bulgore",
            "Bloodfang Panther"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Profane Defiler ×2, Hellspawned Bulgore"
        },
        {
          "index": 11,
          "label": "G34 + G45 · Hoofed Outrunner ×2, Skulking Cutthroat ×2",
          "x": 41.5,
          "y": 24.1,
          "killScore": 16,
          "killPercent": 10.32,
          "mobCount": 6,
          "packTags": [
            "G34",
            "G45"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×2",
            "Skulking Cutthroat ×2",
            "Cruel Slaver",
            "Bloodfang Panther"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×2, Skulking Cutthroat ×2, Cruel Slaver"
        },
        {
          "index": 12,
          "label": "Warlord Brogg (Final)",
          "x": 45.9,
          "y": 14.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G50"
          ],
          "enemySummary": [
            "Warlord Brogg (Final)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Final)"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.AZueWBBckl-UW55Ykpyh8KhhikKwkYJrZlGilOCeVDeBo4d3K60tf2XnemLNaRuVlNkTORuLJ3IH_VbovbTdQyVCEaRSoSQjVSE8I7MkVSE8E2SKhralQbGCU35-nmZiQXhiUU5-UYqCU1F-erqChlNRZkp6qmZiApq4W2ZeYo4mS_ckAA",
      "shareHash": "#r5=AZueWBBckl-UW55Ykpyh8KhhikKwkYJrZlGilOCeVDeBo4d3K60tf2XnemLNaRuVlNkTORuLJ3IH_VbovbTdQyVCEaRSoSQjVSE8I7MkVSE8E2SKhralQbGCU35-nmZiQXhiUU5-UYqCU1F-erqChlNRZkp6qmZiApq4W2ZeYo4mS_ckAA",
      "totalScore": 155,
      "requiredScore": 155,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G43 + G6 + G33 · Skulking Cutthroat ×2, Bloodfang Panther ×2",
          "x": 54,
          "y": 82.4,
          "killScore": 17,
          "killPercent": 10.97,
          "mobCount": 6,
          "packTags": [
            "G43",
            "G6",
            "G33"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Bloodfang Panther ×2",
            "Mounted Raider",
            "Hoofed Outrunner"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Bloodfang Panther ×2, Mounted Raider"
        },
        {
          "index": 2,
          "label": "G15 + G2 + G39 · Mancatcher ×2, Bloodfang Panther ×2",
          "x": 52.2,
          "y": 75.3,
          "killScore": 16,
          "killPercent": 10.32,
          "mobCount": 6,
          "packTags": [
            "G15",
            "G2",
            "G39"
          ],
          "enemySummary": [
            "Mancatcher ×2",
            "Bloodfang Panther ×2",
            "Cruel Slaver",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Mancatcher ×2, Bloodfang Panther ×2, Cruel Slaver"
        },
        {
          "index": 3,
          "label": "G7 + G11 + G5 · Hoofed Outrunner ×4, Gorestained Butcher",
          "x": 50.9,
          "y": 68.6,
          "killScore": 19,
          "killPercent": 12.26,
          "mobCount": 7,
          "packTags": [
            "G7",
            "G11",
            "G5"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×4",
            "Gorestained Butcher",
            "Cruel Slaver",
            "Savage Hunter"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×4, Gorestained Butcher, Cruel Slaver"
        },
        {
          "index": 4,
          "label": "G46 · Raging Pillager",
          "x": 47.9,
          "y": 59.1,
          "killScore": 2,
          "killPercent": 1.29,
          "mobCount": 1,
          "packTags": [
            "G46"
          ],
          "enemySummary": [
            "Raging Pillager"
          ],
          "kind": "pack",
          "notes": "Raging Pillager"
        },
        {
          "index": 5,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 50.7,
          "y": 57.7,
          "killScore": 20,
          "killPercent": 12.9,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 6,
          "label": "G3 + G31 + G10 · Raging Razorback ×2, Skulking Cutthroat ×2",
          "x": 49.3,
          "y": 51.1,
          "killScore": 17,
          "killPercent": 10.97,
          "mobCount": 6,
          "packTags": [
            "G3",
            "G31",
            "G10"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Skulking Cutthroat ×2",
            "Diabolical Hellcaller",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Skulking Cutthroat ×2, Diabolical Hellcaller"
        },
        {
          "index": 7,
          "label": "G20 · Ritual Devotee ×2, Hellspawned Bulgore",
          "x": 53.1,
          "y": 50.6,
          "killScore": 9,
          "killPercent": 5.81,
          "mobCount": 4,
          "packTags": [
            "G20"
          ],
          "enemySummary": [
            "Ritual Devotee ×2",
            "Hellspawned Bulgore",
            "Profane Defiler"
          ],
          "kind": "pack",
          "notes": "Ritual Devotee ×2, Hellspawned Bulgore, Profane Defiler"
        },
        {
          "index": 8,
          "label": "Warlord Brogg (Bridge)",
          "x": 49.8,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Warlord Brogg (Bridge)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Bridge)"
        },
        {
          "index": 9,
          "label": "G23 + G32 + G19 · Mounted Raider ×2, Raging Pillager ×2",
          "x": 46.2,
          "y": 33.6,
          "killScore": 20,
          "killPercent": 12.9,
          "mobCount": 6,
          "packTags": [
            "G23",
            "G32",
            "G19"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Raging Pillager ×2",
            "Gorestained Butcher",
            "Vile Executioner"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Raging Pillager ×2, Gorestained Butcher"
        },
        {
          "index": 10,
          "label": "G12 + G14 + G4 · Mounted Raider ×2, Profane Defiler ×2",
          "x": 42.9,
          "y": 32.6,
          "killScore": 19,
          "killPercent": 12.26,
          "mobCount": 6,
          "packTags": [
            "G12",
            "G14",
            "G4"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Profane Defiler ×2",
            "Hellspawned Bulgore",
            "Bloodfang Panther"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Profane Defiler ×2, Hellspawned Bulgore"
        },
        {
          "index": 11,
          "label": "G34 + G45 · Hoofed Outrunner ×2, Skulking Cutthroat ×2",
          "x": 41.5,
          "y": 24.1,
          "killScore": 16,
          "killPercent": 10.32,
          "mobCount": 6,
          "packTags": [
            "G34",
            "G45"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×2",
            "Skulking Cutthroat ×2",
            "Cruel Slaver",
            "Bloodfang Panther"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×2, Skulking Cutthroat ×2, Cruel Slaver"
        },
        {
          "index": 12,
          "label": "Warlord Brogg (Final)",
          "x": 45.9,
          "y": 14.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G50"
          ],
          "enemySummary": [
            "Warlord Brogg (Final)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Final)"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AZueeCC4JL8otzyxJDlD4VHDFIVgIwXX3IL88tSi1BQJwT2lC1zrYnu6tt5f4n462rjiobLLnQ4f7jkdUW9miUgvzZsgmFgQnliUk1-UouBUlJ-erqDhVJSZkp6qmZiAJu6WmZeYo8kobgAA",
      "shareHash": "#r5=AZueeCC4JL8otzyxJDlD4VHDFIVgIwXX3IL88tSi1BQJwT2lC1zrYnu6tt5f4n462rjiobLLnQ4f7jkdUW9miUgvzZsgmFgQnliUk1-UouBUlJ-erqDhVJSZkp6qmZiAJu6WmZeYo8kobgAA",
      "totalScore": 155,
      "requiredScore": 155,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G43 + G21 + G6 · Skulking Cutthroat ×2, Raging Razorback",
          "x": 53.2,
          "y": 86,
          "killScore": 15,
          "killPercent": 9.68,
          "mobCount": 4,
          "packTags": [
            "G43",
            "G21",
            "G6"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Raging Razorback",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Raging Razorback, Mounted Raider"
        },
        {
          "index": 2,
          "label": "G33 + G2 + G39 · Bloodfang Panther ×4, Hoofed Outrunner",
          "x": 53.8,
          "y": 76,
          "killScore": 17,
          "killPercent": 10.97,
          "mobCount": 6,
          "packTags": [
            "G33",
            "G2",
            "G39"
          ],
          "enemySummary": [
            "Bloodfang Panther ×4",
            "Hoofed Outrunner",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Bloodfang Panther ×4, Hoofed Outrunner, Thornclaw Grizzly"
        },
        {
          "index": 3,
          "label": "G7 + G11 + G5 · Hoofed Outrunner ×4, Gorestained Butcher",
          "x": 50.9,
          "y": 68.6,
          "killScore": 19,
          "killPercent": 12.26,
          "mobCount": 7,
          "packTags": [
            "G7",
            "G11",
            "G5"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×4",
            "Gorestained Butcher",
            "Cruel Slaver",
            "Savage Hunter"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×4, Gorestained Butcher, Cruel Slaver"
        },
        {
          "index": 4,
          "label": "G36 + G42 + G16 · Raging Razorback ×2, Mancatcher ×2",
          "x": 49.4,
          "y": 58.9,
          "killScore": 16,
          "killPercent": 10.32,
          "mobCount": 6,
          "packTags": [
            "G36",
            "G42",
            "G16"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Mancatcher ×2",
            "Forlorn Acolyte",
            "Raging Pillager"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Mancatcher ×2, Forlorn Acolyte"
        },
        {
          "index": 5,
          "label": "G13 + G3 · Savage Hunter ×2, Raging Pillager",
          "x": 50.9,
          "y": 54.9,
          "killScore": 12,
          "killPercent": 7.74,
          "mobCount": 4,
          "packTags": [
            "G13",
            "G3"
          ],
          "enemySummary": [
            "Savage Hunter ×2",
            "Raging Pillager",
            "Diabolical Hellcaller"
          ],
          "kind": "pack",
          "notes": "Savage Hunter ×2, Raging Pillager, Diabolical Hellcaller"
        },
        {
          "index": 6,
          "label": "G10 · Skulking Cutthroat ×2, Mounted Raider",
          "x": 51.1,
          "y": 48.7,
          "killScore": 15,
          "killPercent": 9.68,
          "mobCount": 3,
          "packTags": [
            "G10"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Mounted Raider"
        },
        {
          "index": 7,
          "label": "Warlord Brogg (Bridge)",
          "x": 49.8,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Warlord Brogg (Bridge)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Bridge)"
        },
        {
          "index": 8,
          "label": "G23 + G32 + G19 · Mounted Raider ×2, Raging Pillager ×2",
          "x": 46.2,
          "y": 33.6,
          "killScore": 20,
          "killPercent": 12.9,
          "mobCount": 6,
          "packTags": [
            "G23",
            "G32",
            "G19"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Raging Pillager ×2",
            "Gorestained Butcher",
            "Vile Executioner"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Raging Pillager ×2, Gorestained Butcher"
        },
        {
          "index": 9,
          "label": "G12 + G4 + G45 · Mounted Raider ×2, Bloodfang Panther ×2",
          "x": 43.3,
          "y": 26.2,
          "killScore": 18,
          "killPercent": 11.61,
          "mobCount": 6,
          "packTags": [
            "G12",
            "G4",
            "G45"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Bloodfang Panther ×2",
            "Skulking Cutthroat ×2"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Bloodfang Panther ×2, Skulking Cutthroat ×2"
        },
        {
          "index": 10,
          "label": "G35 + G18 · Thornclaw Grizzly ×2, Skulking Cutthroat ×2",
          "x": 38.8,
          "y": 19.5,
          "killScore": 23,
          "killPercent": 14.84,
          "mobCount": 6,
          "packTags": [
            "G35",
            "G18"
          ],
          "enemySummary": [
            "Thornclaw Grizzly ×2",
            "Skulking Cutthroat ×2",
            "Mancatcher",
            "Savage Hunter"
          ],
          "kind": "pack",
          "notes": "Thornclaw Grizzly ×2, Skulking Cutthroat ×2, Mancatcher"
        },
        {
          "index": 11,
          "label": "Warlord Brogg (Final)",
          "x": 45.9,
          "y": 14.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G50"
          ],
          "enemySummary": [
            "Warlord Brogg (Final)"
          ],
          "kind": "boss",
          "notes": "Warlord Brogg (Final)"
        }
      ]
    }
  },
  "wraithtide-vault": {
    "Regular": {
      "r5Code": "R5.AJtgmFdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIFN0YW5kYXJkIFB1c2gKhHTDl1mzWW6Pmzm4pXwjNi_rIkjMeCNootwjLLDSIvTk8kVipUmLDyb4RuimZrVmXmptdt_zzIpmRdpnQldpBAQLCQBEZWF0aGxlc3MgS2F0cmluZWEgRmlyc3QgTWF0ZSBNYXJyb3diwEJhZWwnQXVydW0EBAuQ",
      "shareHash": "#r5=AJtgmFdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIFN0YW5kYXJkIFB1c2gKhHTDl1mzWW6Pmzm4pXwjNi_rIkjMeCNootwjLLDSIvTk8kVipUmLDyb4RuimZrVmXmptdt_zzIpmRdpnQldpBAQLCQBEZWF0aGxlc3MgS2F0cmluZWEgRmlyc3QgTWF0ZSBNYXJyb3diwEJhZWwnQXVydW0EBAuQ",
      "totalScore": 281,
      "requiredScore": 281,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G89 + G93 + G24 · Jungle Stalker ×3, Dire Rat ×2",
          "x": 56.7,
          "y": 53.6,
          "killScore": 15,
          "killPercent": 5.34,
          "mobCount": 7,
          "packTags": [
            "G89",
            "G93",
            "G24"
          ],
          "enemySummary": [
            "Jungle Stalker ×3",
            "Dire Rat ×2",
            "Saltsworn Scallywag ×2"
          ],
          "kind": "pack",
          "notes": "Jungle Stalker ×3, Dire Rat ×2, Saltsworn Scallywag ×2"
        },
        {
          "index": 2,
          "label": "G69 + G72 · Spectre of Avarice ×2, Raging Razorback ×2",
          "x": 52.7,
          "y": 56.8,
          "killScore": 11,
          "killPercent": 3.91,
          "mobCount": 5,
          "packTags": [
            "G69",
            "G72"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Raging Razorback ×2",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Raging Razorback ×2, Lost Soul"
        },
        {
          "index": 3,
          "label": "G17 · Vengeful Shade ×2, Witch of the Tides",
          "x": 43.8,
          "y": 72.1,
          "killScore": 12,
          "killPercent": 4.27,
          "mobCount": 4,
          "packTags": [
            "G17"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Witch of the Tides",
            "Fading Deckhand"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Witch of the Tides, Fading Deckhand"
        },
        {
          "index": 4,
          "label": "G58 + G19 · Witch of the Tides ×2, Scuttlejack Cannoneer",
          "x": 45.8,
          "y": 87.9,
          "killScore": 16,
          "killPercent": 5.69,
          "mobCount": 4,
          "packTags": [
            "G58",
            "G19"
          ],
          "enemySummary": [
            "Witch of the Tides ×2",
            "Scuttlejack Cannoneer",
            "Vengeful Shade"
          ],
          "kind": "pack",
          "notes": "Witch of the Tides ×2, Scuttlejack Cannoneer, Vengeful Shade"
        },
        {
          "index": 5,
          "label": "Deathless Katrine",
          "x": 48.3,
          "y": 72.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Deathless Katrine"
          ],
          "kind": "boss",
          "notes": "Deathless Katrine"
        },
        {
          "index": 6,
          "label": "G59 + G33 + G61 · Raging Razorback ×6, Jungle Stalker ×2",
          "x": 45.3,
          "y": 62.4,
          "killScore": 23,
          "killPercent": 8.19,
          "mobCount": 9,
          "packTags": [
            "G59",
            "G33",
            "G61"
          ],
          "enemySummary": [
            "Raging Razorback ×6",
            "Jungle Stalker ×2",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×6, Jungle Stalker ×2, Scuttlejack Cannoneer"
        },
        {
          "index": 7,
          "label": "G62 + G91 + G10 · Wild Bloom (burried) ×2, Jungle Stalker",
          "x": 45.7,
          "y": 59.6,
          "killScore": 5,
          "killPercent": 1.78,
          "mobCount": 3,
          "packTags": [
            "G62",
            "G91",
            "G10"
          ],
          "enemySummary": [
            "Wild Bloom (burried) ×2",
            "Jungle Stalker"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried) ×2, Jungle Stalker"
        },
        {
          "index": 8,
          "label": "G8 + G9 + G79 · Vengeful Shade ×2, Wild Bloom",
          "x": 48.8,
          "y": 51.5,
          "killScore": 10,
          "killPercent": 3.56,
          "mobCount": 5,
          "packTags": [
            "G8",
            "G9",
            "G79"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Wild Bloom",
            "Wild Bloom (burried)",
            "Tormented Spectre"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Wild Bloom, Wild Bloom (burried)"
        },
        {
          "index": 9,
          "label": "G99 + G45 + G87 · Saltsworn Scallywag ×2, Jungle Stalker ×2",
          "x": 49.7,
          "y": 44,
          "killScore": 20,
          "killPercent": 7.12,
          "mobCount": 6,
          "packTags": [
            "G99",
            "G45",
            "G87"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Jungle Stalker ×2",
            "Barbarous Lasher (burried)",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Jungle Stalker ×2, Barbarous Lasher (burried)"
        },
        {
          "index": 10,
          "label": "G97 + G52 + G60 · Saltsworn Scallywag ×2, Jungle Stalker ×2",
          "x": 53.1,
          "y": 39.8,
          "killScore": 19,
          "killPercent": 6.76,
          "mobCount": 7,
          "packTags": [
            "G97",
            "G52",
            "G60"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Jungle Stalker ×2",
            "Water Surger",
            "Witch of the Tides",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Jungle Stalker ×2, Water Surger"
        },
        {
          "index": 11,
          "label": "G50 + G23 + G15 · Spectre of Avarice ×2, Lost Soul ×2",
          "x": 51.7,
          "y": 28,
          "killScore": 21,
          "killPercent": 7.47,
          "mobCount": 8,
          "packTags": [
            "G50",
            "G23",
            "G15"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Lost Soul ×2",
            "Jungle Stalker ×2",
            "Saltsworn Scallywag",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Lost Soul ×2, Jungle Stalker ×2"
        },
        {
          "index": 12,
          "label": "G57 + G74 · Dire Rat ×2, Bleachbone Bouncer",
          "x": 53.3,
          "y": 11.4,
          "killScore": 10,
          "killPercent": 3.56,
          "mobCount": 4,
          "packTags": [
            "G57",
            "G74"
          ],
          "enemySummary": [
            "Dire Rat ×2",
            "Bleachbone Bouncer",
            "Bilgerat"
          ],
          "kind": "pack",
          "notes": "Dire Rat ×2, Bleachbone Bouncer, Bilgerat"
        },
        {
          "index": 13,
          "label": "First Mate Marrow",
          "x": 53.3,
          "y": 16.7,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "First Mate Marrow"
          ],
          "kind": "boss",
          "notes": "First Mate Marrow"
        },
        {
          "index": 14,
          "label": "G42 + G25 + G46 · Vengeful Shade ×4, Saltsworn Scallywag ×3",
          "x": 48.4,
          "y": 19.2,
          "killScore": 25,
          "killPercent": 8.9,
          "mobCount": 9,
          "packTags": [
            "G42",
            "G25",
            "G46"
          ],
          "enemySummary": [
            "Vengeful Shade ×4",
            "Saltsworn Scallywag ×3",
            "Jungle Stalker",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×4, Saltsworn Scallywag ×3, Jungle Stalker"
        },
        {
          "index": 15,
          "label": "G47 + G92 · Saltsworn Scallywag ×2, Bleachbone Bouncer",
          "x": 46.3,
          "y": 17,
          "killScore": 12,
          "killPercent": 4.27,
          "mobCount": 4,
          "packTags": [
            "G47",
            "G92"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Bleachbone Bouncer",
            "Bilgerat"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Bleachbone Bouncer, Bilgerat"
        },
        {
          "index": 16,
          "label": "G55 + G81 · Vengeful Shade ×2, Spectre of Avarice ×2",
          "x": 43.8,
          "y": 21.3,
          "killScore": 30,
          "killPercent": 10.68,
          "mobCount": 9,
          "packTags": [
            "G55",
            "G81"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Spectre of Avarice ×2",
            "Fading Deckhand ×2",
            "Greedspawned Demon",
            "Witch of the Tides",
            "Hollowed Corsair"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Spectre of Avarice ×2, Fading Deckhand ×2"
        },
        {
          "index": 17,
          "label": "G43 + G27 · Lost Soul ×4, Jungle Stalker ×2",
          "x": 46.1,
          "y": 29,
          "killScore": 16,
          "killPercent": 5.69,
          "mobCount": 8,
          "packTags": [
            "G43",
            "G27"
          ],
          "enemySummary": [
            "Lost Soul ×4",
            "Jungle Stalker ×2",
            "Tormented Spectre",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×4, Jungle Stalker ×2, Tormented Spectre"
        },
        {
          "index": 18,
          "label": "G12 + G96 + G86 · Toxic Blossom (burried) ×2, Spectre of Avarice ×2",
          "x": 42.9,
          "y": 31.7,
          "killScore": 19,
          "killPercent": 6.76,
          "mobCount": 7,
          "packTags": [
            "G12",
            "G96",
            "G86"
          ],
          "enemySummary": [
            "Toxic Blossom (burried) ×2",
            "Spectre of Avarice ×2",
            "Barbarous Lasher (burried)",
            "Greedspawned Demon",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Toxic Blossom (burried) ×2, Spectre of Avarice ×2, Barbarous Lasher (burried)"
        },
        {
          "index": 19,
          "label": "G20 · Spectre of Avarice ×2, Gilded Fiend ×2",
          "x": 39.9,
          "y": 42.7,
          "killScore": 17,
          "killPercent": 6.05,
          "mobCount": 5,
          "packTags": [
            "G20"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Gilded Fiend ×2",
            "Greedspawned Demon"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Gilded Fiend ×2, Greedspawned Demon"
        },
        {
          "index": 20,
          "label": "Bael'Aurum",
          "x": 36.2,
          "y": 42.8,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Bael'Aurum"
          ],
          "kind": "boss",
          "notes": "Bael'Aurum"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.AJth4FdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIEdob3JuCoR0w5dZs1luj5s5uKV8IzYv6yJIzHgjaKLcIyyw0iL05PJFYqVJiw8m-Ebopma1Zl5qbXbf88yKZkXaZ0JXaQQECwkARGVhdGhsZXNzIEthdHJpbmVhIEZpcnN0IE1hdGUgTWFycm93YsBCYWVsJ0F1cnVtBAQLkA",
      "shareHash": "#r5=AJth4FdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIEdob3JuCoR0w5dZs1luj5s5uKV8IzYv6yJIzHgjaKLcIyyw0iL05PJFYqVJiw8m-Ebopma1Zl5qbXbf88yKZkXaZ0JXaQQECwkARGVhdGhsZXNzIEthdHJpbmVhIEZpcnN0IE1hdGUgTWFycm93YsBCYWVsJ0F1cnVtBAQLkA",
      "totalScore": 281,
      "requiredScore": 281,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G89 + G93 + G24 · Jungle Stalker ×3, Dire Rat ×2",
          "x": 56.7,
          "y": 53.6,
          "killScore": 15,
          "killPercent": 5.34,
          "mobCount": 7,
          "packTags": [
            "G89",
            "G93",
            "G24"
          ],
          "enemySummary": [
            "Jungle Stalker ×3",
            "Dire Rat ×2",
            "Saltsworn Scallywag ×2"
          ],
          "kind": "pack",
          "notes": "Jungle Stalker ×3, Dire Rat ×2, Saltsworn Scallywag ×2"
        },
        {
          "index": 2,
          "label": "G69 + G72 · Spectre of Avarice ×2, Raging Razorback ×2",
          "x": 52.7,
          "y": 56.8,
          "killScore": 11,
          "killPercent": 3.91,
          "mobCount": 5,
          "packTags": [
            "G69",
            "G72"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Raging Razorback ×2",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Raging Razorback ×2, Lost Soul"
        },
        {
          "index": 3,
          "label": "G17 · Vengeful Shade ×2, Witch of the Tides",
          "x": 43.8,
          "y": 72.1,
          "killScore": 12,
          "killPercent": 4.27,
          "mobCount": 4,
          "packTags": [
            "G17"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Witch of the Tides",
            "Fading Deckhand"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Witch of the Tides, Fading Deckhand"
        },
        {
          "index": 4,
          "label": "G58 + G19 · Witch of the Tides ×2, Scuttlejack Cannoneer",
          "x": 45.8,
          "y": 87.9,
          "killScore": 16,
          "killPercent": 5.69,
          "mobCount": 4,
          "packTags": [
            "G58",
            "G19"
          ],
          "enemySummary": [
            "Witch of the Tides ×2",
            "Scuttlejack Cannoneer",
            "Vengeful Shade"
          ],
          "kind": "pack",
          "notes": "Witch of the Tides ×2, Scuttlejack Cannoneer, Vengeful Shade"
        },
        {
          "index": 5,
          "label": "Deathless Katrine",
          "x": 48.3,
          "y": 72.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Deathless Katrine"
          ],
          "kind": "boss",
          "notes": "Deathless Katrine"
        },
        {
          "index": 6,
          "label": "G59 + G33 + G61 · Raging Razorback ×6, Jungle Stalker ×2",
          "x": 45.3,
          "y": 62.4,
          "killScore": 23,
          "killPercent": 8.19,
          "mobCount": 9,
          "packTags": [
            "G59",
            "G33",
            "G61"
          ],
          "enemySummary": [
            "Raging Razorback ×6",
            "Jungle Stalker ×2",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×6, Jungle Stalker ×2, Scuttlejack Cannoneer"
        },
        {
          "index": 7,
          "label": "G62 + G91 + G10 · Wild Bloom (burried) ×2, Jungle Stalker",
          "x": 45.7,
          "y": 59.6,
          "killScore": 5,
          "killPercent": 1.78,
          "mobCount": 3,
          "packTags": [
            "G62",
            "G91",
            "G10"
          ],
          "enemySummary": [
            "Wild Bloom (burried) ×2",
            "Jungle Stalker"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried) ×2, Jungle Stalker"
        },
        {
          "index": 8,
          "label": "G8 + G9 + G79 · Vengeful Shade ×2, Wild Bloom",
          "x": 48.8,
          "y": 51.5,
          "killScore": 10,
          "killPercent": 3.56,
          "mobCount": 5,
          "packTags": [
            "G8",
            "G9",
            "G79"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Wild Bloom",
            "Wild Bloom (burried)",
            "Tormented Spectre"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Wild Bloom, Wild Bloom (burried)"
        },
        {
          "index": 9,
          "label": "G99 + G45 + G87 · Saltsworn Scallywag ×2, Jungle Stalker ×2",
          "x": 49.7,
          "y": 44,
          "killScore": 20,
          "killPercent": 7.12,
          "mobCount": 6,
          "packTags": [
            "G99",
            "G45",
            "G87"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Jungle Stalker ×2",
            "Barbarous Lasher (burried)",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Jungle Stalker ×2, Barbarous Lasher (burried)"
        },
        {
          "index": 10,
          "label": "G97 + G52 + G60 · Saltsworn Scallywag ×2, Jungle Stalker ×2",
          "x": 53.1,
          "y": 39.8,
          "killScore": 19,
          "killPercent": 6.76,
          "mobCount": 7,
          "packTags": [
            "G97",
            "G52",
            "G60"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Jungle Stalker ×2",
            "Water Surger",
            "Witch of the Tides",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Jungle Stalker ×2, Water Surger"
        },
        {
          "index": 11,
          "label": "G50 + G23 + G15 · Spectre of Avarice ×2, Lost Soul ×2",
          "x": 51.7,
          "y": 28,
          "killScore": 21,
          "killPercent": 7.47,
          "mobCount": 8,
          "packTags": [
            "G50",
            "G23",
            "G15"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Lost Soul ×2",
            "Jungle Stalker ×2",
            "Saltsworn Scallywag",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Lost Soul ×2, Jungle Stalker ×2"
        },
        {
          "index": 12,
          "label": "G57 + G74 · Dire Rat ×2, Bleachbone Bouncer",
          "x": 53.3,
          "y": 11.4,
          "killScore": 10,
          "killPercent": 3.56,
          "mobCount": 4,
          "packTags": [
            "G57",
            "G74"
          ],
          "enemySummary": [
            "Dire Rat ×2",
            "Bleachbone Bouncer",
            "Bilgerat"
          ],
          "kind": "pack",
          "notes": "Dire Rat ×2, Bleachbone Bouncer, Bilgerat"
        },
        {
          "index": 13,
          "label": "First Mate Marrow",
          "x": 53.3,
          "y": 16.7,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "First Mate Marrow"
          ],
          "kind": "boss",
          "notes": "First Mate Marrow"
        },
        {
          "index": 14,
          "label": "G42 + G25 + G46 · Vengeful Shade ×4, Saltsworn Scallywag ×3",
          "x": 48.4,
          "y": 19.2,
          "killScore": 25,
          "killPercent": 8.9,
          "mobCount": 9,
          "packTags": [
            "G42",
            "G25",
            "G46"
          ],
          "enemySummary": [
            "Vengeful Shade ×4",
            "Saltsworn Scallywag ×3",
            "Jungle Stalker",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×4, Saltsworn Scallywag ×3, Jungle Stalker"
        },
        {
          "index": 15,
          "label": "G47 + G92 · Saltsworn Scallywag ×2, Bleachbone Bouncer",
          "x": 46.3,
          "y": 17,
          "killScore": 12,
          "killPercent": 4.27,
          "mobCount": 4,
          "packTags": [
            "G47",
            "G92"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Bleachbone Bouncer",
            "Bilgerat"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Bleachbone Bouncer, Bilgerat"
        },
        {
          "index": 16,
          "label": "G55 + G81 · Vengeful Shade ×2, Spectre of Avarice ×2",
          "x": 43.8,
          "y": 21.3,
          "killScore": 30,
          "killPercent": 10.68,
          "mobCount": 9,
          "packTags": [
            "G55",
            "G81"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Spectre of Avarice ×2",
            "Fading Deckhand ×2",
            "Greedspawned Demon",
            "Witch of the Tides",
            "Hollowed Corsair"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Spectre of Avarice ×2, Fading Deckhand ×2"
        },
        {
          "index": 17,
          "label": "G43 + G27 · Lost Soul ×4, Jungle Stalker ×2",
          "x": 46.1,
          "y": 29,
          "killScore": 16,
          "killPercent": 5.69,
          "mobCount": 8,
          "packTags": [
            "G43",
            "G27"
          ],
          "enemySummary": [
            "Lost Soul ×4",
            "Jungle Stalker ×2",
            "Tormented Spectre",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×4, Jungle Stalker ×2, Tormented Spectre"
        },
        {
          "index": 18,
          "label": "G12 + G96 + G86 · Toxic Blossom (burried) ×2, Spectre of Avarice ×2",
          "x": 42.9,
          "y": 31.7,
          "killScore": 19,
          "killPercent": 6.76,
          "mobCount": 7,
          "packTags": [
            "G12",
            "G96",
            "G86"
          ],
          "enemySummary": [
            "Toxic Blossom (burried) ×2",
            "Spectre of Avarice ×2",
            "Barbarous Lasher (burried)",
            "Greedspawned Demon",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Toxic Blossom (burried) ×2, Spectre of Avarice ×2, Barbarous Lasher (burried)"
        },
        {
          "index": 19,
          "label": "G20 · Spectre of Avarice ×2, Gilded Fiend ×2",
          "x": 39.9,
          "y": 42.7,
          "killScore": 17,
          "killPercent": 6.05,
          "mobCount": 5,
          "packTags": [
            "G20"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Gilded Fiend ×2",
            "Greedspawned Demon"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Gilded Fiend ×2, Greedspawned Demon"
        },
        {
          "index": 20,
          "label": "Bael'Aurum",
          "x": 36.2,
          "y": 42.8,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Bael'Aurum"
          ],
          "kind": "boss",
          "notes": "Bael'Aurum"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.AJth0FdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIEVpcmEMBFanaki_F07qOElfCKYlf5ELnDwRtFFuEZZYaRGtLTC2YSvIrFSppvjf2wULkZtJPSmbyPyP-ZOoRTMceSLoRTyRTev7alZ4ldpCApBYSERlYXRobGVzcyBLYXRyaW5lYSBGaXJzdCBNYXRlIE1hcnJvd2CERWlyYSB0aGUgV2hpdGUgV2l0Y2ggKCs5MHMgQm9vbimEYsBCYWVsJ0F1cnVtCApBckA",
      "shareHash": "#r5=AJth0FdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIEVpcmEMBFanaki_F07qOElfCKYlf5ELnDwRtFFuEZZYaRGtLTC2YSvIrFSppvjf2wULkZtJPSmbyPyP-ZOoRTMceSLoRTyRTev7alZ4ldpCApBYSERlYXRobGVzcyBLYXRyaW5lYSBGaXJzdCBNYXRlIE1hcnJvd2CERWlyYSB0aGUgV2hpdGUgV2l0Y2ggKCs5MHMgQm9vbimEYsBCYWVsJ0F1cnVtCApBckA",
      "totalScore": 281,
      "requiredScore": 281,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G93 + G24 + G69 · Jungle Stalker ×3, Saltsworn Scallywag ×2",
          "x": 55,
          "y": 54.4,
          "killScore": 20,
          "killPercent": 7.12,
          "mobCount": 8,
          "packTags": [
            "G93",
            "G24",
            "G69"
          ],
          "enemySummary": [
            "Jungle Stalker ×3",
            "Saltsworn Scallywag ×2",
            "Spectre of Avarice ×2",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Jungle Stalker ×3, Saltsworn Scallywag ×2, Spectre of Avarice ×2"
        },
        {
          "index": 2,
          "label": "G72 + G11 + G6 · Raging Razorback ×2, Toxic Blossom (burried) ×2",
          "x": 50.2,
          "y": 60,
          "killScore": 12,
          "killPercent": 4.27,
          "mobCount": 6,
          "packTags": [
            "G72",
            "G11",
            "G6"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Toxic Blossom (burried) ×2",
            "Barbarous Lasher (burried)",
            "Wild Bloom"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Toxic Blossom (burried) ×2, Barbarous Lasher (burried)"
        },
        {
          "index": 3,
          "label": "G4 · Wild Bloom (burried)",
          "x": 48.3,
          "y": 65.1,
          "killScore": 1,
          "killPercent": 0.36,
          "mobCount": 1,
          "packTags": [
            "G4"
          ],
          "enemySummary": [
            "Wild Bloom (burried)"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried)"
        },
        {
          "index": 4,
          "label": "Deathless Katrine",
          "x": 48.3,
          "y": 72.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Deathless Katrine"
          ],
          "kind": "boss",
          "notes": "Deathless Katrine"
        },
        {
          "index": 5,
          "label": "G5 + G59 + G33 · Raging Razorback ×6, Wild Bloom",
          "x": 45.5,
          "y": 63.2,
          "killScore": 18,
          "killPercent": 6.41,
          "mobCount": 8,
          "packTags": [
            "G5",
            "G59",
            "G33"
          ],
          "enemySummary": [
            "Raging Razorback ×6",
            "Wild Bloom",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×6, Wild Bloom, Scuttlejack Cannoneer"
        },
        {
          "index": 6,
          "label": "G61 + G91 + G10 · Jungle Stalker ×2, Wild Bloom (burried) ×2",
          "x": 46.4,
          "y": 58.7,
          "killScore": 8,
          "killPercent": 2.85,
          "mobCount": 4,
          "packTags": [
            "G61",
            "G91",
            "G10"
          ],
          "enemySummary": [
            "Jungle Stalker ×2",
            "Wild Bloom (burried) ×2"
          ],
          "kind": "pack",
          "notes": "Jungle Stalker ×2, Wild Bloom (burried) ×2"
        },
        {
          "index": 7,
          "label": "G8 + G9 + G79 · Vengeful Shade ×2, Wild Bloom",
          "x": 48.8,
          "y": 51.5,
          "killScore": 10,
          "killPercent": 3.56,
          "mobCount": 5,
          "packTags": [
            "G8",
            "G9",
            "G79"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Wild Bloom",
            "Wild Bloom (burried)",
            "Tormented Spectre"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Wild Bloom, Wild Bloom (burried)"
        },
        {
          "index": 8,
          "label": "G99 + G45 + G87 · Saltsworn Scallywag ×2, Jungle Stalker ×2",
          "x": 49.7,
          "y": 44,
          "killScore": 20,
          "killPercent": 7.12,
          "mobCount": 6,
          "packTags": [
            "G99",
            "G45",
            "G87"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Jungle Stalker ×2",
            "Barbarous Lasher (burried)",
            "Scuttlejack Cannoneer"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Jungle Stalker ×2, Barbarous Lasher (burried)"
        },
        {
          "index": 9,
          "label": "G97 + G53 + G52 · Saltsworn Scallywag ×4, Water Surger",
          "x": 53.3,
          "y": 42.3,
          "killScore": 19,
          "killPercent": 6.76,
          "mobCount": 7,
          "packTags": [
            "G97",
            "G53",
            "G52"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×4",
            "Water Surger",
            "Witch of the Tides",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×4, Water Surger, Witch of the Tides"
        },
        {
          "index": 10,
          "label": "G16 + G60 · Wild Bloom ×3, Dire Rat ×2",
          "x": 55.6,
          "y": 39.6,
          "killScore": 17,
          "killPercent": 6.05,
          "mobCount": 9,
          "packTags": [
            "G16",
            "G60"
          ],
          "enemySummary": [
            "Wild Bloom ×3",
            "Dire Rat ×2",
            "Jungle Stalker ×2",
            "Bilgerat",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Wild Bloom ×3, Dire Rat ×2, Jungle Stalker ×2"
        },
        {
          "index": 11,
          "label": "G50 + G23 + G57 · Spectre of Avarice ×2, Lost Soul ×2",
          "x": 52.6,
          "y": 26.2,
          "killScore": 14,
          "killPercent": 4.98,
          "mobCount": 6,
          "packTags": [
            "G50",
            "G23",
            "G57"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Lost Soul ×2",
            "Saltsworn Scallywag",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Lost Soul ×2, Saltsworn Scallywag"
        },
        {
          "index": 12,
          "label": "First Mate Marrow",
          "x": 53.3,
          "y": 16.7,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "First Mate Marrow"
          ],
          "kind": "boss",
          "notes": "First Mate Marrow"
        },
        {
          "index": 13,
          "label": "G63 + G42 · Saltsworn Scallywag ×2, Witch of the Tides",
          "x": 48.9,
          "y": 20.8,
          "killScore": 14,
          "killPercent": 4.98,
          "mobCount": 5,
          "packTags": [
            "G63",
            "G42"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×2",
            "Witch of the Tides",
            "Water Surger",
            "Jungle Stalker"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×2, Witch of the Tides, Water Surger"
        },
        {
          "index": 14,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 47.3,
          "y": 22.7,
          "killScore": 20,
          "killPercent": 7.12,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 15,
          "label": "G25 + G47 + G48 · Saltsworn Scallywag ×4, Vengeful Shade ×2",
          "x": 46.6,
          "y": 19.6,
          "killScore": 18,
          "killPercent": 6.41,
          "mobCount": 7,
          "packTags": [
            "G25",
            "G47",
            "G48"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×4",
            "Vengeful Shade ×2",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×4, Vengeful Shade ×2, Bleachbone Bouncer"
        },
        {
          "index": 16,
          "label": "G81 · Fading Deckhand ×2, Hollowed Corsair",
          "x": 45.7,
          "y": 23.3,
          "killScore": 9,
          "killPercent": 3.2,
          "mobCount": 3,
          "packTags": [
            "G81"
          ],
          "enemySummary": [
            "Fading Deckhand ×2",
            "Hollowed Corsair"
          ],
          "kind": "pack",
          "notes": "Fading Deckhand ×2, Hollowed Corsair"
        },
        {
          "index": 17,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 43,
          "y": 20,
          "killScore": 20,
          "killPercent": 7.12,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 18,
          "label": "G43 + G66 + G71 · Lost Soul ×6, Tormented Spectre",
          "x": 44.2,
          "y": 26.6,
          "killScore": 12,
          "killPercent": 4.27,
          "mobCount": 9,
          "packTags": [
            "G43",
            "G66",
            "G71"
          ],
          "enemySummary": [
            "Lost Soul ×6",
            "Tormented Spectre",
            "Gilded Fiend",
            "Wild Bloom (burried)"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×6, Tormented Spectre, Gilded Fiend"
        },
        {
          "index": 19,
          "label": "G12 + G75 + G83 · Toxic Blossom (burried) ×2, Wild Bloom (burried) ×2",
          "x": 42.5,
          "y": 27.5,
          "killScore": 9,
          "killPercent": 3.2,
          "mobCount": 5,
          "packTags": [
            "G12",
            "G75",
            "G83"
          ],
          "enemySummary": [
            "Toxic Blossom (burried) ×2",
            "Wild Bloom (burried) ×2",
            "Barbarous Lasher (burried)"
          ],
          "kind": "pack",
          "notes": "Toxic Blossom (burried) ×2, Wild Bloom (burried) ×2, Barbarous Lasher (burried)"
        },
        {
          "index": 20,
          "label": "G84 + G85 + G88 · Wild Bloom (burried) ×3",
          "x": 40.8,
          "y": 26.8,
          "killScore": 3,
          "killPercent": 1.07,
          "mobCount": 3,
          "packTags": [
            "G84",
            "G85",
            "G88"
          ],
          "enemySummary": [
            "Wild Bloom (burried) ×3"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried) ×3"
        },
        {
          "index": 21,
          "label": "G98 + G96 + G86 · Spectre of Avarice ×2, Wild Bloom (burried)",
          "x": 42.4,
          "y": 33.1,
          "killScore": 13,
          "killPercent": 4.63,
          "mobCount": 5,
          "packTags": [
            "G98",
            "G96",
            "G86"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Wild Bloom (burried)",
            "Greedspawned Demon",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Wild Bloom (burried), Greedspawned Demon"
        },
        {
          "index": 22,
          "label": "G64 + G20 · Spectre of Avarice ×4, Gilded Fiend ×2",
          "x": 41.5,
          "y": 41.3,
          "killScore": 24,
          "killPercent": 8.54,
          "mobCount": 8,
          "packTags": [
            "G64",
            "G20"
          ],
          "enemySummary": [
            "Spectre of Avarice ×4",
            "Gilded Fiend ×2",
            "Lost Soul",
            "Greedspawned Demon"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×4, Gilded Fiend ×2, Lost Soul"
        },
        {
          "index": 23,
          "label": "Bael'Aurum",
          "x": 36.2,
          "y": 42.8,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Bael'Aurum"
          ],
          "kind": "boss",
          "notes": "Bael'Aurum"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AJtgiFdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIEVtcG93ZXJlZAkEdMOXWbNZbtnp_SvhFLhrsIpwFviRTSb2cj9mzYEbxyUqbsm-Ee05tNqbXbZecCKZ3eyjjJXaQgQWEkRlYXRobGVzcyBLYXRyaW5lYSBGaXJzdCBNYXRlIE1hcnJvd2LAQmFlbCdBdXJ1bQgQXMA",
      "shareHash": "#r5=AJtgiFdyYWl0aHRpZGUgVmF1bHQg4oCUIFMyIEVtcG93ZXJlZAkEdMOXWbNZbtnp_SvhFLhrsIpwFviRTSb2cj9mzYEbxyUqbsm-Ee05tNqbXbZecCKZ3eyjjJXaQgQWEkRlYXRobGVzcyBLYXRyaW5lYSBGaXJzdCBNYXRlIE1hcnJvd2LAQmFlbCdBdXJ1bQgQXMA",
      "totalScore": 281,
      "requiredScore": 281,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G89 + G93 + G24 · Jungle Stalker ×3, Dire Rat ×2",
          "x": 56.7,
          "y": 53.6,
          "killScore": 15,
          "killPercent": 5.34,
          "mobCount": 7,
          "packTags": [
            "G89",
            "G93",
            "G24"
          ],
          "enemySummary": [
            "Jungle Stalker ×3",
            "Dire Rat ×2",
            "Saltsworn Scallywag ×2"
          ],
          "kind": "pack",
          "notes": "Jungle Stalker ×3, Dire Rat ×2, Saltsworn Scallywag ×2"
        },
        {
          "index": 2,
          "label": "G69 + G72 · Spectre of Avarice ×2, Raging Razorback ×2",
          "x": 52.7,
          "y": 56.8,
          "killScore": 11,
          "killPercent": 3.91,
          "mobCount": 5,
          "packTags": [
            "G69",
            "G72"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Raging Razorback ×2",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Raging Razorback ×2, Lost Soul"
        },
        {
          "index": 3,
          "label": "G14 + G19 · Bilgerat ×2, Dire Rat ×2",
          "x": 42.8,
          "y": 86.7,
          "killScore": 35,
          "killPercent": 12.46,
          "mobCount": 7,
          "packTags": [
            "G14",
            "G19"
          ],
          "enemySummary": [
            "Bilgerat ×2",
            "Dire Rat ×2",
            "Witch of the Tides ×2",
            "Vengeful Shade"
          ],
          "kind": "pack",
          "notes": "Bilgerat ×2, Dire Rat ×2, Witch of the Tides ×2"
        },
        {
          "index": 4,
          "label": "Deathless Katrine",
          "x": 48.3,
          "y": 72.4,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Deathless Katrine"
          ],
          "kind": "boss",
          "notes": "Deathless Katrine"
        },
        {
          "index": 5,
          "label": "G59 + G61 + G91 · Raging Razorback ×2, Jungle Stalker ×2",
          "x": 46.2,
          "y": 60.3,
          "killScore": 11,
          "killPercent": 3.91,
          "mobCount": 5,
          "packTags": [
            "G59",
            "G61",
            "G91"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Jungle Stalker ×2",
            "Wild Bloom (burried)"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Jungle Stalker ×2, Wild Bloom (burried)"
        },
        {
          "index": 6,
          "label": "G10 + G8 + G9 · Wild Bloom (burried) ×2, Wild Bloom",
          "x": 48.1,
          "y": 56.2,
          "killScore": 3,
          "killPercent": 1.07,
          "mobCount": 3,
          "packTags": [
            "G10",
            "G8",
            "G9"
          ],
          "enemySummary": [
            "Wild Bloom (burried) ×2",
            "Wild Bloom"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried) ×2, Wild Bloom"
        },
        {
          "index": 7,
          "label": "G79 + G87 + G97 · Vengeful Shade ×2, Jungle Stalker ×2",
          "x": 50.7,
          "y": 45.4,
          "killScore": 21,
          "killPercent": 7.47,
          "mobCount": 7,
          "packTags": [
            "G79",
            "G87",
            "G97"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Jungle Stalker ×2",
            "Tormented Spectre",
            "Water Surger",
            "Witch of the Tides"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Jungle Stalker ×2, Tormented Spectre"
        },
        {
          "index": 8,
          "label": "G52 + G60 + G50 · Saltsworn Scallywag ×3, Jungle Stalker ×2",
          "x": 53.5,
          "y": 38.2,
          "killScore": 14,
          "killPercent": 4.98,
          "mobCount": 6,
          "packTags": [
            "G52",
            "G60",
            "G50"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×3",
            "Jungle Stalker ×2",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×3, Jungle Stalker ×2, Raging Razorback"
        },
        {
          "index": 9,
          "label": "G23 + G15 + G57 · Spectre of Avarice ×2, Lost Soul ×2",
          "x": 51.4,
          "y": 26.6,
          "killScore": 33,
          "killPercent": 11.74,
          "mobCount": 8,
          "packTags": [
            "G23",
            "G15",
            "G57"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Lost Soul ×2",
            "Jungle Stalker ×2",
            "Scuttlejack Cannoneer",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Lost Soul ×2, Jungle Stalker ×2"
        },
        {
          "index": 10,
          "label": "G26 · Jungle Stalker ×2, Bleachbone Bouncer",
          "x": 55.4,
          "y": 6.9,
          "killScore": 18,
          "killPercent": 6.41,
          "mobCount": 3,
          "packTags": [
            "G26"
          ],
          "enemySummary": [
            "Jungle Stalker ×2",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Jungle Stalker ×2, Bleachbone Bouncer"
        },
        {
          "index": 11,
          "label": "First Mate Marrow",
          "x": 53.3,
          "y": 16.7,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "First Mate Marrow"
          ],
          "kind": "boss",
          "notes": "First Mate Marrow"
        },
        {
          "index": 12,
          "label": "G42 + G25 + G47 · Saltsworn Scallywag ×5, Vengeful Shade ×2",
          "x": 47.5,
          "y": 20.7,
          "killScore": 23,
          "killPercent": 8.19,
          "mobCount": 9,
          "packTags": [
            "G42",
            "G25",
            "G47"
          ],
          "enemySummary": [
            "Saltsworn Scallywag ×5",
            "Vengeful Shade ×2",
            "Jungle Stalker",
            "Bleachbone Bouncer"
          ],
          "kind": "pack",
          "notes": "Saltsworn Scallywag ×5, Vengeful Shade ×2, Jungle Stalker"
        },
        {
          "index": 13,
          "label": "G55 + G81 · Vengeful Shade ×2, Spectre of Avarice ×2",
          "x": 43.8,
          "y": 21.3,
          "killScore": 38,
          "killPercent": 13.52,
          "mobCount": 9,
          "packTags": [
            "G55",
            "G81"
          ],
          "enemySummary": [
            "Vengeful Shade ×2",
            "Spectre of Avarice ×2",
            "Fading Deckhand ×2",
            "Greedspawned Demon",
            "Witch of the Tides",
            "Hollowed Corsair"
          ],
          "kind": "pack",
          "notes": "Vengeful Shade ×2, Spectre of Avarice ×2, Fading Deckhand ×2"
        },
        {
          "index": 14,
          "label": "G43 + G12 · Lost Soul ×4, Toxic Blossom (burried) ×2",
          "x": 44.4,
          "y": 27.8,
          "killScore": 13,
          "killPercent": 4.63,
          "mobCount": 8,
          "packTags": [
            "G43",
            "G12"
          ],
          "enemySummary": [
            "Lost Soul ×4",
            "Toxic Blossom (burried) ×2",
            "Tormented Spectre",
            "Barbarous Lasher (burried)"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×4, Toxic Blossom (burried) ×2, Tormented Spectre"
        },
        {
          "index": 15,
          "label": "G96 + G86 + G20 · Spectre of Avarice ×4, Greedspawned Demon ×2",
          "x": 41.2,
          "y": 38.8,
          "killScore": 29,
          "killPercent": 10.32,
          "mobCount": 9,
          "packTags": [
            "G96",
            "G86",
            "G20"
          ],
          "enemySummary": [
            "Spectre of Avarice ×4",
            "Greedspawned Demon ×2",
            "Gilded Fiend ×2",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×4, Greedspawned Demon ×2, Gilded Fiend ×2"
        },
        {
          "index": 16,
          "label": "G65 · Lost Soul ×2, Greedspawned Demon",
          "x": 33.2,
          "y": 51.3,
          "killScore": 17,
          "killPercent": 6.05,
          "mobCount": 3,
          "packTags": [
            "G65"
          ],
          "enemySummary": [
            "Lost Soul ×2",
            "Greedspawned Demon"
          ],
          "kind": "pack",
          "notes": "Lost Soul ×2, Greedspawned Demon"
        },
        {
          "index": 17,
          "label": "Bael'Aurum",
          "x": 36.2,
          "y": 42.8,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Bael'Aurum"
          ],
          "kind": "boss",
          "notes": "Bael'Aurum"
        }
      ]
    }
  },
  "xul-the-blood-monolith": {
    "Regular": {
      "r5Code": "R5.AZufsCWiNEdHISQjVcEpJz8_RcE3Py8_J7MkQ-FRwxSFYCOF4JLEvJTEohSFgNLiDM6eY_z5T-9djT5krOk-VfnIn16uu8pGEhqP7L_XLI6dLWzSscZTxrTu6f5nXvGTS3IuvJrZqOAg2vQgojTnUcPMsvyizJIMHYXg1LySzLzUHIX8NIUSmMVJ-aV5KQruiSWpiQUeiXm6rjCVRZUgdRGlOQkXwlJBxmTnFyWWZIB1BifmJZdkpmWmpugohGUWZ-bnwcx0zi9LzUvMK2FiWAAA",
      "shareHash": "#r5=AZufsCWiNEdHISQjVcEpJz8_RcE3Py8_J7MkQ-FRwxSFYCOF4JLEvJTEohSFgNLiDM6eY_z5T-9djT5krOk-VfnIn16uu8pGEhqP7L_XLI6dLWzSscZTxrTu6f5nXvGTS3IuvJrZqOAg2vQgojTnUcPMsvyizJIMHYXg1LySzLzUHIX8NIUSmMVJ-aV5KQruiSWpiQUeiXm6rjCVRZUgdRGlOQkXwlJBxmTnFyWWZIB1BifmJZdkpmWmpugohGUWZ-bnwcx0zi9LzUvMK2FiWAAA",
      "totalScore": 260,
      "requiredScore": 260,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G63 + G43 · Stalking Grim ×4, Sanguine Echo ×3",
          "x": 46.4,
          "y": 93.2,
          "killScore": 18,
          "killPercent": 6.92,
          "mobCount": 7,
          "packTags": [
            "G63",
            "G43"
          ],
          "enemySummary": [
            "Stalking Grim ×4",
            "Sanguine Echo ×3"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×4, Sanguine Echo ×3"
        },
        {
          "index": 2,
          "label": "G48 + G6 · Sanguine Echo ×3, Ravenous Brood ×3",
          "x": 47.6,
          "y": 89.3,
          "killScore": 16,
          "killPercent": 6.15,
          "mobCount": 7,
          "packTags": [
            "G48",
            "G6"
          ],
          "enemySummary": [
            "Sanguine Echo ×3",
            "Ravenous Brood ×3",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×3, Ravenous Brood ×3, Ascended Bloodweaver"
        },
        {
          "index": 3,
          "label": "G72 + G30 · Sanguine Echo ×2, Stalking Grim ×2",
          "x": 49.6,
          "y": 89,
          "killScore": 25,
          "killPercent": 9.62,
          "mobCount": 9,
          "packTags": [
            "G72",
            "G30"
          ],
          "enemySummary": [
            "Sanguine Echo ×2",
            "Stalking Grim ×2",
            "Crimson Zealot ×2",
            "Ravenous Brood ×2",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×2, Stalking Grim ×2, Crimson Zealot ×2"
        },
        {
          "index": 4,
          "label": "G10 + G42 + G31 · Ravenous Brood ×3, Stalking Grim ×3",
          "x": 52.9,
          "y": 91.2,
          "killScore": 18,
          "killPercent": 6.92,
          "mobCount": 7,
          "packTags": [
            "G10",
            "G42",
            "G31"
          ],
          "enemySummary": [
            "Ravenous Brood ×3",
            "Stalking Grim ×3",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×3, Stalking Grim ×3, Crimson Zealot"
        },
        {
          "index": 5,
          "label": "G32 · Crimson Zealot",
          "x": 54.9,
          "y": 86.7,
          "killScore": 3,
          "killPercent": 1.15,
          "mobCount": 1,
          "packTags": [
            "G32"
          ],
          "enemySummary": [
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot"
        },
        {
          "index": 6,
          "label": "Xul’vorith, Sentinel of the Bloodbound Gate",
          "x": 53.8,
          "y": 80.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Xul’vorith, Sentinel of the Bloodbound Gate"
          ],
          "kind": "boss",
          "notes": "Xul’vorith, Sentinel of the Bloodbound Gate"
        },
        {
          "index": 7,
          "label": "G46 + G44 · Sanguine Echo ×7, Heart of Corruption",
          "x": 53.8,
          "y": 69.8,
          "killScore": 24,
          "killPercent": 9.23,
          "mobCount": 9,
          "packTags": [
            "G46",
            "G44"
          ],
          "enemySummary": [
            "Sanguine Echo ×7",
            "Heart of Corruption",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×7, Heart of Corruption, Sanguine Oracle"
        },
        {
          "index": 8,
          "label": "G34 + G69 + G55 · Crimson Zealot ×4, Sanguine Echo ×2",
          "x": 58.3,
          "y": 57.7,
          "killScore": 16,
          "killPercent": 6.15,
          "mobCount": 6,
          "packTags": [
            "G34",
            "G69",
            "G55"
          ],
          "enemySummary": [
            "Crimson Zealot ×4",
            "Sanguine Echo ×2"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×4, Sanguine Echo ×2"
        },
        {
          "index": 9,
          "label": "G4 + G52 + G66 · Sanguine Echo ×5, Ascended Bloodweaver",
          "x": 61.9,
          "y": 53.3,
          "killScore": 14,
          "killPercent": 5.38,
          "mobCount": 6,
          "packTags": [
            "G4",
            "G52",
            "G66"
          ],
          "enemySummary": [
            "Sanguine Echo ×5",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×5, Ascended Bloodweaver"
        },
        {
          "index": 10,
          "label": "G20 + G19 · Crimson Zealot ×4, Sanguine Crusher",
          "x": 60.7,
          "y": 45.7,
          "killScore": 17,
          "killPercent": 6.54,
          "mobCount": 5,
          "packTags": [
            "G20",
            "G19"
          ],
          "enemySummary": [
            "Crimson Zealot ×4",
            "Sanguine Crusher"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×4, Sanguine Crusher"
        },
        {
          "index": 11,
          "label": "G13 · Ravenous Brood ×6, Sanguine Echo ×2",
          "x": 60.3,
          "y": 41.1,
          "killScore": 21,
          "killPercent": 8.08,
          "mobCount": 9,
          "packTags": [
            "G13"
          ],
          "enemySummary": [
            "Ravenous Brood ×6",
            "Sanguine Echo ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×6, Sanguine Echo ×2, Sanguine Oracle"
        },
        {
          "index": 12,
          "label": "G23 + G73 + G54 · Crimson Zealot ×2, Ascended Bloodweaver",
          "x": 57.6,
          "y": 40,
          "killScore": 15,
          "killPercent": 5.77,
          "mobCount": 5,
          "packTags": [
            "G23",
            "G73",
            "G54"
          ],
          "enemySummary": [
            "Crimson Zealot ×2",
            "Ascended Bloodweaver",
            "Stalking Grim",
            "Sanguine Echo"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×2, Ascended Bloodweaver, Stalking Grim"
        },
        {
          "index": 13,
          "label": "G53 + G64 · Sanguine Echo ×5, Heart of Corruption",
          "x": 54.2,
          "y": 35.9,
          "killScore": 20,
          "killPercent": 7.69,
          "mobCount": 7,
          "packTags": [
            "G53",
            "G64"
          ],
          "enemySummary": [
            "Sanguine Echo ×5",
            "Heart of Corruption",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×5, Heart of Corruption, Sanguine Oracle"
        },
        {
          "index": 14,
          "label": "G39 + G29 · Crimson Zealot ×5, Stalking Grim ×3",
          "x": 51.7,
          "y": 36.8,
          "killScore": 24,
          "killPercent": 9.23,
          "mobCount": 8,
          "packTags": [
            "G39",
            "G29"
          ],
          "enemySummary": [
            "Crimson Zealot ×5",
            "Stalking Grim ×3"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×5, Stalking Grim ×3"
        },
        {
          "index": 15,
          "label": "G45 · Sanguine Echo ×2, Heart of Corruption",
          "x": 51.2,
          "y": 33.8,
          "killScore": 9,
          "killPercent": 3.46,
          "mobCount": 3,
          "packTags": [
            "G45"
          ],
          "enemySummary": [
            "Sanguine Echo ×2",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Sanguine Echo ×2, Heart of Corruption"
        },
        {
          "index": 16,
          "label": "Han-Eth, Sentry of Xul",
          "x": 51.2,
          "y": 29.5,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G2"
          ],
          "enemySummary": [
            "Han-Eth, Sentry of Xul"
          ],
          "kind": "boss",
          "notes": "Han-Eth, Sentry of Xul"
        },
        {
          "index": 17,
          "label": "G75 + G47 · Crimson Zealot ×2, Heart of Corruption ×2",
          "x": 51.5,
          "y": 10.8,
          "killScore": 20,
          "killPercent": 7.69,
          "mobCount": 6,
          "packTags": [
            "G75",
            "G47"
          ],
          "enemySummary": [
            "Crimson Zealot ×2",
            "Heart of Corruption ×2",
            "Sanguine Echo ×2"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×2, Heart of Corruption ×2, Sanguine Echo ×2"
        },
        {
          "index": 18,
          "label": "Vel’korath the Sanctified, Vision of the Covenant",
          "x": 51.2,
          "y": 3.9,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Vel’korath the Sanctified, Vision of the Covenant"
          ],
          "kind": "boss",
          "notes": "Vel’korath the Sanctified, Vision of the Covenant"
        }
      ]
    }
  },
  "scryers-peak": {
    "Regular": {
      "r5Code": "R5.AIjYI1NjcnllcidzIFBlYWsg4oCUIFMyIFN0YW5kYXJkIFB1c2gYEbhS9omNHm2rZ6QzC22YxaReq1AismP5GUHm2RdF6tN0kAFjwE92ZXJsb3JkIFZhcnV4ABcg",
      "shareHash": "#r5=AIjYI1NjcnllcidzIFBlYWsg4oCUIFMyIFN0YW5kYXJkIFB1c2gYEbhS9omNHm2rZ6QzC22YxaReq1AismP5GUHm2RdF6tN0kAFjwE92ZXJsb3JkIFZhcnV4ABcg",
      "totalScore": 160,
      "requiredScore": 160,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G45 + G49 + G22 · Ice Shardling ×2, Crimson Zealot",
          "x": 68.1,
          "y": 64,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 6,
          "packTags": [
            "G45",
            "G49",
            "G22"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Crimson Zealot",
            "Stalking Grim",
            "Ravenous Brood",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Crimson Zealot, Stalking Grim"
        },
        {
          "index": 2,
          "label": "G3 · Raging Ice Elemental ×2, Coldbrine Fiend ×2",
          "x": 76.3,
          "y": 60.3,
          "killScore": 16,
          "killPercent": 10,
          "mobCount": 4,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Raging Ice Elemental ×2",
            "Coldbrine Fiend ×2"
          ],
          "kind": "pack",
          "notes": "Raging Ice Elemental ×2, Coldbrine Fiend ×2"
        },
        {
          "index": 3,
          "label": "G46 + G21 · Coldbrine Fiend ×2, Ice Shardling ×2",
          "x": 72.4,
          "y": 50.5,
          "killScore": 13,
          "killPercent": 8.13,
          "mobCount": 5,
          "packTags": [
            "G46",
            "G21"
          ],
          "enemySummary": [
            "Coldbrine Fiend ×2",
            "Ice Shardling ×2",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Coldbrine Fiend ×2, Ice Shardling ×2, Raging Ice Elemental"
        },
        {
          "index": 4,
          "label": "G31 + G12 · Ravenous Brood ×2, Crimson Zealot",
          "x": 63.5,
          "y": 63.5,
          "killScore": 11,
          "killPercent": 6.88,
          "mobCount": 4,
          "packTags": [
            "G31",
            "G12"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Crimson Zealot",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Crimson Zealot, Ascended Bloodweaver"
        },
        {
          "index": 5,
          "label": "G16 + G29 + G32 · Stalking Grim ×3, Ravenous Brood ×2",
          "x": 51.9,
          "y": 37.7,
          "killScore": 25,
          "killPercent": 15.63,
          "mobCount": 9,
          "packTags": [
            "G16",
            "G29",
            "G32"
          ],
          "enemySummary": [
            "Stalking Grim ×3",
            "Ravenous Brood ×2",
            "Sanguine Echo ×2",
            "Crimson Zealot",
            "Sanguine Crusher"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×3, Ravenous Brood ×2, Sanguine Echo ×2"
        },
        {
          "index": 6,
          "label": "G5 + G38 · Ravenous Brood ×2, Sanguine Echo ×2",
          "x": 49.2,
          "y": 42.2,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 6,
          "packTags": [
            "G5",
            "G38"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Sanguine Echo ×2",
            "Sanguine Oracle",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Sanguine Echo ×2, Sanguine Oracle"
        },
        {
          "index": 7,
          "label": "G39 + G23 + G9 · Ice Shardling ×2, Raging Ice Elemental ×2",
          "x": 39.7,
          "y": 59.8,
          "killScore": 20,
          "killPercent": 12.5,
          "mobCount": 6,
          "packTags": [
            "G39",
            "G23",
            "G9"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Raging Ice Elemental ×2",
            "Elder Glacial Bear",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Raging Ice Elemental ×2, Elder Glacial Bear"
        },
        {
          "index": 8,
          "label": "G37 + G30 + G24 · Ravenous Brood ×2, Stalking Grim ×2",
          "x": 36.9,
          "y": 56.5,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 5,
          "packTags": [
            "G37",
            "G30",
            "G24"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Stalking Grim ×2",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Stalking Grim ×2, Heart of Corruption"
        },
        {
          "index": 9,
          "label": "G47 + G44 + G33 · Crimson Zealot ×3",
          "x": 35.9,
          "y": 51.4,
          "killScore": 9,
          "killPercent": 5.63,
          "mobCount": 3,
          "packTags": [
            "G47",
            "G44",
            "G33"
          ],
          "enemySummary": [
            "Crimson Zealot ×3"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×3"
        },
        {
          "index": 10,
          "label": "G43 + G18 + G10 · Stalking Grim ×6",
          "x": 30.2,
          "y": 51.7,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 6,
          "packTags": [
            "G43",
            "G18",
            "G10"
          ],
          "enemySummary": [
            "Stalking Grim ×6"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×6"
        },
        {
          "index": 11,
          "label": "Overlord Varux",
          "x": 13.8,
          "y": 53.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Overlord Varux"
          ],
          "kind": "boss",
          "notes": "Overlord Varux"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.AIjYbFNjcnllcidzIFBlYWsg4oCUIFMyIEdob3JuGBG4UvaJjR5tq2ekMwttmMWkXqtQIrJj-RlB5tkXRerTdJABY8BPdmVybG9yZCBWYXJ1eAAXIA",
      "shareHash": "#r5=AIjYbFNjcnllcidzIFBlYWsg4oCUIFMyIEdob3JuGBG4UvaJjR5tq2ekMwttmMWkXqtQIrJj-RlB5tkXRerTdJABY8BPdmVybG9yZCBWYXJ1eAAXIA",
      "totalScore": 160,
      "requiredScore": 160,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G45 + G49 + G22 · Ice Shardling ×2, Crimson Zealot",
          "x": 68.1,
          "y": 64,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 6,
          "packTags": [
            "G45",
            "G49",
            "G22"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Crimson Zealot",
            "Stalking Grim",
            "Ravenous Brood",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Crimson Zealot, Stalking Grim"
        },
        {
          "index": 2,
          "label": "G3 · Raging Ice Elemental ×2, Coldbrine Fiend ×2",
          "x": 76.3,
          "y": 60.3,
          "killScore": 16,
          "killPercent": 10,
          "mobCount": 4,
          "packTags": [
            "G3"
          ],
          "enemySummary": [
            "Raging Ice Elemental ×2",
            "Coldbrine Fiend ×2"
          ],
          "kind": "pack",
          "notes": "Raging Ice Elemental ×2, Coldbrine Fiend ×2"
        },
        {
          "index": 3,
          "label": "G46 + G21 · Coldbrine Fiend ×2, Ice Shardling ×2",
          "x": 72.4,
          "y": 50.5,
          "killScore": 13,
          "killPercent": 8.13,
          "mobCount": 5,
          "packTags": [
            "G46",
            "G21"
          ],
          "enemySummary": [
            "Coldbrine Fiend ×2",
            "Ice Shardling ×2",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Coldbrine Fiend ×2, Ice Shardling ×2, Raging Ice Elemental"
        },
        {
          "index": 4,
          "label": "G31 + G12 · Ravenous Brood ×2, Crimson Zealot",
          "x": 63.5,
          "y": 63.5,
          "killScore": 11,
          "killPercent": 6.88,
          "mobCount": 4,
          "packTags": [
            "G31",
            "G12"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Crimson Zealot",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Crimson Zealot, Ascended Bloodweaver"
        },
        {
          "index": 5,
          "label": "G16 + G29 + G32 · Stalking Grim ×3, Ravenous Brood ×2",
          "x": 51.9,
          "y": 37.7,
          "killScore": 25,
          "killPercent": 15.63,
          "mobCount": 9,
          "packTags": [
            "G16",
            "G29",
            "G32"
          ],
          "enemySummary": [
            "Stalking Grim ×3",
            "Ravenous Brood ×2",
            "Sanguine Echo ×2",
            "Crimson Zealot",
            "Sanguine Crusher"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×3, Ravenous Brood ×2, Sanguine Echo ×2"
        },
        {
          "index": 6,
          "label": "G5 + G38 · Ravenous Brood ×2, Sanguine Echo ×2",
          "x": 49.2,
          "y": 42.2,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 6,
          "packTags": [
            "G5",
            "G38"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Sanguine Echo ×2",
            "Sanguine Oracle",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Sanguine Echo ×2, Sanguine Oracle"
        },
        {
          "index": 7,
          "label": "G39 + G23 + G9 · Ice Shardling ×2, Raging Ice Elemental ×2",
          "x": 39.7,
          "y": 59.8,
          "killScore": 20,
          "killPercent": 12.5,
          "mobCount": 6,
          "packTags": [
            "G39",
            "G23",
            "G9"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Raging Ice Elemental ×2",
            "Elder Glacial Bear",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Raging Ice Elemental ×2, Elder Glacial Bear"
        },
        {
          "index": 8,
          "label": "G37 + G30 + G24 · Ravenous Brood ×2, Stalking Grim ×2",
          "x": 36.9,
          "y": 56.5,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 5,
          "packTags": [
            "G37",
            "G30",
            "G24"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Stalking Grim ×2",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Stalking Grim ×2, Heart of Corruption"
        },
        {
          "index": 9,
          "label": "G47 + G44 + G33 · Crimson Zealot ×3",
          "x": 35.9,
          "y": 51.4,
          "killScore": 9,
          "killPercent": 5.63,
          "mobCount": 3,
          "packTags": [
            "G47",
            "G44",
            "G33"
          ],
          "enemySummary": [
            "Crimson Zealot ×3"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot ×3"
        },
        {
          "index": 10,
          "label": "G43 + G18 + G10 · Stalking Grim ×6",
          "x": 30.2,
          "y": 51.7,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 6,
          "packTags": [
            "G43",
            "G18",
            "G10"
          ],
          "enemySummary": [
            "Stalking Grim ×6"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×6"
        },
        {
          "index": 11,
          "label": "Overlord Varux",
          "x": 13.8,
          "y": 53.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Overlord Varux"
          ],
          "kind": "boss",
          "notes": "Overlord Varux"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.AIjYaFNjcnllcidzIFBlYWsg4oCUIFMyIEVpcmEaNDBxkaci7LBQS8MQ-Zq7KKV6IippYjUu2EhOcNk3SRALBCBFaXJhIHRoZSBXaGl0ZSBXaXRjaCAoKzkwcyBCb29uKWPAT3ZlcmxvcmQgVmFydXgQC5I",
      "shareHash": "#r5=AIjYaFNjcnllcidzIFBlYWsg4oCUIFMyIEVpcmEaNDBxkaci7LBQS8MQ-Zq7KKV6IippYjUu2EhOcNk3SRALBCBFaXJhIHRoZSBXaGl0ZSBXaXRjaCAoKzkwcyBCb29uKWPAT3ZlcmxvcmQgVmFydXgQC5I",
      "totalScore": 161,
      "requiredScore": 160,
      "totalPercent": 100.63,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G19 + G14 · Dire Wolf ×2, Ice Shardling ×2",
          "x": 72,
          "y": 63.8,
          "killScore": 12,
          "killPercent": 7.5,
          "mobCount": 7,
          "packTags": [
            "G19",
            "G14"
          ],
          "enemySummary": [
            "Dire Wolf ×2",
            "Ice Shardling ×2",
            "Ravenous Brood ×2",
            "Sanguine Echo"
          ],
          "kind": "pack",
          "notes": "Dire Wolf ×2, Ice Shardling ×2, Ravenous Brood ×2"
        },
        {
          "index": 2,
          "label": "G40 + G21 · Frozen Remnant ×2, Ice Shardling ×2",
          "x": 74.3,
          "y": 51.6,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 6,
          "packTags": [
            "G40",
            "G21"
          ],
          "enemySummary": [
            "Frozen Remnant ×2",
            "Ice Shardling ×2",
            "Glacial Colossus",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Frozen Remnant ×2, Ice Shardling ×2, Glacial Colossus"
        },
        {
          "index": 3,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 76.4,
          "y": 43,
          "killScore": 20,
          "killPercent": 12.5,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 4,
          "label": "G27 + G11 · Frozen Remnant ×2, Crimson Zealot ×2",
          "x": 76.9,
          "y": 23.1,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 7,
          "packTags": [
            "G27",
            "G11"
          ],
          "enemySummary": [
            "Frozen Remnant ×2",
            "Crimson Zealot ×2",
            "Ice Shardling ×2",
            "Raging Ice Elemental"
          ],
          "kind": "pack",
          "notes": "Frozen Remnant ×2, Crimson Zealot ×2, Ice Shardling ×2"
        },
        {
          "index": 5,
          "label": "G15 · Frozen Remnant ×2, Ice Shardling ×2",
          "x": 69.2,
          "y": 20.8,
          "killScore": 4,
          "killPercent": 2.5,
          "mobCount": 4,
          "packTags": [
            "G15"
          ],
          "enemySummary": [
            "Frozen Remnant ×2",
            "Ice Shardling ×2"
          ],
          "kind": "pack",
          "notes": "Frozen Remnant ×2, Ice Shardling ×2"
        },
        {
          "index": 6,
          "label": "G8 + G35 · Ice Shardling ×3, Ravenous Brood ×2",
          "x": 65.4,
          "y": 19.8,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 8,
          "packTags": [
            "G8",
            "G35"
          ],
          "enemySummary": [
            "Ice Shardling ×3",
            "Ravenous Brood ×2",
            "Coldbrine Fiend",
            "Sanguine Echo",
            "Glacial Colossus"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×3, Ravenous Brood ×2, Coldbrine Fiend"
        },
        {
          "index": 7,
          "label": "G13 + G29 · Ravenous Brood ×4, Ice Shardling ×2",
          "x": 54.5,
          "y": 31.5,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 8,
          "packTags": [
            "G13",
            "G29"
          ],
          "enemySummary": [
            "Ravenous Brood ×4",
            "Ice Shardling ×2",
            "Crimson Zealot",
            "Sanguine Crusher"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×4, Ice Shardling ×2, Crimson Zealot"
        },
        {
          "index": 8,
          "label": "G5 · Ravenous Brood ×2, Sanguine Echo ×2",
          "x": 49.6,
          "y": 44,
          "killScore": 13,
          "killPercent": 8.13,
          "mobCount": 5,
          "packTags": [
            "G5"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Sanguine Echo ×2",
            "Sanguine Oracle"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Sanguine Echo ×2, Sanguine Oracle"
        },
        {
          "index": 9,
          "label": "G39 + G9 + G37 · Ice Shardling ×2, Raging Ice Elemental ×2",
          "x": 39.6,
          "y": 57,
          "killScore": 19,
          "killPercent": 11.88,
          "mobCount": 7,
          "packTags": [
            "G39",
            "G9",
            "G37"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Raging Ice Elemental ×2",
            "Ravenous Brood ×2",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Raging Ice Elemental ×2, Ravenous Brood ×2"
        },
        {
          "index": 10,
          "label": "G24 + G28 + G44 · Ravenous Brood ×2, Heart of Corruption",
          "x": 37.2,
          "y": 52.9,
          "killScore": 12,
          "killPercent": 7.5,
          "mobCount": 4,
          "packTags": [
            "G24",
            "G28",
            "G44"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Heart of Corruption",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Heart of Corruption, Crimson Zealot"
        },
        {
          "index": 11,
          "label": "G33 + G43 + G10 · Stalking Grim ×4, Crimson Zealot",
          "x": 32.2,
          "y": 49.8,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 5,
          "packTags": [
            "G33",
            "G43",
            "G10"
          ],
          "enemySummary": [
            "Stalking Grim ×4",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×4, Crimson Zealot"
        },
        {
          "index": 12,
          "label": "Overlord Varux",
          "x": 13.8,
          "y": 53.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Overlord Varux"
          ],
          "kind": "boss",
          "notes": "Overlord Varux"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AIjYfFNjcnllcidzIFBlYWsg4oCUIFMyIEVtcG93ZXJlZBYm4NsHxgdkR4wWszB9mMWkXpKxIbXpNDFtN0kALHhPdmVybG9yZCBWYXJ1eAAuYA",
      "shareHash": "#r5=AIjYfFNjcnllcidzIFBlYWsg4oCUIFMyIEVtcG93ZXJlZBYm4NsHxgdkR4wWszB9mMWkXpKxIbXpNDFtN0kALHhPdmVybG9yZCBWYXJ1eAAuYA",
      "totalScore": 161,
      "requiredScore": 160,
      "totalPercent": 100.63,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G45 · Crimson Zealot, Stalking Grim",
          "x": 67,
          "y": 74.9,
          "killScore": 6,
          "killPercent": 3.75,
          "mobCount": 2,
          "packTags": [
            "G45"
          ],
          "enemySummary": [
            "Crimson Zealot",
            "Stalking Grim"
          ],
          "kind": "pack",
          "notes": "Crimson Zealot, Stalking Grim"
        },
        {
          "index": 2,
          "label": "G21 + G14 · Ice Shardling ×2, Ravenous Brood ×2",
          "x": 73.9,
          "y": 54.5,
          "killScore": 27,
          "killPercent": 16.88,
          "mobCount": 6,
          "packTags": [
            "G21",
            "G14"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Ravenous Brood ×2",
            "Raging Ice Elemental",
            "Sanguine Echo"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Ravenous Brood ×2, Raging Ice Elemental"
        },
        {
          "index": 3,
          "label": "G22 + G3 · Raging Ice Elemental ×3, Ice Shardling ×2",
          "x": 73.4,
          "y": 58.9,
          "killScore": 23,
          "killPercent": 14.37,
          "mobCount": 7,
          "packTags": [
            "G22",
            "G3"
          ],
          "enemySummary": [
            "Raging Ice Elemental ×3",
            "Ice Shardling ×2",
            "Coldbrine Fiend ×2"
          ],
          "kind": "pack",
          "notes": "Raging Ice Elemental ×3, Ice Shardling ×2, Coldbrine Fiend ×2"
        },
        {
          "index": 4,
          "label": "G46 + G31 + G12 · Coldbrine Fiend ×2, Ravenous Brood ×2",
          "x": 64.7,
          "y": 60.3,
          "killScore": 17,
          "killPercent": 10.63,
          "mobCount": 6,
          "packTags": [
            "G46",
            "G31",
            "G12"
          ],
          "enemySummary": [
            "Coldbrine Fiend ×2",
            "Ravenous Brood ×2",
            "Crimson Zealot",
            "Ascended Bloodweaver"
          ],
          "kind": "pack",
          "notes": "Coldbrine Fiend ×2, Ravenous Brood ×2, Crimson Zealot"
        },
        {
          "index": 5,
          "label": "G16 + G32 · Stalking Grim ×3, Sanguine Echo ×2",
          "x": 51.9,
          "y": 37.5,
          "killScore": 16,
          "killPercent": 10,
          "mobCount": 6,
          "packTags": [
            "G16",
            "G32"
          ],
          "enemySummary": [
            "Stalking Grim ×3",
            "Sanguine Echo ×2",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×3, Sanguine Echo ×2, Crimson Zealot"
        },
        {
          "index": 6,
          "label": "G5 + G38 · Ravenous Brood ×2, Sanguine Echo ×2",
          "x": 49.2,
          "y": 42.2,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 6,
          "packTags": [
            "G5",
            "G38"
          ],
          "enemySummary": [
            "Ravenous Brood ×2",
            "Sanguine Echo ×2",
            "Sanguine Oracle",
            "Heart of Corruption"
          ],
          "kind": "pack",
          "notes": "Ravenous Brood ×2, Sanguine Echo ×2, Sanguine Oracle"
        },
        {
          "index": 7,
          "label": "G39 + G37 + G30 · Ice Shardling ×2, Raging Ice Elemental ×2",
          "x": 38.7,
          "y": 57.2,
          "killScore": 22,
          "killPercent": 13.75,
          "mobCount": 8,
          "packTags": [
            "G39",
            "G37",
            "G30"
          ],
          "enemySummary": [
            "Ice Shardling ×2",
            "Raging Ice Elemental ×2",
            "Ravenous Brood ×2",
            "Stalking Grim ×2"
          ],
          "kind": "pack",
          "notes": "Ice Shardling ×2, Raging Ice Elemental ×2, Ravenous Brood ×2"
        },
        {
          "index": 8,
          "label": "G24 + G33 + G43 · Stalking Grim ×2, Heart of Corruption",
          "x": 35.9,
          "y": 50.3,
          "killScore": 14,
          "killPercent": 8.75,
          "mobCount": 4,
          "packTags": [
            "G24",
            "G33",
            "G43"
          ],
          "enemySummary": [
            "Stalking Grim ×2",
            "Heart of Corruption",
            "Crimson Zealot"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×2, Heart of Corruption, Crimson Zealot"
        },
        {
          "index": 9,
          "label": "G18 + G10 · Stalking Grim ×4",
          "x": 27.6,
          "y": 53.5,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 4,
          "packTags": [
            "G18",
            "G10"
          ],
          "enemySummary": [
            "Stalking Grim ×4"
          ],
          "kind": "pack",
          "notes": "Stalking Grim ×4"
        },
        {
          "index": 10,
          "label": "Overlord Varux",
          "x": 13.8,
          "y": 53.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Overlord Varux"
          ],
          "kind": "boss",
          "notes": "Overlord Varux"
        }
      ]
    }
  },
  "silken-hollow": {
    "Regular": {
      "r5Code": "R5.AInYI1NpbGtlbiBIb2xsb3cg4oCUIFMyIFN0YW5kYXJkIFB1c2gYEQxdfpOEFkD4jbsfAjfMt5ts5JuBF4y2IjS-2rcppXyQAWHQVmV4aXJhLCBNb3RoZXIgb2YgTmlnaHRtYXJlcwAXIA",
      "shareHash": "#r5=AInYI1NpbGtlbiBIb2xsb3cg4oCUIFMyIFN0YW5kYXJkIFB1c2gYEQxdfpOEFkD4jbsfAjfMt5ts5JuBF4y2IjS-2rcppXyQAWHQVmV4aXJhLCBNb3RoZXIgb2YgTmlnaHRtYXJlcwAXIA",
      "totalScore": 168,
      "requiredScore": 168,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G36 + G49 + G22 · Raging Razorback ×2, Facestabber ×2",
          "x": 54.2,
          "y": 95.6,
          "killScore": 8,
          "killPercent": 4.76,
          "mobCount": 4,
          "packTags": [
            "G36",
            "G49",
            "G22"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Facestabber ×2"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Facestabber ×2"
        },
        {
          "index": 2,
          "label": "G23 · Shinchopper ×2, Facestabber ×2",
          "x": 51.8,
          "y": 95.4,
          "killScore": 14,
          "killPercent": 8.33,
          "mobCount": 7,
          "packTags": [
            "G23"
          ],
          "enemySummary": [
            "Shinchopper ×2",
            "Facestabber ×2",
            "Thornclaw Grizzly",
            "Bully Basher",
            "Gold Hoarder"
          ],
          "kind": "pack",
          "notes": "Shinchopper ×2, Facestabber ×2, Thornclaw Grizzly"
        },
        {
          "index": 3,
          "label": "G10 + G43 + G18 · Gold Hoarder ×2, Gilded Fiend ×2",
          "x": 50.7,
          "y": 84.8,
          "killScore": 22,
          "killPercent": 13.1,
          "mobCount": 9,
          "packTags": [
            "G10",
            "G43",
            "G18"
          ],
          "enemySummary": [
            "Gold Hoarder ×2",
            "Gilded Fiend ×2",
            "Facestabber ×2",
            "Spectre of Avarice",
            "Greedspawned Demon",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Gold Hoarder ×2, Gilded Fiend ×2, Facestabber ×2"
        },
        {
          "index": 4,
          "label": "G45 + G34 + G4 · Thornclaw Grizzly, Raging Razorback",
          "x": 54.4,
          "y": 72.9,
          "killScore": 9,
          "killPercent": 5.36,
          "mobCount": 3,
          "packTags": [
            "G45",
            "G34",
            "G4"
          ],
          "enemySummary": [
            "Thornclaw Grizzly",
            "Raging Razorback",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Thornclaw Grizzly, Raging Razorback, Gravesnare Kidnapper"
        },
        {
          "index": 5,
          "label": "G9 + G32 + G16 · Infected Eggbearer ×4, Gravesnare Kidnapper",
          "x": 50.5,
          "y": 67.9,
          "killScore": 19,
          "killPercent": 11.31,
          "mobCount": 7,
          "packTags": [
            "G9",
            "G32",
            "G16"
          ],
          "enemySummary": [
            "Infected Eggbearer ×4",
            "Gravesnare Kidnapper",
            "Bully Basher",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×4, Gravesnare Kidnapper, Bully Basher"
        },
        {
          "index": 6,
          "label": "G13 + G35 · Infected Eggbearer ×5, Forgotten Champion ×2",
          "x": 49.6,
          "y": 60.8,
          "killScore": 22,
          "killPercent": 13.1,
          "mobCount": 9,
          "packTags": [
            "G13",
            "G35"
          ],
          "enemySummary": [
            "Infected Eggbearer ×5",
            "Forgotten Champion ×2",
            "Speaker of Vexira",
            "Rotheart Recluse"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×5, Forgotten Champion ×2, Speaker of Vexira"
        },
        {
          "index": 7,
          "label": "G19 · Bully Basher ×2, Gravesnare Kidnapper ×2",
          "x": 50.6,
          "y": 52.4,
          "killScore": 25,
          "killPercent": 14.88,
          "mobCount": 7,
          "packTags": [
            "G19"
          ],
          "enemySummary": [
            "Bully Basher ×2",
            "Gravesnare Kidnapper ×2",
            "Rotheart Recluse ×2",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Bully Basher ×2, Gravesnare Kidnapper ×2, Rotheart Recluse ×2"
        },
        {
          "index": 8,
          "label": "G7 + G5 + G20 · Rotheart Recluse ×5, Infected Eggbearer ×2",
          "x": 47.3,
          "y": 43.1,
          "killScore": 19,
          "killPercent": 11.31,
          "mobCount": 7,
          "packTags": [
            "G7",
            "G5",
            "G20"
          ],
          "enemySummary": [
            "Rotheart Recluse ×5",
            "Infected Eggbearer ×2"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×5, Infected Eggbearer ×2"
        },
        {
          "index": 9,
          "label": "G31 + G24 + G6 · Infected Eggbearer ×3, Raging Razorback ×2",
          "x": 45.5,
          "y": 33.9,
          "killScore": 24,
          "killPercent": 14.29,
          "mobCount": 9,
          "packTags": [
            "G31",
            "G24",
            "G6"
          ],
          "enemySummary": [
            "Infected Eggbearer ×3",
            "Raging Razorback ×2",
            "Forgotten Champion ×2",
            "Gravesnare Kidnapper",
            "Bully Basher"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×3, Raging Razorback ×2, Forgotten Champion ×2"
        },
        {
          "index": 10,
          "label": "G29 + G27 · Restless Protector ×2, Forlorn Acolyte",
          "x": 46.8,
          "y": 14.3,
          "killScore": 6,
          "killPercent": 3.57,
          "mobCount": 3,
          "packTags": [
            "G29",
            "G27"
          ],
          "enemySummary": [
            "Restless Protector ×2",
            "Forlorn Acolyte"
          ],
          "kind": "pack",
          "notes": "Restless Protector ×2, Forlorn Acolyte"
        },
        {
          "index": 11,
          "label": "Vexira, Mother of Nightmares",
          "x": 47.8,
          "y": -1.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Vexira, Mother of Nightmares"
          ],
          "kind": "boss",
          "notes": "Vexira, Mother of Nightmares"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.AInYbFNpbGtlbiBIb2xsb3cg4oCUIFMyIEdob3JuGiVkQ5DyhOIrFmhkVa58ZvPJX5NwIvCR2QhA_EV6rU0r5JAFggBHaG9ybiB0aGUgQXZhbGFuY2hlICgrMjBzIEJvb24pYdBWZXhpcmEsIE1vdGhlciBvZiBOaWdodG1hcmVzIAuU",
      "shareHash": "#r5=AInYbFNpbGtlbiBIb2xsb3cg4oCUIFMyIEdob3JuGiVkQ5DyhOIrFmhkVa58ZvPJX5NwIvCR2QhA_EV6rU0r5JAFggBHaG9ybiB0aGUgQXZhbGFuY2hlICgrMjBzIEJvb24pYdBWZXhpcmEsIE1vdGhlciBvZiBOaWdodG1hcmVzIAuU",
      "totalScore": 168,
      "requiredScore": 168,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G49 · Raging Razorback",
          "x": 55,
          "y": 96.5,
          "killScore": 2,
          "killPercent": 1.19,
          "mobCount": 1,
          "packTags": [
            "G49"
          ],
          "enemySummary": [
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Raging Razorback"
        },
        {
          "index": 2,
          "label": "Ghorn the Avalanche (+20s Boon)",
          "x": 52,
          "y": 95.5,
          "killScore": 20,
          "killPercent": 11.9,
          "mobCount": 1,
          "packTags": [
            "Ghorn"
          ],
          "enemySummary": [
            "Ghorn"
          ],
          "kind": "miniboss",
          "notes": "Ghorn"
        },
        {
          "index": 3,
          "label": "G10 + G43 + G21 · Gold Hoarder ×3, Spectre of Avarice ×3",
          "x": 50.2,
          "y": 84.9,
          "killScore": 23,
          "killPercent": 13.69,
          "mobCount": 9,
          "packTags": [
            "G10",
            "G43",
            "G21"
          ],
          "enemySummary": [
            "Gold Hoarder ×3",
            "Spectre of Avarice ×3",
            "Gilded Fiend ×2",
            "Greedspawned Demon"
          ],
          "kind": "pack",
          "notes": "Gold Hoarder ×3, Spectre of Avarice ×3, Gilded Fiend ×2"
        },
        {
          "index": 4,
          "label": "G18 + G45 + G34 · Facestabber ×2, Raging Razorback ×2",
          "x": 52.7,
          "y": 79,
          "killScore": 11,
          "killPercent": 6.55,
          "mobCount": 5,
          "packTags": [
            "G18",
            "G45",
            "G34"
          ],
          "enemySummary": [
            "Facestabber ×2",
            "Raging Razorback ×2",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Facestabber ×2, Raging Razorback ×2, Thornclaw Grizzly"
        },
        {
          "index": 5,
          "label": "G4 + G2 + G9 · Gravesnare Kidnapper ×2, Facestabber ×2",
          "x": 53.8,
          "y": 69.1,
          "killScore": 12,
          "killPercent": 7.14,
          "mobCount": 4,
          "packTags": [
            "G4",
            "G2",
            "G9"
          ],
          "enemySummary": [
            "Gravesnare Kidnapper ×2",
            "Facestabber ×2"
          ],
          "kind": "pack",
          "notes": "Gravesnare Kidnapper ×2, Facestabber ×2"
        },
        {
          "index": 6,
          "label": "G32 + G13 · Infected Eggbearer ×5, Bully Basher",
          "x": 51,
          "y": 66.1,
          "killScore": 17,
          "killPercent": 10.12,
          "mobCount": 7,
          "packTags": [
            "G32",
            "G13"
          ],
          "enemySummary": [
            "Infected Eggbearer ×5",
            "Bully Basher",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×5, Bully Basher, Speaker of Vexira"
        },
        {
          "index": 7,
          "label": "G35 · Forgotten Champion ×2, Infected Eggbearer ×2",
          "x": 48.6,
          "y": 58,
          "killScore": 13,
          "killPercent": 7.74,
          "mobCount": 5,
          "packTags": [
            "G35"
          ],
          "enemySummary": [
            "Forgotten Champion ×2",
            "Infected Eggbearer ×2",
            "Rotheart Recluse"
          ],
          "kind": "pack",
          "notes": "Forgotten Champion ×2, Infected Eggbearer ×2, Rotheart Recluse"
        },
        {
          "index": 8,
          "label": "G19 · Bully Basher ×2, Gravesnare Kidnapper ×2",
          "x": 50.6,
          "y": 52.4,
          "killScore": 25,
          "killPercent": 14.88,
          "mobCount": 7,
          "packTags": [
            "G19"
          ],
          "enemySummary": [
            "Bully Basher ×2",
            "Gravesnare Kidnapper ×2",
            "Rotheart Recluse ×2",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Bully Basher ×2, Gravesnare Kidnapper ×2, Rotheart Recluse ×2"
        },
        {
          "index": 9,
          "label": "G7 + G20 + G31 · Rotheart Recluse ×3, Infected Eggbearer ×2",
          "x": 47.5,
          "y": 40.6,
          "killScore": 21,
          "killPercent": 12.5,
          "mobCount": 8,
          "packTags": [
            "G7",
            "G20",
            "G31"
          ],
          "enemySummary": [
            "Rotheart Recluse ×3",
            "Infected Eggbearer ×2",
            "Raging Razorback ×2",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×3, Infected Eggbearer ×2, Raging Razorback ×2"
        },
        {
          "index": 10,
          "label": "G24 + G6 + G44 · Infected Eggbearer ×3, Forgotten Champion ×2",
          "x": 45.3,
          "y": 30.4,
          "killScore": 17,
          "killPercent": 10.12,
          "mobCount": 7,
          "packTags": [
            "G24",
            "G6",
            "G44"
          ],
          "enemySummary": [
            "Infected Eggbearer ×3",
            "Forgotten Champion ×2",
            "Bully Basher",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×3, Forgotten Champion ×2, Bully Basher"
        },
        {
          "index": 11,
          "label": "G30 + G29 + G27 · Restless Protector ×2, Lost Soul",
          "x": 46.8,
          "y": 15.5,
          "killScore": 7,
          "killPercent": 4.17,
          "mobCount": 4,
          "packTags": [
            "G30",
            "G29",
            "G27"
          ],
          "enemySummary": [
            "Restless Protector ×2",
            "Lost Soul",
            "Forlorn Acolyte"
          ],
          "kind": "pack",
          "notes": "Restless Protector ×2, Lost Soul, Forlorn Acolyte"
        },
        {
          "index": 12,
          "label": "Vexira, Mother of Nightmares",
          "x": 47.8,
          "y": -1.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Vexira, Mother of Nightmares"
          ],
          "kind": "boss",
          "notes": "Vexira, Mother of Nightmares"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.AInYaFNpbGtlbiBIb2xsb3cg4oCUIFMyIEVpcmEaEQxdfss5FysufJNqZCcNMzeeSvybgReEjshCB-Ir1WppXyRALBCARWlyYSB0aGUgV2hpdGUgV2l0Y2ggKCs5MHMgQm9vbilh0FZleGlyYSwgTW90aGVyIG9mIE5pZ2h0bWFyZXMQC5I",
      "shareHash": "#r5=AInYaFNpbGtlbiBIb2xsb3cg4oCUIFMyIEVpcmEaEQxdfss5FysufJNqZCcNMzeeSvybgReEjshCB-Ir1WppXyRALBCARWlyYSB0aGUgV2hpdGUgV2l0Y2ggKCs5MHMgQm9vbilh0FZleGlyYSwgTW90aGVyIG9mIE5pZ2h0bWFyZXMQC5I",
      "totalScore": 168,
      "requiredScore": 168,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G36 + G49 + G22 · Raging Razorback ×2, Facestabber ×2",
          "x": 54.2,
          "y": 95.6,
          "killScore": 8,
          "killPercent": 4.76,
          "mobCount": 4,
          "packTags": [
            "G36",
            "G49",
            "G22"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Facestabber ×2"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Facestabber ×2"
        },
        {
          "index": 2,
          "label": "G47 + G23 · Gold Hoarder ×2, Shinchopper ×2",
          "x": 51.9,
          "y": 95.6,
          "killScore": 15,
          "killPercent": 8.93,
          "mobCount": 8,
          "packTags": [
            "G47",
            "G23"
          ],
          "enemySummary": [
            "Gold Hoarder ×2",
            "Shinchopper ×2",
            "Facestabber ×2",
            "Thornclaw Grizzly",
            "Bully Basher"
          ],
          "kind": "pack",
          "notes": "Gold Hoarder ×2, Shinchopper ×2, Facestabber ×2"
        },
        {
          "index": 3,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 50.1,
          "y": 86.1,
          "killScore": 20,
          "killPercent": 11.9,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 4,
          "label": "G21 + G18 + G45 · Spectre of Avarice ×2, Facestabber ×2",
          "x": 51.6,
          "y": 81.5,
          "killScore": 15,
          "killPercent": 8.93,
          "mobCount": 6,
          "packTags": [
            "G21",
            "G18",
            "G45"
          ],
          "enemySummary": [
            "Spectre of Avarice ×2",
            "Facestabber ×2",
            "Raging Razorback",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Spectre of Avarice ×2, Facestabber ×2, Raging Razorback"
        },
        {
          "index": 5,
          "label": "G34 + G4 + G9 · Gravesnare Kidnapper ×2, Raging Razorback",
          "x": 54,
          "y": 70.5,
          "killScore": 10,
          "killPercent": 5.95,
          "mobCount": 3,
          "packTags": [
            "G34",
            "G4",
            "G9"
          ],
          "enemySummary": [
            "Gravesnare Kidnapper ×2",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Gravesnare Kidnapper ×2, Raging Razorback"
        },
        {
          "index": 6,
          "label": "G32 + G13 · Infected Eggbearer ×5, Bully Basher",
          "x": 51,
          "y": 66.1,
          "killScore": 17,
          "killPercent": 10.12,
          "mobCount": 7,
          "packTags": [
            "G32",
            "G13"
          ],
          "enemySummary": [
            "Infected Eggbearer ×5",
            "Bully Basher",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×5, Bully Basher, Speaker of Vexira"
        },
        {
          "index": 7,
          "label": "G35 · Forgotten Champion ×2, Infected Eggbearer ×2",
          "x": 48.6,
          "y": 58,
          "killScore": 13,
          "killPercent": 7.74,
          "mobCount": 5,
          "packTags": [
            "G35"
          ],
          "enemySummary": [
            "Forgotten Champion ×2",
            "Infected Eggbearer ×2",
            "Rotheart Recluse"
          ],
          "kind": "pack",
          "notes": "Forgotten Champion ×2, Infected Eggbearer ×2, Rotheart Recluse"
        },
        {
          "index": 8,
          "label": "G19 · Bully Basher ×2, Gravesnare Kidnapper ×2",
          "x": 50.6,
          "y": 52.4,
          "killScore": 25,
          "killPercent": 14.88,
          "mobCount": 7,
          "packTags": [
            "G19"
          ],
          "enemySummary": [
            "Bully Basher ×2",
            "Gravesnare Kidnapper ×2",
            "Rotheart Recluse ×2",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Bully Basher ×2, Gravesnare Kidnapper ×2, Rotheart Recluse ×2"
        },
        {
          "index": 9,
          "label": "G7 + G20 + G31 · Rotheart Recluse ×3, Infected Eggbearer ×2",
          "x": 47.5,
          "y": 40.6,
          "killScore": 21,
          "killPercent": 12.5,
          "mobCount": 8,
          "packTags": [
            "G7",
            "G20",
            "G31"
          ],
          "enemySummary": [
            "Rotheart Recluse ×3",
            "Infected Eggbearer ×2",
            "Raging Razorback ×2",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×3, Infected Eggbearer ×2, Raging Razorback ×2"
        },
        {
          "index": 10,
          "label": "G24 + G6 + G44 · Infected Eggbearer ×3, Forgotten Champion ×2",
          "x": 45.3,
          "y": 30.4,
          "killScore": 17,
          "killPercent": 10.12,
          "mobCount": 7,
          "packTags": [
            "G24",
            "G6",
            "G44"
          ],
          "enemySummary": [
            "Infected Eggbearer ×3",
            "Forgotten Champion ×2",
            "Bully Basher",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×3, Forgotten Champion ×2, Bully Basher"
        },
        {
          "index": 11,
          "label": "G30 + G29 + G27 · Restless Protector ×2, Lost Soul",
          "x": 46.8,
          "y": 15.5,
          "killScore": 7,
          "killPercent": 4.17,
          "mobCount": 4,
          "packTags": [
            "G30",
            "G29",
            "G27"
          ],
          "enemySummary": [
            "Restless Protector ×2",
            "Lost Soul",
            "Forlorn Acolyte"
          ],
          "kind": "pack",
          "notes": "Restless Protector ×2, Lost Soul, Forlorn Acolyte"
        },
        {
          "index": 12,
          "label": "Vexira, Mother of Nightmares",
          "x": 47.8,
          "y": -1.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Vexira, Mother of Nightmares"
          ],
          "kind": "boss",
          "notes": "Vexira, Mother of Nightmares"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AInYfFNpbGtlbiBIb2xsb3cg4oCUIFMyIEVtcG93ZXJlZBgRDF1-k4QWQPiNux8mbzyV-TcCLwkdkIQPyVuSvkgAsOhWZXhpcmEsIE1vdGhlciBvZiBOaWdodG1hcmVzABcw",
      "shareHash": "#r5=AInYfFNpbGtlbiBIb2xsb3cg4oCUIFMyIEVtcG93ZXJlZBgRDF1-k4QWQPiNux8mbzyV-TcCLwkdkIQPyVuSvkgAsOhWZXhpcmEsIE1vdGhlciBvZiBOaWdodG1hcmVzABcw",
      "totalScore": 168,
      "requiredScore": 168,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G36 + G49 + G22 · Raging Razorback ×2, Facestabber ×2",
          "x": 54.2,
          "y": 95.6,
          "killScore": 8,
          "killPercent": 4.76,
          "mobCount": 4,
          "packTags": [
            "G36",
            "G49",
            "G22"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Facestabber ×2"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Facestabber ×2"
        },
        {
          "index": 2,
          "label": "G23 · Shinchopper ×2, Facestabber ×2",
          "x": 51.8,
          "y": 95.4,
          "killScore": 14,
          "killPercent": 8.33,
          "mobCount": 7,
          "packTags": [
            "G23"
          ],
          "enemySummary": [
            "Shinchopper ×2",
            "Facestabber ×2",
            "Thornclaw Grizzly",
            "Bully Basher",
            "Gold Hoarder"
          ],
          "kind": "pack",
          "notes": "Shinchopper ×2, Facestabber ×2, Thornclaw Grizzly"
        },
        {
          "index": 3,
          "label": "G10 + G43 + G18 · Gold Hoarder ×2, Gilded Fiend ×2",
          "x": 50.7,
          "y": 84.8,
          "killScore": 26,
          "killPercent": 15.48,
          "mobCount": 9,
          "packTags": [
            "G10",
            "G43",
            "G18"
          ],
          "enemySummary": [
            "Gold Hoarder ×2",
            "Gilded Fiend ×2",
            "Facestabber ×2",
            "Spectre of Avarice",
            "Greedspawned Demon",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Gold Hoarder ×2, Gilded Fiend ×2, Facestabber ×2"
        },
        {
          "index": 4,
          "label": "G45 + G34 + G9 · Thornclaw Grizzly, Raging Razorback",
          "x": 53.4,
          "y": 72.4,
          "killScore": 9,
          "killPercent": 5.36,
          "mobCount": 3,
          "packTags": [
            "G45",
            "G34",
            "G9"
          ],
          "enemySummary": [
            "Thornclaw Grizzly",
            "Raging Razorback",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Thornclaw Grizzly, Raging Razorback, Gravesnare Kidnapper"
        },
        {
          "index": 5,
          "label": "G32 + G13 · Infected Eggbearer ×5, Bully Basher",
          "x": 51,
          "y": 66.1,
          "killScore": 17,
          "killPercent": 10.12,
          "mobCount": 7,
          "packTags": [
            "G32",
            "G13"
          ],
          "enemySummary": [
            "Infected Eggbearer ×5",
            "Bully Basher",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×5, Bully Basher, Speaker of Vexira"
        },
        {
          "index": 6,
          "label": "G35 · Forgotten Champion ×2, Infected Eggbearer ×2",
          "x": 48.6,
          "y": 58,
          "killScore": 13,
          "killPercent": 7.74,
          "mobCount": 5,
          "packTags": [
            "G35"
          ],
          "enemySummary": [
            "Forgotten Champion ×2",
            "Infected Eggbearer ×2",
            "Rotheart Recluse"
          ],
          "kind": "pack",
          "notes": "Forgotten Champion ×2, Infected Eggbearer ×2, Rotheart Recluse"
        },
        {
          "index": 7,
          "label": "G19 · Bully Basher ×2, Gravesnare Kidnapper ×2",
          "x": 50.6,
          "y": 52.4,
          "killScore": 31,
          "killPercent": 18.45,
          "mobCount": 7,
          "packTags": [
            "G19"
          ],
          "enemySummary": [
            "Bully Basher ×2",
            "Gravesnare Kidnapper ×2",
            "Rotheart Recluse ×2",
            "Speaker of Vexira"
          ],
          "kind": "pack",
          "notes": "Bully Basher ×2, Gravesnare Kidnapper ×2, Rotheart Recluse ×2"
        },
        {
          "index": 8,
          "label": "G7 + G20 + G31 · Rotheart Recluse ×3, Infected Eggbearer ×2",
          "x": 47.5,
          "y": 40.6,
          "killScore": 27,
          "killPercent": 16.07,
          "mobCount": 8,
          "packTags": [
            "G7",
            "G20",
            "G31"
          ],
          "enemySummary": [
            "Rotheart Recluse ×3",
            "Infected Eggbearer ×2",
            "Raging Razorback ×2",
            "Gravesnare Kidnapper"
          ],
          "kind": "pack",
          "notes": "Rotheart Recluse ×3, Infected Eggbearer ×2, Raging Razorback ×2"
        },
        {
          "index": 9,
          "label": "G24 + G6 + G44 · Infected Eggbearer ×3, Forgotten Champion ×2",
          "x": 45.3,
          "y": 30.4,
          "killScore": 17,
          "killPercent": 10.12,
          "mobCount": 7,
          "packTags": [
            "G24",
            "G6",
            "G44"
          ],
          "enemySummary": [
            "Infected Eggbearer ×3",
            "Forgotten Champion ×2",
            "Bully Basher",
            "Lost Soul"
          ],
          "kind": "pack",
          "notes": "Infected Eggbearer ×3, Forgotten Champion ×2, Bully Basher"
        },
        {
          "index": 10,
          "label": "G29 · Forlorn Acolyte",
          "x": 46.2,
          "y": 16.9,
          "killScore": 6,
          "killPercent": 3.57,
          "mobCount": 1,
          "packTags": [
            "G29"
          ],
          "enemySummary": [
            "Forlorn Acolyte"
          ],
          "kind": "pack",
          "notes": "Forlorn Acolyte"
        },
        {
          "index": 11,
          "label": "Vexira, Mother of Nightmares",
          "x": 47.8,
          "y": -1.1,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Vexira, Mother of Nightmares"
          ],
          "kind": "boss",
          "notes": "Vexira, Mother of Nightmares"
        }
      ]
    }
  },
  "crown-of-the-wild": {
    "Regular": {
      "r5Code": "R5.AIrYJ0Nyb3duIG9mIHRoZSBXaWxkIOKAlCBTMiBTdGFuZGFyZCBQdXNoEfMYDpCJ--kWF_kPf4-gcjYd3JDb7v6IO0V_btVARNLCofrQUfVmQVQMeS32-mtscyKAsCj7dcA",
      "shareHash": "#r5=AIrYJ0Nyb3duIG9mIHRoZSBXaWxkIOKAlCBTMiBTdGFuZGFyZCBQdXNoEfMYDpCJ--kWF_kPf4-gcjYd3JDb7v6IO0V_btVARNLCofrQUfVmQVQMeS32-mtscyKAsCj7dcA",
      "totalScore": 136,
      "requiredScore": 135,
      "totalPercent": 100.74,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G5 + G14 + G20 · Groveblade ×9,  Spear Centurion ×6",
          "x": 48.7,
          "y": 54.3,
          "killScore": 34,
          "killPercent": 25.19,
          "mobCount": 22,
          "packTags": [
            "G5",
            "G14",
            "G20",
            "G24",
            "G32",
            "G34",
            "G39",
            "G42",
            "G43",
            "G46"
          ],
          "enemySummary": [
            "Groveblade ×9",
            " Spear Centurion ×6",
            "Raging Razorback ×2",
            "Raptor Fledgling ×2",
            "Wyldspeaker",
            "Savage Spiritualist",
            "Fangstrider"
          ],
          "kind": "pack",
          "notes": "Log segment-1."
        },
        {
          "index": 2,
          "label": "G13 + G16 + G35 · Raptor Fledgling ×5,  Spear Centurion ×2",
          "x": 60.1,
          "y": 25.6,
          "killScore": 22,
          "killPercent": 16.3,
          "mobCount": 11,
          "packTags": [
            "G13",
            "G16",
            "G35"
          ],
          "enemySummary": [
            "Raptor Fledgling ×5",
            " Spear Centurion ×2",
            "Groveblade ×2",
            "Thornclaw Grizzly",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×5,  Spear Centurion ×2, Groveblade ×2"
        },
        {
          "index": 3,
          "label": "G6 + G8 + G15 · Groveblade ×5, Raging Razorback ×5",
          "x": 48.4,
          "y": 8.2,
          "killScore": 23,
          "killPercent": 17.04,
          "mobCount": 14,
          "packTags": [
            "G6",
            "G8",
            "G15",
            "G18",
            "G28"
          ],
          "enemySummary": [
            "Groveblade ×5",
            "Raging Razorback ×5",
            " Spear Centurion ×2",
            "Savage Spiritualist",
            "Elder Stormbane"
          ],
          "kind": "pack",
          "notes": "Log segment-2."
        },
        {
          "index": 4,
          "label": "Eira · Eira",
          "x": 46.3,
          "y": 23.2,
          "killScore": 20,
          "killPercent": 14.81,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 5,
          "label": "G7 + G22 + G33 · Groveblade ×6, Raptor Fledgling ×4",
          "x": 42,
          "y": 29,
          "killScore": 35,
          "killPercent": 25.93,
          "mobCount": 18,
          "packTags": [
            "G7",
            "G22",
            "G33",
            "G37",
            "G40",
            "G41",
            "G47"
          ],
          "enemySummary": [
            "Groveblade ×6",
            "Raptor Fledgling ×4",
            " Spear Centurion ×2",
            "Wyldspeaker ×2",
            "Thornclaw Grizzly ×2",
            "Elder Stormbane",
            "Savage Spiritualist"
          ],
          "kind": "pack",
          "notes": "Log segment-3."
        },
        {
          "index": 6,
          "label": "G45 ·  Spear Centurion",
          "x": 40.6,
          "y": 17.9,
          "killScore": 2,
          "killPercent": 1.48,
          "mobCount": 1,
          "packTags": [
            "G45"
          ],
          "enemySummary": [
            " Spear Centurion"
          ],
          "kind": "pack",
          "notes": "Log segment-4."
        },
        {
          "index": 7,
          "label": "Scrofa, Wild Incarnate",
          "x": 19.4,
          "y": 16.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G48"
          ],
          "enemySummary": [
            "Scrofa, Wild Incarnate"
          ],
          "kind": "boss",
          "notes": "Log segment-5."
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.Aeu6UeNclF-ep5CfplCSkaoQnpmTovCoYYpCsJGCe0Z-UZ6MwIuLi3R7_ZbkXTOYGGr3dNXzF5HKLJbCETqmKS8nHtuadVJ6EiM3CwNYMdgIx7LEnMS85IxUBQ1tI4NiBaf8_DzNxILg5KL8tEQdiA2eecmJRXmJJakMracA",
      "shareHash": "#r5=Aeu6UeNclF-ep5CfplCSkaoQnpmTovCoYYpCsJGCe0Z-UZ6MwIuLi3R7_ZbkXTOYGGr3dNXzF5HKLJbCETqmKS8nHtuadVJ6EiM3CwNYMdgIx7LEnMS85IxUBQ1tI4NiBaf8_DzNxILg5KL8tEQdiA2eecmJRXmJJakMracA",
      "totalScore": 135,
      "requiredScore": 135,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G20 + G24 + G42 · Groveblade ×4,  Spear Centurion",
          "x": 45.8,
          "y": 62.3,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 7,
          "packTags": [
            "G20",
            "G24",
            "G42"
          ],
          "enemySummary": [
            "Groveblade ×4",
            " Spear Centurion",
            "Wyldspeaker",
            "Fangstrider"
          ],
          "kind": "pack",
          "notes": "Groveblade ×4,  Spear Centurion, Wyldspeaker"
        },
        {
          "index": 2,
          "label": "G5 + G43 + G14 ·  Spear Centurion ×3, Groveblade ×3",
          "x": 49.7,
          "y": 47.9,
          "killScore": 9,
          "killPercent": 6.67,
          "mobCount": 6,
          "packTags": [
            "G5",
            "G43",
            "G14"
          ],
          "enemySummary": [
            " Spear Centurion ×3",
            "Groveblade ×3"
          ],
          "kind": "pack",
          "notes": " Spear Centurion ×3, Groveblade ×3"
        },
        {
          "index": 3,
          "label": "G32 + G39 + G40 · Raging Razorback ×2, Raptor Fledgling ×2",
          "x": 49.9,
          "y": 38.9,
          "killScore": 13,
          "killPercent": 9.63,
          "mobCount": 6,
          "packTags": [
            "G32",
            "G39",
            "G40"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Raptor Fledgling ×2",
            "Savage Spiritualist",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Raptor Fledgling ×2, Savage Spiritualist"
        },
        {
          "index": 4,
          "label": "G41 + G17 + G21 · Groveblade ×4, Fangstrider ×2",
          "x": 50.7,
          "y": 27.3,
          "killScore": 12,
          "killPercent": 8.89,
          "mobCount": 7,
          "packTags": [
            "G41",
            "G17",
            "G21"
          ],
          "enemySummary": [
            "Groveblade ×4",
            "Fangstrider ×2",
            "Savage Spiritualist"
          ],
          "kind": "pack",
          "notes": "Groveblade ×4, Fangstrider ×2, Savage Spiritualist"
        },
        {
          "index": 5,
          "label": "G9 + G30 · Wyldspeaker,  Spear Centurion",
          "x": 52.6,
          "y": 18.7,
          "killScore": 5,
          "killPercent": 3.7,
          "mobCount": 2,
          "packTags": [
            "G9",
            "G30"
          ],
          "enemySummary": [
            "Wyldspeaker",
            " Spear Centurion"
          ],
          "kind": "pack",
          "notes": "Wyldspeaker,  Spear Centurion"
        },
        {
          "index": 6,
          "label": "G26 · Raptor Fledgling ×7, Wyldspeaker ×2",
          "x": 57,
          "y": 22,
          "killScore": 13,
          "killPercent": 9.63,
          "mobCount": 9,
          "packTags": [
            "G26"
          ],
          "enemySummary": [
            "Raptor Fledgling ×7",
            "Wyldspeaker ×2"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×7, Wyldspeaker ×2"
        },
        {
          "index": 7,
          "label": "G13 · Raptor Fledgling ×2, Thornclaw Grizzly",
          "x": 58,
          "y": 30.6,
          "killScore": 5,
          "killPercent": 3.7,
          "mobCount": 3,
          "packTags": [
            "G13"
          ],
          "enemySummary": [
            "Raptor Fledgling ×2",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×2, Thornclaw Grizzly"
        },
        {
          "index": 8,
          "label": "Ghorn the Avalanche (+20s Boon)",
          "x": 60.8,
          "y": 27.9,
          "killScore": 20,
          "killPercent": 14.81,
          "mobCount": 1,
          "packTags": [
            "Ghorn"
          ],
          "enemySummary": [
            "Ghorn"
          ],
          "kind": "miniboss",
          "notes": "Ghorn"
        },
        {
          "index": 9,
          "label": "G2 + G23 + G47 · Groveblade ×2, Thornclaw Grizzly ×2",
          "x": 46,
          "y": 24.2,
          "killScore": 13,
          "killPercent": 9.63,
          "mobCount": 5,
          "packTags": [
            "G2",
            "G23",
            "G47"
          ],
          "enemySummary": [
            "Groveblade ×2",
            "Thornclaw Grizzly ×2",
            "Feral Spiritclaw"
          ],
          "kind": "pack",
          "notes": "Groveblade ×2, Thornclaw Grizzly ×2, Feral Spiritclaw"
        },
        {
          "index": 10,
          "label": "G37 + G33 · Raptor Fledgling ×4,  Spear Centurion",
          "x": 41.9,
          "y": 28.5,
          "killScore": 6,
          "killPercent": 4.44,
          "mobCount": 5,
          "packTags": [
            "G37",
            "G33"
          ],
          "enemySummary": [
            "Raptor Fledgling ×4",
            " Spear Centurion"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×4,  Spear Centurion"
        },
        {
          "index": 11,
          "label": "G7 + G1 · Groveblade ×4, Raptor Fledgling ×3",
          "x": 36.4,
          "y": 25.2,
          "killScore": 14,
          "killPercent": 10.37,
          "mobCount": 9,
          "packTags": [
            "G7",
            "G1"
          ],
          "enemySummary": [
            "Groveblade ×4",
            "Raptor Fledgling ×3",
            " Spear Centurion",
            "Elder Stormbane"
          ],
          "kind": "pack",
          "notes": "Groveblade ×4, Raptor Fledgling ×3,  Spear Centurion"
        },
        {
          "index": 12,
          "label": "G11 + G4 · Raptor Fledgling ×6, Savage Spiritualist ×2",
          "x": 30.1,
          "y": 31.3,
          "killScore": 14,
          "killPercent": 10.37,
          "mobCount": 8,
          "packTags": [
            "G11",
            "G4"
          ],
          "enemySummary": [
            "Raptor Fledgling ×6",
            "Savage Spiritualist ×2"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×6, Savage Spiritualist ×2"
        },
        {
          "index": 13,
          "label": "Scrofa, Wild Incarnate",
          "x": 19.4,
          "y": 16.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G48"
          ],
          "enemySummary": [
            "Scrofa, Wild Incarnate"
          ],
          "kind": "boss",
          "notes": "Scrofa, Wild Incarnate"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.Aeu6UeFclF-ep5CfplCSkaoQnpmTovCoYYpCsJGCa2ZRooTA2dk5nWcncNxdk6i0qtZJzzXl1SRtp3qfa5ULM3eFH8nzUNjgBFII0Z2RWQIyoyQ5Q0FD29KgWMEpPz9PM7EgOLkoPy1RB2K8Z15yYlFeYkkqi7gKAA",
      "shareHash": "#r5=Aeu6UeFclF-ep5CfplCSkaoQnpmTovCoYYpCsJGCa2ZRooTA2dk5nWcncNxdk6i0qtZJzzXl1SRtp3qfa5ULM3eFH8nzUNjgBFII0Z2RWQIyoyQ5Q0FD29KgWMEpPz9PM7EgOLkoPy1RB2K8Z15yYlFeYkkqi7gKAA",
      "totalScore": 135,
      "requiredScore": 135,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G24 + G34 + G29 · Groveblade ×4, Wyldspeaker",
          "x": 49.1,
          "y": 61.1,
          "killScore": 12,
          "killPercent": 8.89,
          "mobCount": 7,
          "packTags": [
            "G24",
            "G34",
            "G29"
          ],
          "enemySummary": [
            "Groveblade ×4",
            "Wyldspeaker",
            " Spear Centurion",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Groveblade ×4, Wyldspeaker,  Spear Centurion"
        },
        {
          "index": 2,
          "label": "G5 + G14 + G38 · Groveblade ×4,  Spear Centurion ×2",
          "x": 51.7,
          "y": 49.4,
          "killScore": 13,
          "killPercent": 9.63,
          "mobCount": 9,
          "packTags": [
            "G5",
            "G14",
            "G38"
          ],
          "enemySummary": [
            "Groveblade ×4",
            " Spear Centurion ×2",
            "Raptor Fledgling ×2",
            "Wyldspeaker"
          ],
          "kind": "pack",
          "notes": "Groveblade ×4,  Spear Centurion ×2, Raptor Fledgling ×2"
        },
        {
          "index": 3,
          "label": "G32 + G39 + G40 · Raging Razorback ×2, Raptor Fledgling ×2",
          "x": 49.9,
          "y": 38.9,
          "killScore": 13,
          "killPercent": 9.63,
          "mobCount": 6,
          "packTags": [
            "G32",
            "G39",
            "G40"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Raptor Fledgling ×2",
            "Savage Spiritualist",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Raptor Fledgling ×2, Savage Spiritualist"
        },
        {
          "index": 4,
          "label": "G41 + G17 + G47 · Groveblade ×2, Fangstrider ×2",
          "x": 49.1,
          "y": 29.5,
          "killScore": 13,
          "killPercent": 9.63,
          "mobCount": 6,
          "packTags": [
            "G41",
            "G17",
            "G47"
          ],
          "enemySummary": [
            "Groveblade ×2",
            "Fangstrider ×2",
            "Savage Spiritualist",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Groveblade ×2, Fangstrider ×2, Savage Spiritualist"
        },
        {
          "index": 5,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 46.3,
          "y": 23.2,
          "killScore": 20,
          "killPercent": 14.81,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 6,
          "label": "G37 + G33 + G22 · Raptor Fledgling ×4, Wyldspeaker ×2",
          "x": 41.2,
          "y": 29.8,
          "killScore": 12,
          "killPercent": 8.89,
          "mobCount": 7,
          "packTags": [
            "G37",
            "G33",
            "G22"
          ],
          "enemySummary": [
            "Raptor Fledgling ×4",
            "Wyldspeaker ×2",
            " Spear Centurion"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×4, Wyldspeaker ×2,  Spear Centurion"
        },
        {
          "index": 7,
          "label": "G45 + G7 + G44 · Groveblade ×4,  Spear Centurion ×2",
          "x": 38.6,
          "y": 22.6,
          "killScore": 17,
          "killPercent": 12.59,
          "mobCount": 9,
          "packTags": [
            "G45",
            "G7",
            "G44"
          ],
          "enemySummary": [
            "Groveblade ×4",
            " Spear Centurion ×2",
            "Raging Razorback ×2",
            "Elder Stormbane"
          ],
          "kind": "pack",
          "notes": "Groveblade ×4,  Spear Centurion ×2, Raging Razorback ×2"
        },
        {
          "index": 8,
          "label": "G1 + G10 · Raptor Fledgling ×3, Groveblade ×2",
          "x": 32.2,
          "y": 16.4,
          "killScore": 19,
          "killPercent": 14.07,
          "mobCount": 9,
          "packTags": [
            "G1",
            "G10"
          ],
          "enemySummary": [
            "Raptor Fledgling ×3",
            "Groveblade ×2",
            "Raging Razorback ×2",
            "Elder Stormbane",
            "Feral Spiritclaw"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×3, Groveblade ×2, Raging Razorback ×2"
        },
        {
          "index": 9,
          "label": "G11 + G36 · Raptor Fledgling ×5, Savage Spiritualist",
          "x": 31.5,
          "y": 33.4,
          "killScore": 9,
          "killPercent": 6.67,
          "mobCount": 6,
          "packTags": [
            "G11",
            "G36"
          ],
          "enemySummary": [
            "Raptor Fledgling ×5",
            "Savage Spiritualist"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×5, Savage Spiritualist"
        },
        {
          "index": 10,
          "label": "G4 · Raptor Fledgling ×3, Savage Spiritualist",
          "x": 28.5,
          "y": 30.1,
          "killScore": 7,
          "killPercent": 5.19,
          "mobCount": 4,
          "packTags": [
            "G4"
          ],
          "enemySummary": [
            "Raptor Fledgling ×3",
            "Savage Spiritualist"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×3, Savage Spiritualist"
        },
        {
          "index": 11,
          "label": "Scrofa, Wild Incarnate",
          "x": 19.4,
          "y": 16.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G48"
          ],
          "enemySummary": [
            "Scrofa, Wild Incarnate"
          ],
          "kind": "boss",
          "notes": "Scrofa, Wild Incarnate"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AIrYI0Nyb3duIG9mIHRoZSBXaWxkIOKAlCBTMiBFbXBvd2VyZWQYEM2aeIZxxAkeJGDbpmbfubVkwZHGpGjVqyRuSACwuFNjcm9mYSwgV2lsZCBJbmNhcm5hdGUAFzA",
      "shareHash": "#r5=AIrYI0Nyb3duIG9mIHRoZSBXaWxkIOKAlCBTMiBFbXBvd2VyZWQYEM2aeIZxxAkeJGDbpmbfubVkwZHGpGjVqyRuSACwuFNjcm9mYSwgV2lsZCBJbmNhcm5hdGUAFzA",
      "totalScore": 135,
      "requiredScore": 135,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G24 + G42 + G43 · Groveblade ×2, Wyldspeaker",
          "x": 46.8,
          "y": 56.5,
          "killScore": 9,
          "killPercent": 6.67,
          "mobCount": 5,
          "packTags": [
            "G24",
            "G42",
            "G43"
          ],
          "enemySummary": [
            "Groveblade ×2",
            "Wyldspeaker",
            "Fangstrider",
            " Spear Centurion"
          ],
          "kind": "pack",
          "notes": "Groveblade ×2, Wyldspeaker, Fangstrider"
        },
        {
          "index": 2,
          "label": "G38 + G32 + G39 · Raptor Fledgling ×4, Raging Razorback ×2",
          "x": 51.9,
          "y": 44.9,
          "killScore": 22,
          "killPercent": 16.3,
          "mobCount": 9,
          "packTags": [
            "G38",
            "G32",
            "G39"
          ],
          "enemySummary": [
            "Raptor Fledgling ×4",
            "Raging Razorback ×2",
            "Wyldspeaker",
            "Groveblade",
            "Savage Spiritualist"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×4, Raging Razorback ×2, Wyldspeaker"
        },
        {
          "index": 3,
          "label": "G40 · Thornclaw Grizzly",
          "x": 48.3,
          "y": 34,
          "killScore": 3,
          "killPercent": 2.22,
          "mobCount": 1,
          "packTags": [
            "G40"
          ],
          "enemySummary": [
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Thornclaw Grizzly"
        },
        {
          "index": 4,
          "label": "G13 · Raptor Fledgling ×2, Thornclaw Grizzly",
          "x": 58,
          "y": 30.6,
          "killScore": 11,
          "killPercent": 8.15,
          "mobCount": 3,
          "packTags": [
            "G13"
          ],
          "enemySummary": [
            "Raptor Fledgling ×2",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×2, Thornclaw Grizzly"
        },
        {
          "index": 5,
          "label": "G41 + G47 · Groveblade ×2, Savage Spiritualist",
          "x": 47.7,
          "y": 31.6,
          "killScore": 9,
          "killPercent": 6.67,
          "mobCount": 4,
          "packTags": [
            "G41",
            "G47"
          ],
          "enemySummary": [
            "Groveblade ×2",
            "Savage Spiritualist",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Groveblade ×2, Savage Spiritualist, Thornclaw Grizzly"
        },
        {
          "index": 6,
          "label": "G3 + G2 · Raging Razorback ×3, Groveblade",
          "x": 44.5,
          "y": 16.4,
          "killScore": 19,
          "killPercent": 14.07,
          "mobCount": 6,
          "packTags": [
            "G3",
            "G2"
          ],
          "enemySummary": [
            "Raging Razorback ×3",
            "Groveblade",
            "Feral Spiritclaw",
            "Thornclaw Grizzly"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×3, Groveblade, Feral Spiritclaw"
        },
        {
          "index": 7,
          "label": "G37 + G22 · Raptor Fledgling ×4, Wyldspeaker ×2",
          "x": 41.1,
          "y": 29.5,
          "killScore": 10,
          "killPercent": 7.41,
          "mobCount": 6,
          "packTags": [
            "G37",
            "G22"
          ],
          "enemySummary": [
            "Raptor Fledgling ×4",
            "Wyldspeaker ×2"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×4, Wyldspeaker ×2"
        },
        {
          "index": 8,
          "label": "G7 + G1 · Groveblade ×4, Raptor Fledgling ×3",
          "x": 36.4,
          "y": 25.2,
          "killScore": 14,
          "killPercent": 10.37,
          "mobCount": 9,
          "packTags": [
            "G7",
            "G1"
          ],
          "enemySummary": [
            "Groveblade ×4",
            "Raptor Fledgling ×3",
            " Spear Centurion",
            "Elder Stormbane"
          ],
          "kind": "pack",
          "notes": "Groveblade ×4, Raptor Fledgling ×3,  Spear Centurion"
        },
        {
          "index": 9,
          "label": "G10 · Groveblade ×2, Raging Razorback ×2",
          "x": 31.7,
          "y": 12.3,
          "killScore": 16,
          "killPercent": 11.85,
          "mobCount": 6,
          "packTags": [
            "G10"
          ],
          "enemySummary": [
            "Groveblade ×2",
            "Raging Razorback ×2",
            "Elder Stormbane",
            "Feral Spiritclaw"
          ],
          "kind": "pack",
          "notes": "Groveblade ×2, Raging Razorback ×2, Elder Stormbane"
        },
        {
          "index": 10,
          "label": "G11 + G4 · Raptor Fledgling ×6, Savage Spiritualist ×2",
          "x": 30.1,
          "y": 31.3,
          "killScore": 22,
          "killPercent": 16.3,
          "mobCount": 8,
          "packTags": [
            "G11",
            "G4"
          ],
          "enemySummary": [
            "Raptor Fledgling ×6",
            "Savage Spiritualist ×2"
          ],
          "kind": "pack",
          "notes": "Raptor Fledgling ×6, Savage Spiritualist ×2"
        },
        {
          "index": 11,
          "label": "Scrofa, Wild Incarnate",
          "x": 19.4,
          "y": 16.3,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 1,
          "packTags": [
            "G48"
          ],
          "enemySummary": [
            "Scrofa, Wild Incarnate"
          ],
          "kind": "boss",
          "notes": "Scrofa, Wild Incarnate"
        }
      ]
    }
  },
  "urrak-markets": {
    "Regular": {
      "r5Code": "R5.AIvYI1VycmFrIE1hcmtldHMg4oCUIFMyIFN0YW5kYXJkIFB1c2gaEZ3b0-RXTNNI2Dd0I-9U-TZaYErEn6EzKZuc1ZnBN4S-SABYYERyYXpodWwgdGhlIEZsZXNoYnJva2VyAAuQ",
      "shareHash": "#r5=AIvYI1VycmFrIE1hcmtldHMg4oCUIFMyIFN0YW5kYXJkIFB1c2gaEZ3b0-RXTNNI2Dd0I-9U-TZaYErEn6EzKZuc1ZnBN4S-SABYYERyYXpodWwgdGhlIEZsZXNoYnJva2VyAAuQ",
      "totalScore": 160,
      "requiredScore": 160,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G52 + G43 + G31 · Skulking Cutthroat ×2, Mounted Raider ×2",
          "x": 48.8,
          "y": 79.6,
          "killScore": 17,
          "killPercent": 10.63,
          "mobCount": 5,
          "packTags": [
            "G52",
            "G43",
            "G31"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Mounted Raider ×2",
            "Vile Executioner"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Mounted Raider ×2, Vile Executioner"
        },
        {
          "index": 2,
          "label": "G4 + G73 + G17 · Raging Razorback ×2, Toxic Blossom (burried) ×2",
          "x": 48.8,
          "y": 68.1,
          "killScore": 21,
          "killPercent": 13.13,
          "mobCount": 9,
          "packTags": [
            "G4",
            "G73",
            "G17"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Toxic Blossom (burried) ×2",
            "Wild Bloom ×2",
            "Slavebind Totem",
            "Barbarous Lasher (burried)",
            "Urrak Vinetwister"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Toxic Blossom (burried) ×2, Wild Bloom ×2"
        },
        {
          "index": 3,
          "label": "G79 + G69 + G86 · Skulking Cutthroat ×2, Wild Bloom (burried)",
          "x": 51,
          "y": 61.2,
          "killScore": 10,
          "killPercent": 6.25,
          "mobCount": 4,
          "packTags": [
            "G79",
            "G69",
            "G86"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Wild Bloom (burried)",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Wild Bloom (burried), Mounted Raider"
        },
        {
          "index": 4,
          "label": "G23 + G64 + G56 · Hoofed Outrunner ×2, Mounted Raider ×2",
          "x": 49.4,
          "y": 53.8,
          "killScore": 17,
          "killPercent": 10.63,
          "mobCount": 7,
          "packTags": [
            "G23",
            "G64",
            "G56"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×2",
            "Mounted Raider ×2",
            "Raging Razorback",
            "Diabolical Hellcaller",
            "Wild Bloom (burried)"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×2, Mounted Raider ×2, Raging Razorback"
        },
        {
          "index": 5,
          "label": "G3 + G66 · Sickle ×2, Profane Defiler ×2",
          "x": 58.9,
          "y": 56.3,
          "killScore": 26,
          "killPercent": 16.25,
          "mobCount": 9,
          "packTags": [
            "G3",
            "G66"
          ],
          "enemySummary": [
            "Sickle ×2",
            "Profane Defiler ×2",
            "Skulking Cutthroat ×2",
            "Slavebind Totem",
            "Diabolical Hellcaller",
            "Hellspawned Bulgore"
          ],
          "kind": "pack",
          "notes": "Sickle ×2, Profane Defiler ×2, Skulking Cutthroat ×2"
        },
        {
          "index": 6,
          "label": "G28 · Wild Bloom (burried)",
          "x": 50.8,
          "y": 51.8,
          "killScore": 1,
          "killPercent": 0.63,
          "mobCount": 1,
          "packTags": [
            "G28"
          ],
          "enemySummary": [
            "Wild Bloom (burried)"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried)"
        },
        {
          "index": 7,
          "label": "G6 · Slavebind Totem",
          "x": 62.1,
          "y": 44.3,
          "killScore": 4,
          "killPercent": 2.5,
          "mobCount": 1,
          "packTags": [
            "G6"
          ],
          "enemySummary": [
            "Slavebind Totem"
          ],
          "kind": "pack",
          "notes": "Slavebind Totem"
        },
        {
          "index": 8,
          "label": "G7 · Slavebind Totem",
          "x": 55.7,
          "y": 25.9,
          "killScore": 4,
          "killPercent": 2.5,
          "mobCount": 1,
          "packTags": [
            "G7"
          ],
          "enemySummary": [
            "Slavebind Totem"
          ],
          "kind": "pack",
          "notes": "Slavebind Totem"
        },
        {
          "index": 9,
          "label": "G9 + G5 · Urrak Vinetwister ×3, Slavebind Totem ×2",
          "x": 37.3,
          "y": 23.1,
          "killScore": 24,
          "killPercent": 15,
          "mobCount": 9,
          "packTags": [
            "G9",
            "G5"
          ],
          "enemySummary": [
            "Urrak Vinetwister ×3",
            "Slavebind Totem ×2",
            "Toxic Blossom (burried) ×2",
            "Wild Bloom ×2"
          ],
          "kind": "pack",
          "notes": "Urrak Vinetwister ×3, Slavebind Totem ×2, Toxic Blossom (burried) ×2"
        },
        {
          "index": 10,
          "label": "G85 + G34 · Urrak Vinetwister ×2, Bloodfang Panther ×2",
          "x": 47.5,
          "y": 31.9,
          "killScore": 14,
          "killPercent": 8.75,
          "mobCount": 4,
          "packTags": [
            "G85",
            "G34"
          ],
          "enemySummary": [
            "Urrak Vinetwister ×2",
            "Bloodfang Panther ×2"
          ],
          "kind": "pack",
          "notes": "Urrak Vinetwister ×2, Bloodfang Panther ×2"
        },
        {
          "index": 11,
          "label": "G8 · Ritual Devotee ×3, Savage Hunter ×2",
          "x": 49.7,
          "y": 14.6,
          "killScore": 22,
          "killPercent": 13.75,
          "mobCount": 9,
          "packTags": [
            "G8"
          ],
          "enemySummary": [
            "Ritual Devotee ×3",
            "Savage Hunter ×2",
            "Bloodrite Chanter ×2",
            "Slavebind Totem",
            "Cruel Slaver"
          ],
          "kind": "pack",
          "notes": "Ritual Devotee ×3, Savage Hunter ×2, Bloodrite Chanter ×2"
        },
        {
          "index": 12,
          "label": "Drazhul the Fleshbroker",
          "x": 49.2,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 2,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Drazhul the Fleshbroker",
            "Slavetrader Brull"
          ],
          "kind": "boss",
          "notes": "Drazhul the Fleshbroker, Slavetrader Brull"
        }
      ]
    },
    "Ghorn": {
      "r5Code": "R5.Aeu-kRNaVJSYreCbWJSdWlKs8KhhikKwkYJ7Rn5Rnozg3DP_znLxe5x4N-PEt3kxKZl-6pEcdhJHHA3eqYR3iXksU37HG2XjPPGSft2RfR4MawQYwPoUSjJSFRzLEnMS85IzUhU0tI0MihWc8vPzNBMbXIoSqzJKc8BK3HJSizOSivKzU4sYRE8BAA",
      "shareHash": "#r5=Aeu-kRNaVJSYreCbWJSdWlKs8KhhikKwkYJ7Rn5Rnozg3DP_znLxe5x4N-PEt3kxKZl-6pEcdhJHHA3eqYR3iXksU37HG2XjPPGSft2RfR4MawQYwPoUSjJSFRzLEnMS85IzUhU0tI0MihWc8vPzNBMbXIoSqzJKc8BK3HJSizOSivKzU4sYRE8BAA",
      "totalScore": 160,
      "requiredScore": 160,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G52 + G31 + G4 · Mounted Raider ×2, Skulking Cutthroat",
          "x": 48.6,
          "y": 78,
          "killScore": 18,
          "killPercent": 11.25,
          "mobCount": 5,
          "packTags": [
            "G52",
            "G31",
            "G4"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Skulking Cutthroat",
            "Vile Executioner",
            "Slavebind Totem"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Skulking Cutthroat, Vile Executioner"
        },
        {
          "index": 2,
          "label": "G73 + G17 · Raging Razorback ×2, Toxic Blossom (burried) ×2",
          "x": 49,
          "y": 67,
          "killScore": 17,
          "killPercent": 10.63,
          "mobCount": 8,
          "packTags": [
            "G73",
            "G17"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Toxic Blossom (burried) ×2",
            "Wild Bloom ×2",
            "Barbarous Lasher (burried)",
            "Urrak Vinetwister"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Toxic Blossom (burried) ×2, Wild Bloom ×2"
        },
        {
          "index": 3,
          "label": "G69 + G86 + G23 · Skulking Cutthroat ×2, Hoofed Outrunner ×2",
          "x": 50.2,
          "y": 57.5,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 6,
          "packTags": [
            "G69",
            "G86",
            "G23"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Hoofed Outrunner ×2",
            "Mounted Raider",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Hoofed Outrunner ×2, Mounted Raider"
        },
        {
          "index": 4,
          "label": "G64 + G56 + G28 · Mounted Raider ×2, Wild Bloom (burried) ×2",
          "x": 49.8,
          "y": 52.8,
          "killScore": 12,
          "killPercent": 7.5,
          "mobCount": 5,
          "packTags": [
            "G64",
            "G56",
            "G28"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Wild Bloom (burried) ×2",
            "Diabolical Hellcaller"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Wild Bloom (burried) ×2, Diabolical Hellcaller"
        },
        {
          "index": 5,
          "label": "G63 + G80 + G70 · Wild Bloom (burried) ×3",
          "x": 46.3,
          "y": 52.3,
          "killScore": 3,
          "killPercent": 1.88,
          "mobCount": 3,
          "packTags": [
            "G63",
            "G80",
            "G70"
          ],
          "enemySummary": [
            "Wild Bloom (burried) ×3"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried) ×3"
        },
        {
          "index": 6,
          "label": "G68 + G46 + G40 · Jungle Stalker ×2, Raging Razorback ×2",
          "x": 43.3,
          "y": 43.1,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 5,
          "packTags": [
            "G68",
            "G46",
            "G40"
          ],
          "enemySummary": [
            "Jungle Stalker ×2",
            "Raging Razorback ×2",
            "Vile Executioner"
          ],
          "kind": "pack",
          "notes": "Jungle Stalker ×2, Raging Razorback ×2, Vile Executioner"
        },
        {
          "index": 7,
          "label": "G36 + G75 + G72 · Mounted Raider, Jungle Stalker",
          "x": 43.9,
          "y": 37.8,
          "killScore": 7,
          "killPercent": 4.38,
          "mobCount": 3,
          "packTags": [
            "G36",
            "G75",
            "G72"
          ],
          "enemySummary": [
            "Mounted Raider",
            "Jungle Stalker",
            "Wild Bloom (burried)"
          ],
          "kind": "pack",
          "notes": "Mounted Raider, Jungle Stalker, Wild Bloom (burried)"
        },
        {
          "index": 8,
          "label": "G82 + G12 + G87 · Wild Bloom (burried) ×3",
          "x": 43.7,
          "y": 33.6,
          "killScore": 3,
          "killPercent": 1.88,
          "mobCount": 3,
          "packTags": [
            "G82",
            "G12",
            "G87"
          ],
          "enemySummary": [
            "Wild Bloom (burried) ×3"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried) ×3"
        },
        {
          "index": 9,
          "label": "G59 + G85 + G30 · Hoofed Outrunner ×3, Hellspawned Bulgore",
          "x": 44.2,
          "y": 27.4,
          "killScore": 17,
          "killPercent": 10.63,
          "mobCount": 6,
          "packTags": [
            "G59",
            "G85",
            "G30"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×3",
            "Hellspawned Bulgore",
            "Urrak Vinetwister",
            "Skulking Cutthroat"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×3, Hellspawned Bulgore, Urrak Vinetwister"
        },
        {
          "index": 10,
          "label": "G42 + G57 · Mounted Raider ×2, Hellspawned Bulgore",
          "x": 47.6,
          "y": 21.2,
          "killScore": 10,
          "killPercent": 6.25,
          "mobCount": 3,
          "packTags": [
            "G42",
            "G57"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Hellspawned Bulgore"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Hellspawned Bulgore"
        },
        {
          "index": 11,
          "label": "Ghorn the Avalanche (+20s Boon)",
          "x": 49.2,
          "y": 14.7,
          "killScore": 20,
          "killPercent": 12.5,
          "mobCount": 1,
          "packTags": [
            "Ghorn"
          ],
          "enemySummary": [
            "Ghorn"
          ],
          "kind": "miniboss",
          "notes": "Ghorn"
        },
        {
          "index": 12,
          "label": "G74 + G65 + G34 · Skulking Cutthroat ×2, Bloodfang Panther ×2",
          "x": 49.4,
          "y": 28.3,
          "killScore": 23,
          "killPercent": 14.37,
          "mobCount": 7,
          "packTags": [
            "G74",
            "G65",
            "G34"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Bloodfang Panther ×2",
            "Hellspawned Bulgore",
            "Bloodrite Chanter",
            "Urrak Vinetwister"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Bloodfang Panther ×2, Hellspawned Bulgore"
        },
        {
          "index": 13,
          "label": "Drazhul the Fleshbroker",
          "x": 49.2,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 2,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Drazhul the Fleshbroker",
            "Slavetrader Brull"
          ],
          "kind": "boss",
          "notes": "Drazhul the Fleshbroker, Slavetrader Brull"
        }
      ]
    },
    "Eira": {
      "r5Code": "R5.Aeu-kRFaVJSYreCbWJSdWlKs8KhhikKwkYJrZlGilODc25dV4qduVlpgaD7x7548Kbn5i54Evbb2WH9S90i6cSmPq65MXoa6yfSTTNwsYC0KJRmpCuEZmSWpCuGZJckZChralgbFCk75-XmaiQ0uRYlVGaU5YEVuOanFGUlF-dmpRUzckwA",
      "shareHash": "#r5=Aeu-kRFaVJSYreCbWJSdWlKs8KhhikKwkYJrZlGilODc25dV4qduVlpgaD7x7548Kbn5i54Evbb2WH9S90i6cSmPq65MXoa6yfSTTNwsYC0KJRmpCuEZmSWpCuGZJckZChralgbFCk75-XmaiQ0uRYlVGaU5YEVuOanFGUlF-dmpRUzckwA",
      "totalScore": 160,
      "requiredScore": 160,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G52 + G43 + G55 · Skulking Cutthroat ×2, Sickle ×2",
          "x": 50.5,
          "y": 79.6,
          "killScore": 11,
          "killPercent": 6.88,
          "mobCount": 5,
          "packTags": [
            "G52",
            "G43",
            "G55"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Sickle ×2",
            "Profane Defiler"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Sickle ×2, Profane Defiler"
        },
        {
          "index": 2,
          "label": "G31 + G4 + G73 · Mounted Raider ×2, Raging Razorback ×2",
          "x": 48.5,
          "y": 74,
          "killScore": 19,
          "killPercent": 11.88,
          "mobCount": 6,
          "packTags": [
            "G31",
            "G4",
            "G73"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Raging Razorback ×2",
            "Vile Executioner",
            "Slavebind Totem"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Raging Razorback ×2, Vile Executioner"
        },
        {
          "index": 3,
          "label": "G79 + G83 + G17 · Wild Bloom (burried) ×2, Toxic Blossom (burried) ×2",
          "x": 49.6,
          "y": 66.1,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 8,
          "packTags": [
            "G79",
            "G83",
            "G17"
          ],
          "enemySummary": [
            "Wild Bloom (burried) ×2",
            "Toxic Blossom (burried) ×2",
            "Wild Bloom ×2",
            "Barbarous Lasher (burried)",
            "Urrak Vinetwister"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried) ×2, Toxic Blossom (burried) ×2, Wild Bloom ×2"
        },
        {
          "index": 4,
          "label": "G71 + G84 + G58 · Gold Hoarder ×3, Wild Bloom (burried) ×2",
          "x": 45.8,
          "y": 63.9,
          "killScore": 5,
          "killPercent": 3.13,
          "mobCount": 5,
          "packTags": [
            "G71",
            "G84",
            "G58"
          ],
          "enemySummary": [
            "Gold Hoarder ×3",
            "Wild Bloom (burried) ×2"
          ],
          "kind": "pack",
          "notes": "Gold Hoarder ×3, Wild Bloom (burried) ×2"
        },
        {
          "index": 5,
          "label": "G67 + G53 · Raging Pillager ×2, Vile Executioner",
          "x": 42.6,
          "y": 59.4,
          "killScore": 12,
          "killPercent": 7.5,
          "mobCount": 4,
          "packTags": [
            "G67",
            "G53"
          ],
          "enemySummary": [
            "Raging Pillager ×2",
            "Vile Executioner",
            "Bloodfang Panther"
          ],
          "kind": "pack",
          "notes": "Raging Pillager ×2, Vile Executioner, Bloodfang Panther"
        },
        {
          "index": 6,
          "label": "Eira the White Witch (+90s Boon)",
          "x": 45.3,
          "y": 55.2,
          "killScore": 20,
          "killPercent": 12.5,
          "mobCount": 1,
          "packTags": [
            "Eira"
          ],
          "enemySummary": [
            "Eira"
          ],
          "kind": "miniboss",
          "notes": "Eira"
        },
        {
          "index": 7,
          "label": "G22 + G51 + G68 · Gold Hoarder ×3, Spectre of Avarice ×2",
          "x": 42.2,
          "y": 52.3,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 7,
          "packTags": [
            "G22",
            "G51",
            "G68"
          ],
          "enemySummary": [
            "Gold Hoarder ×3",
            "Spectre of Avarice ×2",
            "Gilded Fiend",
            "Jungle Stalker"
          ],
          "kind": "pack",
          "notes": "Gold Hoarder ×3, Spectre of Avarice ×2, Gilded Fiend"
        },
        {
          "index": 8,
          "label": "G23 + G64 + G86 · Mounted Raider ×3, Hoofed Outrunner ×2",
          "x": 49.4,
          "y": 54.8,
          "killScore": 19,
          "killPercent": 11.88,
          "mobCount": 7,
          "packTags": [
            "G23",
            "G64",
            "G86"
          ],
          "enemySummary": [
            "Mounted Raider ×3",
            "Hoofed Outrunner ×2",
            "Raging Razorback",
            "Diabolical Hellcaller"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×3, Hoofed Outrunner ×2, Raging Razorback"
        },
        {
          "index": 9,
          "label": "G56 + G45 + G69 · Cruel Slaver ×2, Skulking Cutthroat ×2",
          "x": 52.3,
          "y": 56.6,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 6,
          "packTags": [
            "G56",
            "G45",
            "G69"
          ],
          "enemySummary": [
            "Cruel Slaver ×2",
            "Skulking Cutthroat ×2",
            "Wild Bloom (burried)",
            "Raging Razorback"
          ],
          "kind": "pack",
          "notes": "Cruel Slaver ×2, Skulking Cutthroat ×2, Wild Bloom (burried)"
        },
        {
          "index": 10,
          "label": "G66 + G28 + G26 · Skulking Cutthroat ×2, Mangy Brute ×2",
          "x": 53.6,
          "y": 48.6,
          "killScore": 14,
          "killPercent": 8.75,
          "mobCount": 6,
          "packTags": [
            "G66",
            "G28",
            "G26"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Mangy Brute ×2",
            "Wild Bloom (burried)",
            "Gorestained Butcher"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Mangy Brute ×2, Wild Bloom (burried)"
        },
        {
          "index": 11,
          "label": "G46 + G34 · Bloodfang Panther ×2, Vile Executioner",
          "x": 48.1,
          "y": 36,
          "killScore": 15,
          "killPercent": 9.38,
          "mobCount": 4,
          "packTags": [
            "G46",
            "G34"
          ],
          "enemySummary": [
            "Bloodfang Panther ×2",
            "Vile Executioner",
            "Urrak Vinetwister"
          ],
          "kind": "pack",
          "notes": "Bloodfang Panther ×2, Vile Executioner, Urrak Vinetwister"
        },
        {
          "index": 12,
          "label": "Drazhul the Fleshbroker",
          "x": 49.2,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 2,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Drazhul the Fleshbroker",
            "Slavetrader Brull"
          ],
          "kind": "boss",
          "notes": "Drazhul the Fleshbroker, Slavetrader Brull"
        }
      ]
    },
    "Empowered": {
      "r5Code": "R5.AIvYfFVycmFrIE1hcmtldHMg4oCUIFMyIEVtcG93ZXJlZBoRndvT5FdM00jYN3Rq_M7VUcmzm4pWJP0JmUzc5qzPyXyQALDARHJhemh1bCB0aGUgRmxlc2hicm9rZXIAC5g",
      "shareHash": "#r5=AIvYfFVycmFrIE1hcmtldHMg4oCUIFMyIEVtcG93ZXJlZBoRndvT5FdM00jYN3Rq_M7VUcmzm4pWJP0JmUzc5qzPyXyQALDARHJhemh1bCB0aGUgRmxlc2hicm9rZXIAC5g",
      "totalScore": 160,
      "requiredScore": 160,
      "totalPercent": 100,
      "blood": 0,
      "pulls": [
        {
          "index": 1,
          "label": "G52 + G43 + G31 · Skulking Cutthroat ×2, Mounted Raider ×2",
          "x": 48.8,
          "y": 79.6,
          "killScore": 17,
          "killPercent": 10.63,
          "mobCount": 5,
          "packTags": [
            "G52",
            "G43",
            "G31"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Mounted Raider ×2",
            "Vile Executioner"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Mounted Raider ×2, Vile Executioner"
        },
        {
          "index": 2,
          "label": "G4 + G73 + G17 · Raging Razorback ×2, Toxic Blossom (burried) ×2",
          "x": 48.8,
          "y": 68.1,
          "killScore": 21,
          "killPercent": 13.13,
          "mobCount": 9,
          "packTags": [
            "G4",
            "G73",
            "G17"
          ],
          "enemySummary": [
            "Raging Razorback ×2",
            "Toxic Blossom (burried) ×2",
            "Wild Bloom ×2",
            "Slavebind Totem",
            "Barbarous Lasher (burried)",
            "Urrak Vinetwister"
          ],
          "kind": "pack",
          "notes": "Raging Razorback ×2, Toxic Blossom (burried) ×2, Wild Bloom ×2"
        },
        {
          "index": 3,
          "label": "G79 + G69 + G86 · Skulking Cutthroat ×2, Wild Bloom (burried)",
          "x": 51,
          "y": 61.2,
          "killScore": 10,
          "killPercent": 6.25,
          "mobCount": 4,
          "packTags": [
            "G79",
            "G69",
            "G86"
          ],
          "enemySummary": [
            "Skulking Cutthroat ×2",
            "Wild Bloom (burried)",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Skulking Cutthroat ×2, Wild Bloom (burried), Mounted Raider"
        },
        {
          "index": 4,
          "label": "G23 + G15 · Hoofed Outrunner ×2, Raging Razorback",
          "x": 46.9,
          "y": 55.9,
          "killScore": 19,
          "killPercent": 11.88,
          "mobCount": 4,
          "packTags": [
            "G23",
            "G15"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×2",
            "Raging Razorback",
            "Mounted Raider"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×2, Raging Razorback, Mounted Raider"
        },
        {
          "index": 5,
          "label": "G64 + G51 · Mounted Raider ×2, Diabolical Hellcaller",
          "x": 47.1,
          "y": 53.3,
          "killScore": 19,
          "killPercent": 11.88,
          "mobCount": 4,
          "packTags": [
            "G64",
            "G51"
          ],
          "enemySummary": [
            "Mounted Raider ×2",
            "Diabolical Hellcaller",
            "Gilded Fiend"
          ],
          "kind": "pack",
          "notes": "Mounted Raider ×2, Diabolical Hellcaller, Gilded Fiend"
        },
        {
          "index": 6,
          "label": "G56 + G3 · Sickle ×2, Profane Defiler ×2",
          "x": 58.9,
          "y": 56.3,
          "killScore": 21,
          "killPercent": 13.13,
          "mobCount": 8,
          "packTags": [
            "G56",
            "G3"
          ],
          "enemySummary": [
            "Sickle ×2",
            "Profane Defiler ×2",
            "Wild Bloom (burried)",
            "Slavebind Totem",
            "Diabolical Hellcaller",
            "Hellspawned Bulgore"
          ],
          "kind": "pack",
          "notes": "Sickle ×2, Profane Defiler ×2, Wild Bloom (burried)"
        },
        {
          "index": 7,
          "label": "G28 · Wild Bloom (burried)",
          "x": 50.8,
          "y": 51.8,
          "killScore": 1,
          "killPercent": 0.63,
          "mobCount": 1,
          "packTags": [
            "G28"
          ],
          "enemySummary": [
            "Wild Bloom (burried)"
          ],
          "kind": "pack",
          "notes": "Wild Bloom (burried)"
        },
        {
          "index": 8,
          "label": "G6 · Slavebind Totem",
          "x": 62.1,
          "y": 44.3,
          "killScore": 4,
          "killPercent": 2.5,
          "mobCount": 1,
          "packTags": [
            "G6"
          ],
          "enemySummary": [
            "Slavebind Totem"
          ],
          "kind": "pack",
          "notes": "Slavebind Totem"
        },
        {
          "index": 9,
          "label": "G7 · Slavebind Totem",
          "x": 55.7,
          "y": 25.9,
          "killScore": 4,
          "killPercent": 2.5,
          "mobCount": 1,
          "packTags": [
            "G7"
          ],
          "enemySummary": [
            "Slavebind Totem"
          ],
          "kind": "pack",
          "notes": "Slavebind Totem"
        },
        {
          "index": 10,
          "label": "G9 + G5 · Urrak Vinetwister ×3, Slavebind Totem ×2",
          "x": 37.3,
          "y": 23.1,
          "killScore": 24,
          "killPercent": 15,
          "mobCount": 9,
          "packTags": [
            "G9",
            "G5"
          ],
          "enemySummary": [
            "Urrak Vinetwister ×3",
            "Slavebind Totem ×2",
            "Toxic Blossom (burried) ×2",
            "Wild Bloom ×2"
          ],
          "kind": "pack",
          "notes": "Urrak Vinetwister ×3, Slavebind Totem ×2, Toxic Blossom (burried) ×2"
        },
        {
          "index": 11,
          "label": "G85 + G59 · Hoofed Outrunner ×2, Urrak Vinetwister",
          "x": 44.3,
          "y": 28.7,
          "killScore": 20,
          "killPercent": 12.5,
          "mobCount": 4,
          "packTags": [
            "G85",
            "G59"
          ],
          "enemySummary": [
            "Hoofed Outrunner ×2",
            "Urrak Vinetwister",
            "Hellspawned Bulgore"
          ],
          "kind": "pack",
          "notes": "Hoofed Outrunner ×2, Urrak Vinetwister, Hellspawned Bulgore"
        },
        {
          "index": 12,
          "label": "Drazhul the Fleshbroker",
          "x": 49.2,
          "y": 43.2,
          "killScore": 0,
          "killPercent": 0,
          "mobCount": 2,
          "packTags": [
            "G1"
          ],
          "enemySummary": [
            "Drazhul the Fleshbroker",
            "Slavetrader Brull"
          ],
          "kind": "boss",
          "notes": "Drazhul the Fleshbroker, Slavetrader Brull"
        }
      ]
    }
  }
};
