import {
  Check,
  Compass,
  Copy,
  KeyRound,
  ListChecks,
  RotateCcw,
  Shield,
  Trophy,
  UserCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AuthAccountModal } from './components/AuthAccountModal';
import { BisGearManager } from './components/BisGearManager';
import { EternalScoreView } from './components/EternalScoreView';
import type { PlannerSyncPayload } from './components/MethodRouteEmbed';
import { PartyRosterBar } from './components/PartyRosterBar';
import { PunchListSplash } from './components/PunchListSplash';
import { RoutePlannerView } from './components/RoutePlannerView';
import { BUILT_IN_ROUTES, DUNGEONS } from './domain/catalog';
import {
  claimMemberSlot,
  evaluateMemberPermissions,
  releaseMemberSlot,
  resolveMemberIdForUser,
  type OwnershipContext,
} from './domain/ownership';
import {
  computeDungeonPunchList,
  resolveRoutesForDungeon,
  selectBestRoute,
} from './domain/punchList';
import type {
  BisItemEntry,
  BossVariant,
  HeroId,
  PullNode,
  RoutePlan,
} from './domain/types';
import { useFirebaseAuth } from './services/authService';
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
  const [manualMemberId, setManualMemberId] = useState<string>(readInitialIdentity);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const auth = useFirebaseAuth();

  const {
    state,
    online,
    status,
    syncBackend,
    syncError,
    clearSyncError,
    setIsWatchingLogs,
    commitState,
    sendPing,
    ingestCombatLines,
    resetRoomToSeed,
  } = usePartyRoom(roomId, manualMemberId, auth.user);

  const ownedMemberId = useMemo(
    () => resolveMemberIdForUser(state.members, auth.user?.uid),
    [state.members, auth.user?.uid]
  );

  const myMemberId = ownedMemberId ?? manualMemberId;

  const ownershipCtx: OwnershipContext = useMemo(
    () => ({
      authEnforced: auth.isFirebaseConfigured,
      currentUser: auth.user,
      leadMemberId: state.leadMemberId,
      members: state.members,
    }),
    [auth.isFirebaseConfigured, auth.user, state.leadMemberId, state.members]
  );

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

  const handleClaimMember = (memberId: string) => {
    const user = auth.user;
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setManualMemberId(memberId);
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? claimMemberSlot(m, user) : m
      ),
    }));
  };

  const handleReleaseMember = (memberId: string) => {
    const uid = auth.user?.uid;
    if (!uid) return;
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? releaseMemberSlot(m, uid) : m
      ),
    }));
  };

  const handleToggleAllowLeadLoot = (memberId: string) => {
    commitState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId
          ? { ...m, allowPartyLeadLootCheck: !(m.allowPartyLeadLootCheck ?? true) }
          : m
      ),
    }));
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
        activeRouteR5: chosen?.r5Code ?? null,
        activeRoutePulls: chosen?.pulls ?? null,
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
    const target = state.members.find((m) => m.id === memberId);
    if (target) {
      const perms = evaluateMemberPermissions(target, ownershipCtx);
      if (!perms.canToggleLootAndParty) {
        setAuthModalOpen(true);
        return;
      }
    }

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
          ownerUid: auth.user?.uid ?? null,
          ownerDisplayName: auth.user?.displayName ?? null,
          ownerProvider: auth.user?.provider ?? null,
          ownerPhotoUrl: auth.user?.photoUrl ?? null,
          allowPartyLeadLootCheck: true,
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
      activeRouteR5: created.r5Code ?? null,
      activeRoutePulls: created.pulls ?? null,
      activePullIndex: 1,
      customRoutes: [created, ...prev.customRoutes],
    }));
  };

  const handlePlannerStateChange = (payload: PlannerSyncPayload) => {
    commitState((prev) => {
      const currentDungeon =
        DUNGEONS.find((d) => d.slug === prev.activeDungeonSlug) ?? DUNGEONS[0];
      if (currentDungeon.levelId !== payload.dungeonId) return prev;

      const mergedRoutes = [...prev.customRoutes, ...BUILT_IN_ROUTES];
      const currentRoute =
        mergedRoutes.find((r) => r.id === prev.activeRouteId) ??
        selectBestRoute(mergedRoutes, currentDungeon.slug, prev.activeVariant);

      const baselineR5 = prev.activeRouteR5 ?? currentRoute?.r5Code ?? '';
      const hasPullSummary = Boolean(
        (prev.activeRoutePulls && prev.activeRoutePulls.length > 0) ||
          (currentRoute?.pulls && currentRoute.pulls.length > 0)
      );

      if (payload.r5Code === baselineR5 && hasPullSummary) {
        return prev;
      }

      return {
        ...prev,
        activeRouteR5: payload.r5Code,
        activeRoutePulls: payload.pulls,
      };
    });
  };

  const handleSaveEditedRoute = (payload: {
    label: string;
    r5Code: string;
    pulls: PullNode[];
    shareUrl: string;
  }) => {
    const created: RoutePlan = {
      id: `custom-${Date.now().toString(36)}`,
      dungeonSlug: activeDungeon.slug,
      variant: state.activeVariant,
      label: payload.label,
      methodUrl: payload.shareUrl,
      r5Code: payload.r5Code,
      pulls: payload.pulls,
      sourceTag: 'Custom',
    };
    commitState((prev) => ({
      ...prev,
      activeRouteId: created.id,
      activeRouteR5: created.r5Code ?? null,
      activeRoutePulls: created.pulls ?? null,
      customRoutes: [created, ...prev.customRoutes],
    }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-cluster">
          <img
            src={`${import.meta.env.BASE_URL}fellowshipper-mark.svg`}
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
              {status === 'connected'
                ? `${Math.max(1, online.length)} ${syncBackend === 'firebase' ? 'GCP' : 'online'}`
                : 'PWA'}
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

          {!auth.isFirebaseConfigured ? (
            <>
              <select
                id="select-my-identity"
                aria-label="Active Player Profile"
                className="select-control"
                value={myMemberId}
                onChange={(e) => setManualMemberId(e.target.value)}
              >
                {state.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    Profile: {m.displayName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                id="btn-open-cloud-auth"
                className="btn btn-sm"
                onClick={() => setAuthModalOpen(true)}
                title="Configure GCP Firebase Google & Discord Login"
              >
                <KeyRound size={13} /> GCP Auth
              </button>
            </>
          ) : auth.user ? (
            <button
              type="button"
              id="btn-open-account"
              className="btn btn-sm"
              onClick={() => setAuthModalOpen(true)}
              title="Manage account & claimed character slot"
            >
              <UserCheck size={13} style={{ color: 'var(--jade-400)' }} />
              {auth.user.displayName}
              {ownedMemberId
                ? ` · ${
                    state.members.find((m) => m.id === ownedMemberId)?.displayName ??
                    ownedMemberId
                  }`
                : ' · Claim Slot'}
            </button>
          ) : (
            <button
              type="button"
              id="btn-sign-in-topbar"
              className="btn btn-primary btn-sm"
              onClick={() => setAuthModalOpen(true)}
            >
              <KeyRound size={13} />{' '}
              {auth.isGoogleAuthEnabled ? 'Sign In (Discord / Google)' : 'Sign In with Discord'}
            </button>
          )}

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

      {syncError && (
        <div
          style={{
            margin: '8px 20px 0',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(245, 158, 11, 0.14)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
          }}
        >
          <span>{syncError}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {auth.isFirebaseConfigured && !auth.user && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  clearSyncError();
                  setAuthModalOpen(true);
                }}
              >
                Sign In
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={clearSyncError}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <PartyRosterBar
        members={state.members}
        leadMemberId={state.leadMemberId}
        myMemberId={myMemberId}
        online={online}
        ownershipCtx={ownershipCtx}
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
            activeRouteR5={state.activeRouteR5}
            activeRoutePulls={state.activeRoutePulls}
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
            onPlannerStateChange={handlePlannerStateChange}
            onSaveEditedRoute={handleSaveEditedRoute}
            onOpenFullRoutes={() => setActiveTab('routes')}
          />
        )}

        {activeTab === 'routes' && (
          <RoutePlannerView
            activeDungeon={activeDungeon}
            availableRoutes={availableRoutes}
            activeRoute={activeRoute}
            activeRouteR5={state.activeRouteR5}
            activeRoutePulls={state.activeRoutePulls}
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
                activeRouteR5: chosen?.r5Code ?? null,
                activeRoutePulls: chosen?.pulls ?? null,
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
            onPlannerStateChange={handlePlannerStateChange}
            onSaveEditedRoute={handleSaveEditedRoute}
            onAddCustomRoute={addCustomRoute}
          />
        )}

        {activeTab === 'bis' && (
          <BisGearManager
            members={state.members}
            initialMemberId={myMemberId}
            ownershipCtx={ownershipCtx}
            onClaimMember={handleClaimMember}
            onOpenAuthModal={() => setAuthModalOpen(true)}
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

      <AuthAccountModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        auth={auth}
        members={state.members}
        ownershipCtx={ownershipCtx}
        onClaimMember={handleClaimMember}
        onReleaseMember={handleReleaseMember}
        onToggleAllowLeadLoot={handleToggleAllowLeadLoot}
      />
    </div>
  );
}

export default App;
