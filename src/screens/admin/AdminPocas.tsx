// ── 포카 관리 (테이블 CRUD + 드래그 정렬) — PRD v0.9 ────────────────────
import { useEffect, useMemo, useState } from 'react';
import type { Album } from '../../types';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { T } from '../../theme/tokens';
import { Pill, MemberBadge } from '../../components/atoms';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { SaveAlert, useSaveAlert } from '../../components/SaveAlert';
import type { PocaCard as Card } from '../../types';
import { AdminPocaEditModal } from './AdminPocaEditModal';

const GRID = '50px 70px 90px 1.4fr 1fr 1fr 1fr 90px';

function Row({ card, categoryLabel, onEdit, onDelete }: { card: Card; categoryLabel: string; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform), transition,
    display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', height: 66, padding: '0 20px',
    borderBottom: `1px solid ${T.b}`, background: isDragging ? T.pb : T.s,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', touchAction: 'none' }}><Icon.drag /></div>
      <div style={{ width: 36 }}><PocaCard member={card.member} img={card.imageUrl} width={36} radius={5} /></div>
      <span style={{ fontSize: 12, color: T.tl }}>{categoryLabel}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>{card.name}</span>
      <div><MemberBadge member={card.member} /></div>
      <div><Pill label={card.version} tone="blue" /></div>
      <span style={{ fontSize: 13, color: T.tm }}>{card.source}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onEdit} style={iconBtn}><Icon.edit c={T.tm} sz={15} /></button>
        <button onClick={onDelete} style={iconBtn}><Icon.trash c={T.tm} sz={15} /></button>
      </div>
    </div>
  );
}

export function AdminPocas() {
  const albums = useStore((s) => s.albums);
  const allCards = useStore((s) => s.cards);
  const deleteCard = useStore((s) => s.deleteCard);
  const reorderCards = useStore((s) => s.reorderCards);
  const ensureCards = useStore((s) => s.ensureCards);
  const { alertState, triggerSave } = useSaveAlert();

  const [albumId, setAlbumId] = useState('');

  useEffect(() => {
    if (albumId) ensureCards(albumId);
    else albums.forEach((a) => ensureCards(a.id));
  }, [albumId, albums, ensureCards]);

  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<{ card: Card | null; album: Album } | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const album = albums.find((a) => a.id === albumId);

  const albumCategoryMap = useMemo(() => {
    const m = new Map<string, string>();
    albums.forEach((a) => m.set(a.id, a.categoryType ?? '앨범'));
    return m;
  }, [albums]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allCards
      .filter((c) => !albumId || c.albumId === albumId)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.member.toLowerCase().includes(q))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [allCards, albumId, search]);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const ids = rows.map((r) => r.id);
      const next = arrayMove(ids, ids.indexOf(active.id as string), ids.indexOf(over.id as string));
      triggerSave(async () => reorderCards(albumId, next));
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '24px 32px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>포카 관리</p>
          <select value={albumId} onChange={(e) => setAlbumId(e.target.value)} style={{ height: 30, padding: '0 12px', borderRadius: 100, background: T.bl, border: 'none', fontSize: 12, color: T.tm, fontWeight: 600, cursor: 'pointer', fontFamily: T.f }}>
            <option value="">전체</option>
            {albums.map((a) => <option key={a.id} value={a.id}>[{a.categoryType}] {a.name}</option>)}
          </select>
          <span style={{ fontSize: 13, color: T.tm }}>총 {rows.length}종</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 220, height: 40, borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
            <Icon.search c={T.tl} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="포카 검색" style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 13, color: T.t, fontFamily: T.f }} />
          </div>
          <button onClick={() => album && setEditing({ card: null, album })} disabled={!album} style={{ height: 40, padding: '0 16px', borderRadius: 10, background: album ? T.p : T.bl, display: 'flex', alignItems: 'center', gap: 6, boxShadow: album ? '0 2px 10px rgba(51,102,255,0.25)' : 'none', border: 'none', cursor: album ? 'pointer' : 'default', opacity: album ? 1 : 0.5 }}><Icon.plus c={album ? '#fff' : T.tm} sz={13} /><span style={{ fontSize: 13, color: album ? '#fff' : T.tm, fontWeight: 700 }}>포카 추가</span></button>
        </div>
      </div>
      {/* Table */}
      <div style={{ flex: 1, background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, overflow: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', height: 46, padding: '0 20px', borderBottom: `1px solid ${T.b}`, background: T.bg, position: 'sticky', top: 0, zIndex: 1 }}>
          {['', '썸네일', '카테고리', '포카명', '멤버', '버전', '구매처', '관리'].map((h, i) => <span key={i} style={{ fontSize: 12, fontWeight: 700, color: T.tm }}>{h}</span>)}
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: T.tl, fontSize: 13 }}>포카가 없습니다. '포카 추가'로 등록하세요.</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              {rows.map((card) => (
                <Row key={card.id} card={card}
                  categoryLabel={albumCategoryMap.get(card.albumId) ?? ''}
                  onEdit={() => {
                    const targetAlbum = album ?? albums.find((a) => a.id === card.albumId);
                    if (targetAlbum) setEditing({ card, album: targetAlbum });
                  }}
                  onDelete={() => { if (confirm(`'${card.name}' 삭제할까요?`)) deleteCard(card.id); }} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {editing && (
        <AdminPocaEditModal album={editing.album} card={editing.card} nextOrder={rows.length} onClose={() => setEditing(null)} onSaved={() => triggerSave(async () => {})} />
      )}
      <SaveAlert state={alertState} />
    </div>
  );
}

const iconBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: 8, background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' };
