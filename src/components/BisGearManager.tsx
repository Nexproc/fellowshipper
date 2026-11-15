import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DUNGEONS, GEAR_SLOTS, HEROES } from '../domain/catalog';
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

export function BisGearManager({
  members,
  initialMemberId,
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
  const [showAddMember, setShowAddMember] = useState(false);

  const [slot, setSlot] = useState<GearSlot>('Head');
  const [itemName, setItemName] = useState('');
  const [dungeonSlug, setDungeonSlug] = useState<string>('ransack-of-drakheim');
  const [stats, setStats] = useState('Critical Strike +180, Haste +150');
  const [notes, setNotes] = useState('');

  const member =
    members.find((m) => m.id === selectedMemberId) ?? members[0];
  const activeChar =
    member.characters.find((c) => c.id === member.activeCharacterId) ??
    member.characters[0];
  const activeSet =
    activeChar?.bisSets.find((s) => s.id === activeChar.activeBisSetId) ??
    activeChar?.bisSets[0];
  const hero = activeChar ? findHero(activeChar.heroId) : HEROES[0];

  const handleAddItem = () => {
    if (!activeChar || !activeSet || !itemName.trim()) return;
    onAddBisItem(member.id, activeChar.id, activeSet.id, {
      slot,
      itemName: itemName.trim(),
      dungeonSlug,
      stats: stats.trim(),
      acquired: false,
      notes: notes.trim() || undefined,
    });
    setItemName('');
    setNotes('');
  };

  return (
    <div className="bis-layout">
      {/* Left Sidebar: Player & Character Switcher */}
      <aside className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Party Roster & Alts</h2>
          <button
            type="button"
            id="btn-new-member"
            className="btn btn-sm"
            onClick={() => setShowAddMember((v) => !v)}
          >
            <Plus size={13} /> Player
          </button>
        </div>

        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {showAddMember && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 10, background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
              <input
                className="text-input"
                placeholder="Friend's Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (!newMemberName.trim()) return;
                  onAddMember(newMemberName.trim(), 'vigour');
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
              return (
                <button
                  key={m.id}
                  type="button"
                  id={`btn-select-member-${m.id}`}
                  className={`pull-step ${isCurrent ? 'is-selected' : ''}`}
                  style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}
                  onClick={() => setSelectedMemberId(m.id)}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.displayName}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                      {m.characters.length} hero{m.characters.length === 1 ? '' : 'es'} saved
                    </div>
                  </div>
                  <span className="mono" style={{ fontSize: '0.72rem', color: m.inParty ? 'var(--jade-400)' : 'var(--text-muted)' }}>
                    {m.inParty ? 'In Party' : 'Bench'}
                  </span>
                </button>
              );
            })}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', width: '100%' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {member.displayName}&apos;s Characters
            </span>
            <button
              type="button"
              id="btn-add-character"
              className="btn btn-sm"
              onClick={() => setShowAddChar((v) => !v)}
            >
              <Plus size={12} /> Hero
            </button>
          </div>

          {showAddChar && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 10, background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
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
                  onAddCharacter(member.id, newCharHero, newCharTitle.trim() || 'Alt');
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
                  onClick={() => onSelectActiveCharacter(member.id, ch.id)}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{chHero.name}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                      {ch.title ?? chHero.archetype}
                    </div>
                  </div>
                  <span className={`role-tag role-${chHero.role}`}>{chHero.role}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Column: Active Character BIS Set Editor */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              {member.displayName} · {hero.name} BIS Sets
            </h2>
            <p className="panel-subtitle">
              Active set feeds directly into the Splash Page Dungeon Punch List when{' '}
              {member.displayName} is marked In Party.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {activeChar && (
              <select
                id="select-bis-set"
                aria-label="Active BIS Set"
                className="select-control"
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

            <button
              type="button"
              id="btn-new-bis-set"
              className="btn btn-sm"
              onClick={() => setShowAddSet((v) => !v)}
            >
              <Plus size={13} /> New BIS Set
            </button>

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

        {showAddSet && activeChar && (
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
              placeholder="Set Name (e.g. Season 3 Haste/Spirit Push)"
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
              Create & Activate Set
            </button>
          </div>
        )}

        {/* Add Item Row */}
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--bg-canvas)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: '120px minmax(160px, 1.2fr) minmax(170px, 1.1fr) minmax(160px, 1fr) auto',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <select
            aria-label="Gear Slot"
            className="select-control"
            value={slot}
            onChange={(e) => setSlot(e.target.value as GearSlot)}
          >
            {GEAR_SLOTS.map((gs) => (
              <option key={gs} value={gs}>
                {gs}
              </option>
            ))}
          </select>

          <input
            aria-label="BIS Item Name"
            className="text-input"
            placeholder="Item Name (e.g. Trollhide Leggings)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          <select
            aria-label="Drop Dungeon"
            className="select-control"
            value={dungeonSlug}
            onChange={(e) => setDungeonSlug(e.target.value)}
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
            value={stats}
            onChange={(e) => setStats(e.target.value)}
          />

          <button
            type="button"
            id="btn-add-bis-item"
            className="btn btn-primary"
            onClick={handleAddItem}
          >
            <Plus size={14} /> Add BIS
          </button>
        </div>

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
              {activeSet?.items.map((item) => {
                const dName =
                  item.dungeonSlug === 'any-dungeon'
                    ? 'Any Dungeon'
                    : DUNGEONS.find((d) => d.slug === item.dungeonSlug)?.name ??
                      item.dungeonSlug;
                return (
                  <tr
                    key={item.id}
                    style={{ opacity: item.acquired ? 0.55 : 1 }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={item.acquired}
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
                    <td className="mono" style={{ color: 'var(--steel-400)', fontSize: '0.79rem' }}>
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
                    <td className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {item.stats}
                    </td>
                    <td>
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
