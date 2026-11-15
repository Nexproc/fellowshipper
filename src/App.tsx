import {
  Check,
  Compass,
  Copy,
  ListChecks,
  RotateCcw,
  Shield,
  Trophy,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BisGearManager } from './components/BisGearManager';
import { EternalScoreView } from './components/EternalScoreView';
import { PartyRosterBar } from './components/PartyRosterBar';
import { PunchListSplash } from './components/PunchListSplash';
import { RoutePlannerView } from './components/RoutePlannerView';
import { BUILT_IN_ROUTES, DUNGEONS } from './domain/catalog';
import {
  computeDungeonPunchList,
  resolveRoutesForDungeon,
  selectBestRoute,
} from './domain/punchList';
import type { BisItemEntry, BossVariant, HeroId, RoutePlan } from './domain/types';
import { useCombatLogWatcher } from './services/combatLogWatcher';
import { usePartyRoom } from './services/partySyncClient';

type ActiveTab = 'punch-list' | 'routes' | 'bis' | 'eternal';

function readInitialRoom(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('room') || 'stronghold';
}

function readInitialIdentity(): string {
  try {
    return localStorage.getItem('fellowshipper:identity') || 'nick';
  } catch {
    return 'nick';
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('punch-list');
  const [roomId, setRoomId] = useState<string>(readInitialRoom);
  const [roomDraft, setRoomDraft] = useState<string>(roomId);
  const [myMemberId, setMyMemberId] = useState<string>(readInitialIdentity);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const {
    state,
    online,
    status,
    setIsWatchingLogs,
    commitState,
    sendPing,
    ingestCombatLines,
    resetRoomToSeed,
  } = usePartyRoom(roomId, myMemberId);

  const watcher = useCombatLogWatcher(ingestCombatLines, setIsWatchingLogs);

  useEffect(() => {
    try {
      localStorage.setItem('fellowshipper:identity', myMemberId);
    } catch {
      // Ignore storage error
    }
  }, [myMemberId]);

  const punch = useMemo(
    () => computeDungeonPunchList(state.members, DUNGEONS),
    [state.members]
  );

  const activeDungeon = useMemo(
    () =>
      DUNGEONS.find((d) => d.slug === state.activeDungeonSlug) ?? DUNGEONS[0],
    [state.activeDungeonSlug]
  );

  const allRoutes = useMemo(
    () => [...state.customRoutes, ...BUILT_IN_ROUTES],
    [state.customRoutes]
  );

  const availableRoutes = useMemo(
    () =>
      resolveRoutesForDungeon(
        BUILT_IN_ROUTES,
        state.customRoutes,
        activeDungeon.slug
      ),
    [state.customRoutes, activeDungeon.slug]
  );

  const activeRoute = useMemo(() => {
    const byId = availableRoutes.find((r) => r.id === state.activeRouteId);
    if (byId) return byId;
    return selectBestRoute(allRoutes, activeDungeon.slug, state.activeVariant);
  }, [availableRoutes, allRoutes, activeDungeon.slug, state.activeRouteId, state.activeVariant]);

  const handleCopyInvite = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    void navigator.clipboard?.writeText(url.toString());
    setCopiedInvite(true);
    window.setTimeout(() => setCopiedInvite(false), 1800);
  };

  const syncDungeonAndVariant = (
    dungeonSlug: string,
    preferredVariant?: BossVariant,
    levelOverride?: number
  ) => {
    commitState((prev) => {
      const variant = preferredVariant ?? prev.activeVariant;
      const mergedRoutes = [...prev.customRoutes, ...BUILT_IN_ROUTES];
      const chosen = selectBestRoute(mergedRoutes, dungeonSlug, variant);
      return {
        ...prev,
        activeDungeonSlug: dungeonSlug,
        activeVariant: chosen?.variant ?? variant,
        activeRouteId: chosen?.id ?? prev.activeRouteId,
        activePullIndex: 1,
        plannedEternalLevel: levelOverride ?? prev.plannedEternalLevel,
      };
    });
  };

  const toggleItemAcquired = (
    memberId: string,
    characterId: string,
    bisSetId: string,
    itemId: string
  ) => {
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id !== memberId
          ? m
          : {
              ...m,
              characters: m.characters.map((ch) =>
                ch.id !== characterId
                  ? ch
                  : {
                      ...ch,
                      bisSets: ch.bisSets.map((bs) =>
                        bs.id !== bisSetId
                          ? bs
                          : {
                              ...bs,
                              items: bs.items.map((it) =>
                                it.id !== itemId
                                  ? it
                                  : { ...it, acquired: !it.acquired }
                              ),
                            }
                      ),
                    }
              ),
            }
      ),
    }));
  };

  const addBisItem = (
    memberId: string,
    characterId: string,
    bisSetId: string,
    item: Omit<BisItemEntry, 'id'>
  ) => {
    const newEntry: BisItemEntry = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id !== memberId
          ? m
          : {
              ...m,
              characters: m.characters.map((ch) =>
                ch.id !== characterId
                  ? ch
                  : {
                      ...ch,
                      bisSets: ch.bisSets.map((bs) =>
                        bs.id !== bisSetId
                          ? bs
                          : { ...bs, items: [newEntry, ...bs.items] }
                      ),
                    }
              ),
            }
      ),
    }));
  };

  const deleteBisItem = (
    memberId: string,
    characterId: string,
    bisSetId: string,
    itemId: string
  ) => {
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id !== memberId
          ? m
          : {
              ...m,
              characters: m.characters.map((ch) =>
                ch.id !== characterId
                  ? ch
                  : {
                      ...ch,
                      bisSets: ch.bisSets.map((bs) =>
                        bs.id !== bisSetId
                          ? bs
                          : {
                              ...bs,
                              items: bs.items.filter((it) => it.id !== itemId),
                            }
                      ),
                    }
              ),
            }
      ),
    }));
  };

  const addCharacter = (memberId: string, heroId: HeroId, title: string) => {
    const charId = `${memberId}-${heroId}-${Date.now().toString(36)}`;
    const setId = `${charId}-bis-1`;
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id !== memberId
          ? m
          : {
              ...m,
              activeCharacterId: charId,
              characters: [
                ...m.characters,
                {
                  id: charId,
                  heroId,
                  title,
                  activeBisSetId: setId,
                  bisSets: [{ id: setId, name: 'Primary BIS Set', items: [] }],
                },
              ],
            }
      ),
    }));
  };

  const addBisSet = (memberId: string, characterId: string, setName: string) => {
    const setId = `set-${Date.now().toString(36)}`;
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id !== memberId
          ? m
          : {
              ...m,
              characters: m.characters.map((ch) =>
                ch.id !== characterId
                  ? ch
                  : {
                      ...ch,
                      activeBisSetId: setId,
                      bisSets: [
                        ...ch.bisSets,
                        { id: setId, name: setName, items: [] },
                      ],
                    }
              ),
            }
      ),
    }));
  };

  const addMember = (displayName: string, heroId: HeroId) => {
    const id = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `p-${Date.now()}`;
    const charId = `${id}-${heroId}`;
    const setId = `${charId}-bis`;
    commitState((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id,
          displayName,
          inParty: false,
          activeCharacterId: charId,
          characters: [
            {
              id: charId,
              heroId,
              title: 'Main',
              activeBisSetId: setId,
              bisSets: [{ id: setId, name: 'Season 3 BIS', items: [] }],
            },
          ],
        },
      ],
    }));
  };

  const addCustomRoute = (route: Omit<RoutePlan, 'id' | 'sourceTag'>) => {
    const created: RoutePlan = {
      ...route,
      id: `custom-${Date.now().toString(36)}`,
      sourceTag: 'Custom',
    };
    commitState((prev) => ({
      ...prev,
      activeDungeonSlug: created.dungeonSlug,
      activeVariant: created.variant,
      activeRouteId: created.id,
      customRoutes: [created, ...prev.customRoutes],
    }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-cluster">
          <img
            src="/fellowshipper-mark.svg"
            alt=""
            className="brand-mark"
          />
          <div>
            <h1 className="brand-title">Fellowshipper</h1>
            <p className="brand-subtitle">
              4-Player Party Punch List, Synced Dungeon Routes &amp; CombatLogs Radar
            </p>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Primary Views">
          <button
            type="button"
            id="tab-punch-list"
            className={`nav-tab ${activeTab === 'punch-list' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('punch-list')}
          >
            <ListChecks size={15} />
            Punch List
            <span className="tab-count">{punch.totalPartyItemsNeeded}</span>
          </button>

          <button
            type="button"
            id="tab-routes"
            className={`nav-tab ${activeTab === 'routes' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            <Compass size={15} />
            Synced Routes
          </button>

          <button
            type="button"
            id="tab-bis"
            className={`nav-tab ${activeTab === 'bis' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('bis')}
          >
            <Shield size={15} />
            Gear &amp; BIS
          </button>

          <button
            type="button"
            id="tab-eternal"
            className={`nav-tab ${activeTab === 'eternal' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('eternal')}
          >
            <Trophy size={15} />
            10k Score
          </button>
        </nav>

        <div className="session-controls">
          <div className="room-badge">
            <span
              className={`status-dot ${
                status === 'connected' ? 'is-online' : 'is-local'
              }`}
            />
            <span style={{ color: 'var(--text-muted)' }}>Room</span>
            <input
              id="input-room-code"
              aria-label="Party Room Code"
              className="room-input"
              value={roomDraft}
              onChange={(e) => setRoomDraft(e.target.value)}
              onBlur={() => {
                if (roomDraft.trim()) setRoomId(roomDraft.trim().toLowerCase());
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && roomDraft.trim()) {
                  setRoomId(roomDraft.trim().toLowerCase());
                }
              }}
            />
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {status === 'connected' ? `${Math.max(1, online.length)} online` : 'PWA'}
            </span>
          </div>

          <button
            type="button"
            id="btn-copy-room-link"
            className="btn btn-sm"
            onClick={handleCopyInvite}
            title="Copy room invite URL for Discord"
          >
            {copiedInvite ? <Check size={13} /> : <Copy size={13} />}
            {copiedInvite ? 'Copied' : 'Invite'}
          </button>

          <select
            id="select-my-identity"
            aria-label="Active Player Profile"
            className="select-control"
            value={myMemberId}
            onChange={(e) => setMyMemberId(e.target.value)}
          >
            {state.members.map((m) => (
              <option key={m.id} value={m.id}>
                Profile: {m.displayName}
              </option>
            ))}
          </select>

          <button
            type="button"
            id="btn-reset-seed"
            className="btn btn-ghost btn-sm"
            onClick={resetRoomToSeed}
            title="Restore initial spreadsheet seed data"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </header>

      <PartyRosterBar
        members={state.members}
        leadMemberId={state.leadMemberId}
        myMemberId={myMemberId}
        online={online}
        onToggleInParty={(memberId) =>
          commitState((prev) => ({
            ...prev,
            members: prev.members.map((m) =>
              m.id === memberId ? { ...m, inParty: !m.inParty } : m
            ),
          }))
        }
        onSelectCharacter={(memberId, characterId) =>
          commitState((prev) => ({
            ...prev,
            members: prev.members.map((m) =>
              m.id === memberId ? { ...m, activeCharacterId: characterId } : m
            ),
          }))
        }
        onSetLead={(memberId) =>
          commitState((prev) => ({ ...prev, leadMemberId: memberId }))
        }
      />

      <main>
        {activeTab === 'punch-list' && (
          <PunchListSplash
            punch={punch}
            activeDungeon={activeDungeon}
            activeRoute={activeRoute}
            activeVariant={state.activeVariant}
            activePullIndex={state.activePullIndex}
            plannedEternalLevel={state.plannedEternalLevel}
            liveRun={state.liveRun}
            pings={state.pings}
            watcher={watcher}
            onSyncDungeonRoute={(slug, variant) => syncDungeonAndVariant(slug, variant)}
            onToggleItemAcquired={toggleItemAcquired}
            onSelectPull={(idx) =>
              commitState((prev) => ({ ...prev, activePullIndex: idx }))
            }
            onPingMap={sendPing}
            onOpenFullRoutes={() => setActiveTab('routes')}
          />
        )}

        {activeTab === 'routes' && (
          <RoutePlannerView
            activeDungeon={activeDungeon}
            availableRoutes={availableRoutes}
            activeRoute={activeRoute}
            activeVariant={state.activeVariant}
            activePullIndex={state.activePullIndex}
            plannedEternalLevel={state.plannedEternalLevel}
            autoFollowLogLead={state.autoFollowLogLead}
            liveRun={state.liveRun}
            pings={state.pings}
            watcher={watcher}
            onSelectDungeon={(slug) => syncDungeonAndVariant(slug)}
            onSelectVariant={(variant) =>
              syncDungeonAndVariant(activeDungeon.slug, variant)
            }
            onSelectRouteId={(routeId) => {
              const chosen = availableRoutes.find((r) => r.id === routeId);
              commitState((prev) => ({
                ...prev,
                activeRouteId: routeId,
                activeVariant: chosen?.variant ?? prev.activeVariant,
                activePullIndex: 1,
              }));
            }}
            onSetEternalLevel={(level) =>
              commitState((prev) => ({ ...prev, plannedEternalLevel: level }))
            }
            onToggleAutoFollow={() =>
              commitState((prev) => ({
                ...prev,
                autoFollowLogLead: !prev.autoFollowLogLead,
              }))
            }
            onSelectPull={(idx) =>
              commitState((prev) => ({ ...prev, activePullIndex: idx }))
            }
            onPingMap={sendPing}
            onAddCustomRoute={addCustomRoute}
          />
        )}

        {activeTab === 'bis' && (
          <BisGearManager
            members={state.members}
            initialMemberId={myMemberId}
            onToggleAcquired={toggleItemAcquired}
            onAddBisItem={addBisItem}
            onDeleteBisItem={deleteBisItem}
            onAddCharacter={addCharacter}
            onSelectActiveCharacter={(memberId, characterId) =>
              commitState((prev) => ({
                ...prev,
                members: prev.members.map((m) =>
                  m.id === memberId ? { ...m, activeCharacterId: characterId } : m
                ),
              }))
            }
            onAddBisSet={addBisSet}
            onSelectActiveBisSet={(memberId, characterId, bisSetId) =>
              commitState((prev) => ({
                ...prev,
                members: prev.members.map((m) =>
                  m.id !== memberId
                    ? m
                    : {
                        ...m,
                        characters: m.characters.map((ch) =>
                          ch.id === characterId
                            ? { ...ch, activeBisSetId: bisSetId }
                            : ch
                        ),
                      }
                ),
              }))
            }
            onAddMember={addMember}
          />
        )}

        {activeTab === 'eternal' && (
          <EternalScoreView
            checklist={state.eternalChecklist}
            onToggleFinished={(slug) =>
              commitState((prev) => ({
                ...prev,
                eternalChecklist: prev.eternalChecklist.map((r) =>
                  r.dungeonSlug === slug ? { ...r, finished: !r.finished } : r
                ),
              }))
            }
            onUpdateScore={(slug, currentScore) =>
              commitState((prev) => ({
                ...prev,
                eternalChecklist: prev.eternalChecklist.map((r) =>
                  r.dungeonSlug === slug ? { ...r, currentScore } : r
                ),
              }))
            }
            onUpdateTargetLevel={(slug, targetLevel) =>
              commitState((prev) => ({
                ...prev,
                eternalChecklist: prev.eternalChecklist.map((r) =>
                  r.dungeonSlug === slug ? { ...r, targetLevel } : r
                ),
              }))
            }
            onSyncRoute={(slug, variant, level) => {
              syncDungeonAndVariant(slug, variant, level);
              setActiveTab('routes');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
