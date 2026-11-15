import {
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Unlock,
  Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DUNGEONS, GEAR_SLOTS, HEROES } from '../domain/catalog';
import {
  FELLOWSHIP_ITEM_DATABASE,
  queryItemDatabase,
  resolveTargetGearSlot,
  type CatalogItemEntry,
  type ItemCategory,
} from '../domain/itemDatabase';
import { evaluateMemberPermissions, type OwnershipContext } from '../domain/ownership';
import { findHero } from '../domain/punchList';
import type {
  BisItemEntry,
  GearSlot,
  HeroId,
  MemberProfile,
} from '../domain/types';

interface BisGearManagerProps {
  members: readonly MemberProfile[];
  initialMemberId: string;
  ownershipCtx: OwnershipContext;
  onClaimMember: (memberId: string) => void;
  onRemoveMember: (memberId: string) => void;
  onOpenAuthModal: () => void;
  onToggleAcquired: (
    memberId: string,
    characterId: string,
    bisSetId: string,
    itemId: string
  ) => void;
  onAddBisItem: (
    memberId: string,
    characterId: string,
    bisSetId: string,
    item: Omit<BisItemEntry, 'id'>
  ) => void;
  onDeleteBisItem: (
    memberId: string,
    characterId: string,
    bisSetId: string,
    itemId: string
  ) => void;
  onAddCharacter: (memberId: string, heroId: HeroId, title: string) => void;
  onSelectActiveCharacter: (memberId: string, characterId: string) => void;
  onAddBisSet: (memberId: string, characterId: string, setName: string) => void;
  onSelectActiveBisSet: (
    memberId: string,
    characterId: string,
    bisSetId: string
  ) => void;
  onAddMember: (displayName: string, heroId: HeroId) => void;
}

const CATEGORY_OPTIONS: Array<{ value: ItemCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'Legendary', label: 'Legendaries' },
  { value: 'Weapon', label: 'Weapons' },
  { value: 'Relic', label: 'Relics' },
  { value: 'Dungeon', label: 'Dungeon Gear' },
];

function categoryBadgeStyle(category: ItemCategory): {
  background: string;
  color: string;
  border: string;
} {
  switch (category) {
    case 'Legendary':
      return {
        background: 'rgba(245, 180, 60, 0.16)',
        color: 'var(--gold-400)',
        border: '1px solid rgba(245, 180, 60, 0.35)',
      };
    case 'Relic':
      return {
        background: 'rgba(16, 185, 129, 0.15)',
        color: 'var(--jade-400)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
      };
    case 'Weapon':
      return {
        background: 'var(--steel-soft)',
        color: 'var(--steel-400)',
        border: '1px solid rgba(125, 175, 225, 0.3)',
      };
    default:
      return {
        background: 'var(--bg-elevated)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)',
      };
  }
}

export function BisGearManager({
  members,
  initialMemberId,
  ownershipCtx,
  onClaimMember,
  onRemoveMember,
  onOpenAuthModal,
  onToggleAcquired,
  onAddBisItem,
  onDeleteBisItem,
  onAddCharacter,
  onSelectActiveCharacter,
  onAddBisSet,
  onSelectActiveBisSet,
  onAddMember,
}: BisGearManagerProps) {
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId);
  const [newCharHero, setNewCharHero] = useState<HeroId>('gunde');
  const [newCharTitle, setNewCharTitle] = useState('');
  const [showAddChar, setShowAddChar] = useState(false);

  const [newSetName, setNewSetName] = useState('');
  const [showAddSet, setShowAddSet] = useState(false);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberHero, setNewMemberHero] = useState<HeroId>('sylvie');
  const [showAddMember, setShowAddMember] = useState(false);

  // Item Database Picker state
  const [dbSearch, setDbSearch] = useState('');
  const [slotFilter, setSlotFilter] = useState<GearSlot | 'all'>('all');
  const [dungeonFilter, setDungeonFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');
  const [filterForHero, setFilterForHero] = useState(true);
  const [customMode, setCustomMode] = useState(false);

  // Fallback custom entry state
  const [customSlot, setCustomSlot] = useState<GearSlot>('Head');
  const [customItemName, setCustomItemName] = useState('');
  const [customDungeonSlug, setCustomDungeonSlug] = useState<string>('stormwatch');
  const [customStats, setCustomStats] = useState('Haste +220, Critical Strike +110');
  const [customNotes, setCustomNotes] = useState('');

  const member =
    members.find((m) => m.id === selectedMemberId) ?? members[0] ?? null;

  const activeChar = member
    ? (member.characters.find((c) => c.id === member.activeCharacterId) ??
      member.characters[0])
    : undefined;
  const activeSet =
    activeChar?.bisSets.find((s) => s.id === activeChar.activeBisSetId) ??
    activeChar?.bisSets[0];
  const hero = activeChar ? findHero(activeChar.heroId) : HEROES[0];

  const matchingCatalogItems = useMemo(
    () =>
      queryItemDatabase({
        heroId: filterForHero ? hero.id : null,
        slotFilter,
        dungeonFilter,
        categoryFilter,
        search: dbSearch,
      }),
    [filterForHero, hero.id, slotFilter, dungeonFilter, categoryFilter, dbSearch]
  );

  if (!member) {
    return (
      <section className="panel">
        <div className="panel-body" style={{ padding: '28px 24px' }}>
          <h2 className="panel-title">Create Your Party to Track Gear &amp; BIS</h2>
          <p className="panel-subtitle" style={{ marginTop: 6, maxWidth: 620 }}>
            Create or join the party in the banner above to add your character and
            browse {FELLOWSHIP_ITEM_DATABASE.length}+ verified Fellowship Legendaries,
            Weapons, Set-Bonus Relics, and Dungeon Drops.
          </p>
        </div>
      </section>
    );
  }

  const perms = evaluateMemberPermissions(member, ownershipCtx);
  const existingItemNames = new Set(
    (activeSet?.items ?? []).map((it) => it.itemName.toLowerCase())
  );

  const handlePickCatalogItem = (entry: CatalogItemEntry) => {
    if (!perms.canEditBuilds || !activeChar || !activeSet) return;
    const resolvedSlot = resolveTargetGearSlot(
      entry.slot,
      activeSet.items,
      slotFilter
    );
    onAddBisItem(member.id, activeChar.id, activeSet.id, {
      slot: resolvedSlot,
      itemName: entry.name,
      dungeonSlug: entry.dungeonSlug,
      stats: entry.stats,
      acquired: false,
      notes: entry.category !== 'Dungeon' ? entry.category : undefined,
    });
  };

  const handleAddCustomItem = () => {
    if (
      !perms.canEditBuilds ||
      !activeChar ||
      !activeSet ||
      !customItemName.trim()
    ) {
      return;
    }
    onAddBisItem(member.id, activeChar.id, activeSet.id, {
      slot: customSlot,
      itemName: customItemName.trim(),
      dungeonSlug: customDungeonSlug,
      stats: customStats.trim(),
      acquired: false,
      notes: customNotes.trim() || undefined,
    });
    setCustomItemName('');
    setCustomNotes('');
  };

  const visibleItems = matchingCatalogItems.slice(0, 45);

  return (
    <div className="bis-layout">
      {/* Left Sidebar: Player & Character Switcher */}
      <aside className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Party Roster &amp; Alts</h2>
          <button
            type="button"
            id="btn-new-member"
            className="btn btn-sm"
            disabled={ownershipCtx.authEnforced && !ownershipCtx.currentUser}
            onClick={() => setShowAddMember((v) => !v)}
          >
            <Plus size={13} /> Player
          </button>
        </div>

        <div
          className="panel-body"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {showAddMember && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: 10,
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <input
                className="text-input"
                placeholder="Player Display Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <select
                className="select-control"
                aria-label="New Player Starting Hero"
                value={newMemberHero}
                onChange={(e) => setNewMemberHero(e.target.value as HeroId)}
              >
                {HEROES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.role})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (!newMemberName.trim()) return;
                  onAddMember(newMemberName.trim(), newMemberHero);
                  setNewMemberName('');
                  setShowAddMember(false);
                }}
              >
                Add to Roster
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {members.map((m) => {
              const isCurrent = m.id === member.id;
              const mPerms = evaluateMemberPermissions(m, ownershipCtx);
              const isMine =
                Boolean(ownershipCtx.currentUser?.uid) &&
                m.ownerUid === ownershipCtx.currentUser?.uid;
              return (
                <div
                  key={m.id}
                  style={{ display: 'flex', gap: 4, alignItems: 'center' }}
                >
                  <button
                    type="button"
                    id={`btn-select-member-${m.id}`}
                    className={`pull-step ${isCurrent ? 'is-selected' : ''}`}
                    style={{
                      flex: 1,
                      gridTemplateColumns: 'minmax(0, 1fr) auto',
                    }}
                    onClick={() => setSelectedMemberId(m.id)}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexWrap: 'wrap',
                        }}
                      >
                        {m.displayName}
                        {isMine && <span className="lead-tag">You</span>}
                        {mPerms.isPartyOwnerSlot && (
                          <span
                            className="lead-tag"
                            style={{
                              background: 'rgba(16, 185, 129, 0.16)',
                              color: 'var(--jade-400)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <ShieldCheck size={10} /> Owner
                          </span>
                        )}
                      </div>
                      <div
                        style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}
                      >
                        {m.characters.length} hero
                        {m.characters.length === 1 ? '' : 'es'} saved
                        {m.ownerDisplayName ? ` · ${m.ownerDisplayName}` : ''}
                      </div>
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: '0.72rem',
                        color: m.inParty ? 'var(--jade-400)' : 'var(--text-muted)',
                      }}
                    >
                      {m.inParty ? 'In Party' : 'Bench'}
                    </span>
                  </button>
                  {mPerms.canRemoveSlot && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      title={`Remove ${m.displayName} from roster`}
                      onClick={() => onRemoveMember(m.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <hr
            style={{
              border: 'none',
              borderTop: '1px solid var(--border-subtle)',
              width: '100%',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
              }}
            >
              {member.displayName}&apos;s Characters
            </span>
            {perms.canEditBuilds && (
              <button
                type="button"
                id="btn-add-character"
                className="btn btn-sm"
                onClick={() => setShowAddChar((v) => !v)}
              >
                <Plus size={12} /> Hero
              </button>
            )}
          </div>

          {showAddChar && perms.canEditBuilds && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: 10,
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <select
                className="select-control"
                value={newCharHero}
                onChange={(e) => setNewCharHero(e.target.value as HeroId)}
              >
                {HEROES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.role})
                  </option>
                ))}
              </select>
              <input
                className="text-input"
                placeholder="Spec / Role Note (optional)"
                value={newCharTitle}
                onChange={(e) => setNewCharTitle(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onAddCharacter(
                    member.id,
                    newCharHero,
                    newCharTitle.trim() || 'Alt'
                  );
                  setNewCharTitle('');
                  setShowAddChar(false);
                }}
              >
                Create Hero Profile
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {member.characters.map((ch) => {
              const chHero = findHero(ch.heroId);
              const isSelected = ch.id === activeChar?.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`pull-step ${isSelected ? 'is-selected' : ''}`}
                  style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}
                  disabled={!perms.canEditBuilds && ownershipCtx.authEnforced}
                  title={
                    perms.canEditBuilds
                      ? `Switch ${member.displayName}'s active hero`
                      : (perms.lockReason ?? undefined)
                  }
                  onClick={() => {
                    if (perms.canEditBuilds) {
                      onSelectActiveCharacter(member.id, ch.id);
                    }
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{chHero.name}</div>
                    <div
                      style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}
                    >
                      {ch.title ?? chHero.archetype}
                    </div>
                  </div>
                  <span className={`role-tag role-${chHero.role}`}>
                    {chHero.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Column: Active Character BIS Set Editor + Item Database */}
      <section className="panel">
        {ownershipCtx.authEnforced && (
          <div
            style={{
              padding: '10px 18px',
              background: perms.canEditBuilds
                ? 'rgba(16, 185, 129, 0.08)'
                : 'rgba(245, 158, 11, 0.08)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {perms.isClaimed ? (
                <Lock
                  size={14}
                  style={{
                    color: perms.canEditBuilds
                      ? 'var(--jade-400)'
                      : 'var(--amber-400)',
                  }}
                />
              ) : (
                <Unlock size={14} style={{ color: 'var(--amber-400)' }} />
              )}
              <span>
                {perms.canEditBuilds
                  ? `Signed in as owner of ${member.displayName} — character & BIS edits sync live with your party.`
                  : perms.lockReason}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {!ownershipCtx.currentUser && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onOpenAuthModal}
                >
                  <KeyRound size={13} /> Sign In
                </button>
              )}
              {perms.canClaim && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onClaimMember(member.id)}
                >
                  <CheckCircle2 size={13} /> Claim {member.displayName}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              {member.displayName} · {hero.name} BIS Sets
            </h2>
            <p className="panel-subtitle">
              Pick items from the Fellowship Item Database below; unacquired dungeon
              drops automatically rank dungeons on the Punch List.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {activeChar && (
              <select
                id="select-bis-set"
                aria-label="Active BIS Set"
                className="select-control"
                disabled={!perms.canEditBuilds}
                value={activeSet?.id ?? ''}
                onChange={(e) =>
                  onSelectActiveBisSet(member.id, activeChar.id, e.target.value)
                }
              >
                {activeChar.bisSets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.items.filter((i) => !i.acquired).length} needed)
                  </option>
                ))}
              </select>
            )}

            {perms.canEditBuilds && (
              <button
                type="button"
                id="btn-new-bis-set"
                className="btn btn-sm"
                onClick={() => setShowAddSet((v) => !v)}
              >
                <Plus size={13} /> New BIS Set
              </button>
            )}

            {activeSet?.gemGuideUrl && (
              <a
                href={activeSet.gemGuideUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm"
              >
                Gem Build <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {showAddSet && activeChar && perms.canEditBuilds && (
          <div
            style={{
              padding: '12px 18px',
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <input
              className="text-input"
              placeholder="Set Name (e.g. Season 2 Haste / Expertise Push)"
              style={{ minWidth: 280 }}
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (!newSetName.trim()) return;
                onAddBisSet(member.id, activeChar.id, newSetName.trim());
                setNewSetName('');
                setShowAddSet(false);
              }}
            >
              Create &amp; Activate Set
            </button>
          </div>
        )}

        {/* Fellowship Item Database Picker */}
        {perms.canEditBuilds && (
          <div
            style={{
              padding: '14px 18px',
              background: 'var(--bg-canvas)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}
              >
                <BookOpen size={14} style={{ color: 'var(--gold-400)' }} />
                <span>Fellowship Item Database</span>
                <span
                  className="mono"
                  style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}
                >
                  ({matchingCatalogItems.length} matches)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {!customMode && (
                  <label
                    className="party-toggle"
                    title="Only show Legendaries, Weapons, and armor usable by the active hero"
                  >
                    <input
                      type="checkbox"
                      checked={filterForHero}
                      onChange={(e) => setFilterForHero(e.target.checked)}
                    />
                    <span>Filter for {hero.name}</span>
                  </label>
                )}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCustomMode((v) => !v)}
                >
                  <Wrench size={12} />
                  {customMode ? 'Back to Item Database' : 'Custom Item'}
                </button>
              </div>
            </div>

            {!customMode ? (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(190px, 1.5fr) minmax(130px, 0.8fr) minmax(165px, 1fr)',
                    gap: 8,
                  }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search
                      size={14}
                      style={{
                        position: 'absolute',
                        left: 10,
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="input-item-db-search"
                      aria-label="Search Fellowship Item Database"
                      className="text-input"
                      style={{ width: '100%', paddingLeft: 30 }}
                      placeholder={`Search ${hero.name} legendaries, weapons, relics, or stats...`}
                      value={dbSearch}
                      onChange={(e) => setDbSearch(e.target.value)}
                    />
                  </div>

                  <select
                    id="select-item-db-slot"
                    aria-label="Filter by Gear Slot"
                    className="select-control"
                    value={slotFilter}
                    onChange={(e) =>
                      setSlotFilter(e.target.value as GearSlot | 'all')
                    }
                  >
                    <option value="all">All Slots</option>
                    {GEAR_SLOTS.map((gs) => (
                      <option key={gs} value={gs}>
                        {gs}
                      </option>
                    ))}
                  </select>

                  <select
                    id="select-item-db-dungeon"
                    aria-label="Filter by Source Dungeon"
                    className="select-control"
                    value={dungeonFilter}
                    onChange={(e) => setDungeonFilter(e.target.value)}
                  >
                    <option value="all">All Dungeon Sources</option>
                    <option value="season-2">Season 2 Pool Only</option>
                    <option value="any-dungeon">Any Dungeon (Global)</option>
                    {DUNGEONS.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                        {d.seasonStatus === 'legacy-s1' ? ' (S1)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {CATEGORY_OPTIONS.map((cat) => {
                    const active = categoryFilter === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        className={`btn btn-sm ${active ? 'btn-primary' : ''}`}
                        onClick={() => setCategoryFilter(cat.value)}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  style={{
                    maxHeight: 270,
                    overflowY: 'auto',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)',
                  }}
                >
                  {visibleItems.length === 0 ? (
                    <div
                      style={{
                        padding: '16px 14px',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      No database items matched your filters. Try clearing the
                      search box or unchecking &ldquo;Filter for {hero.name}&rdquo;.
                    </div>
                  ) : (
                    visibleItems.map((entry) => {
                      const alreadyAdded = existingItemNames.has(
                        entry.name.toLowerCase()
                      );
                      const dObj = DUNGEONS.find(
                        (d) => d.slug === entry.dungeonSlug
                      );
                      const sourceLabel =
                        entry.dungeonSlug === 'any-dungeon'
                          ? 'Any Dungeon'
                          : (dObj?.name ?? entry.dungeonSlug);
                      const resolvedTargetSlot = resolveTargetGearSlot(
                        entry.slot,
                        activeSet?.items ?? [],
                        slotFilter
                      );
                      const badge = categoryBadgeStyle(entry.category);

                      return (
                        <div
                          key={entry.id}
                          style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 12,
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ minWidth: 220, flex: '1 1 260px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                flexWrap: 'wrap',
                              }}
                            >
                              <strong style={{ fontSize: '0.86rem' }}>
                                {entry.name}
                              </strong>
                              <span
                                style={{
                                  fontSize: '0.67rem',
                                  fontFamily: 'var(--font-mono)',
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  ...badge,
                                }}
                              >
                                {entry.category}
                              </span>
                              <span
                                className="mono"
                                style={{
                                  fontSize: '0.73rem',
                                  color: 'var(--steel-400)',
                                }}
                              >
                                {resolvedTargetSlot}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '0.74rem',
                                color: 'var(--text-muted)',
                                marginTop: 2,
                              }}
                            >
                              <span style={{ color: 'var(--text-secondary)' }}>
                                {sourceLabel}
                              </span>
                              {' · '}
                              <span className="mono">{entry.stats}</span>
                              {entry.effectSummary
                                ? ` — ${entry.effectSummary}`
                                : ''}
                            </div>
                          </div>

                          <button
                            type="button"
                            className={`btn btn-sm ${
                              alreadyAdded ? 'btn-ghost' : 'btn-primary'
                            }`}
                            disabled={alreadyAdded}
                            onClick={() => handlePickCatalogItem(entry)}
                          >
                            {alreadyAdded ? (
                              <>
                                <Check size={13} /> In Set
                              </>
                            ) : (
                              <>
                                <Plus size={13} /> Add BIS
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <div className="bis-add-item-grid" style={{ padding: 0, borderBottom: 'none' }}>
                <select
                  aria-label="Gear Slot"
                  className="select-control"
                  value={customSlot}
                  onChange={(e) => setCustomSlot(e.target.value as GearSlot)}
                >
                  {GEAR_SLOTS.map((gs) => (
                    <option key={gs} value={gs}>
                      {gs}
                    </option>
                  ))}
                </select>

                <input
                  aria-label="Custom BIS Item Name"
                  className="text-input"
                  placeholder="Custom Item Name"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                />

                <select
                  aria-label="Drop Dungeon"
                  className="select-control"
                  value={customDungeonSlug}
                  onChange={(e) => setCustomDungeonSlug(e.target.value)}
                >
                  {DUNGEONS.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                  <option value="any-dungeon">Any Dungeon (Global Drop)</option>
                </select>

                <input
                  aria-label="Secondary Stats"
                  className="text-input"
                  placeholder="Stats (e.g. Haste +220, Crit +110)"
                  value={customStats}
                  onChange={(e) => setCustomStats(e.target.value)}
                />

                <button
                  type="button"
                  id="btn-add-bis-item"
                  className="btn btn-primary"
                  onClick={handleAddCustomItem}
                >
                  <Plus size={14} /> Add Custom
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="bis-slots-table">
            <thead>
              <tr>
                <th style={{ width: 64 }}>Looted</th>
                <th style={{ width: 105 }}>Slot</th>
                <th>BIS Item</th>
                <th>Source Dungeon</th>
                <th>Secondary Stats</th>
                <th style={{ width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {!activeSet || activeSet.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '20px 18px',
                      color: 'var(--text-muted)',
                      fontSize: '0.82rem',
                    }}
                  >
                    No BIS items added to <strong>{activeSet?.name ?? 'this set'}</strong>{' '}
                    yet. Click <strong>+ Add BIS</strong> on any item in the Fellowship
                    Item Database above to populate your checklist.
                  </td>
                </tr>
              ) : (
                activeSet.items.map((item) => {
                  const dName =
                    item.dungeonSlug === 'any-dungeon'
                      ? 'Any Dungeon'
                      : (DUNGEONS.find((d) => d.slug === item.dungeonSlug)?.name ??
                        item.dungeonSlug);
                  return (
                    <tr
                      key={item.id}
                      style={{ opacity: item.acquired ? 0.55 : 1 }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={item.acquired}
                          disabled={!perms.canToggleLootAndParty}
                          onChange={() =>
                            activeChar &&
                            activeSet &&
                            onToggleAcquired(
                              member.id,
                              activeChar.id,
                              activeSet.id,
                              item.id
                            )
                          }
                        />
                      </td>
                      <td
                        className="mono"
                        style={{ color: 'var(--steel-400)', fontSize: '0.79rem' }}
                      >
                        {item.slot}
                      </td>
                      <td>
                        <strong
                          style={{
                            textDecoration: item.acquired ? 'line-through' : 'none',
                          }}
                        >
                          {item.itemName}
                        </strong>
                        {item.notes && (
                          <span className="lead-tag" style={{ marginLeft: 8 }}>
                            {item.notes}
                          </span>
                        )}
                      </td>
                      <td>{dName}</td>
                      <td
                        className="mono"
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {item.stats}
                      </td>
                      <td>
                        {perms.canEditBuilds && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            title="Remove item"
                            onClick={() =>
                              activeChar &&
                              activeSet &&
                              onDeleteBisItem(
                                member.id,
                                activeChar.id,
                                activeSet.id,
                                item.id
                              )
                            }
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
