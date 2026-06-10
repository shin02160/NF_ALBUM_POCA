// ── 포카 목록 (리스트/그리드) — PRD 4-2, 4-3 ───────────────────────────
import { useMemo } from 'react';
import { VList } from 'virtua';
import { T, MC, STATUS, STATUS_ORDER, ALBUM_BANNER_GRADIENT } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Pill, MemberBadge } from '../../components/atoms';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { filterCards, filterLabel } from '../../lib/selectors';
import type { PocaCard as Card } from '../../types';

function AlbumBanner() {
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  if (!album) return null;
  const bg = album.headerImage
    ? `linear-gradient(120deg, rgba(0,0,0,0.45), rgba(0,0,0,0.15)), url(${album.headerImage}) center/cover`
    : ALBUM_BANNER_GRADIENT;
  return (
    <div style={{ height: 96, position: 'relative', flexShrink: 0, overflow: 'hidden', background: bg }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <img src={LOGO} alt="" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{album.name}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{[album.sub, album.year].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
    </div>
  );
}

function ListRow({ card }: { card: Card }) {
  const status = useStore((s) => s.statusMap[card.id] ?? null);
  const openStatusSheet = useStore((s) => s.openStatusSheet);
  return (
    <button onClick={() => openStatusSheet(card.id)} style={{ display: 'flex', gap: 12, padding: '11px 16px', borderBottom: `1px solid ${T.b}`, alignItems: 'center', width: '100%', background: 'none', border: 'none', borderBottomStyle: 'solid', cursor: 'pointer', textAlign: 'left', fontFamily: T.f }}>
      <div style={{ width: 46, flexShrink: 0 }}><PocaCard member={card.member} img={card.imageUrl} status={status} width={46} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: T.t, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</p>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <MemberBadge member={card.member} />
          <Pill label={card.version} tone="blue" />
          <Pill label={card.source} />
        </div>
      </div>
      {status
        ? <div style={{ height: 28, padding: '0 10px', borderRadius: 100, background: STATUS[status].bg, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS[status].c }} /><span style={{ fontSize: 11, fontWeight: 700, color: STATUS[status].c }}>{status}</span></div>
        : <div style={{ height: 28, padding: '0 11px', borderRadius: 100, border: `1.5px solid ${T.b}`, display: 'flex', alignItems: 'center', flexShrink: 0 }}><span style={{ fontSize: 11, fontWeight: 600, color: T.tm }}>상태 기록</span></div>}
    </button>
  );
}

function GridCell({ card }: { card: Card }) {
  const status = useStore((s) => s.statusMap[card.id] ?? null);
  const openStatusSheet = useStore((s) => s.openStatusSheet);
  return (
    <button onClick={() => openStatusSheet(card.id)} style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: T.f }}>
      <PocaCard member={card.member} img={card.imageUrl} status={status} radius={6} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: MC[card.member] }} />
        <span style={{ fontSize: 10, color: T.tm, fontWeight: 500 }}>{card.member}</span>
      </div>
    </button>
  );
}

export function PocaListScreen() {
  const cards = useStore((s) => s.cards);
  const albumId = useStore((s) => s.selectedAlbumId);
  const filters = useStore((s) => s.filters);
  const search = useStore((s) => s.search);
  const setSearch = useStore((s) => s.setSearch);
  const viewMode = useStore((s) => s.viewMode);
  const setView = useStore((s) => s.setView);
  const openFilterModal = useStore((s) => s.openFilterModal);

  const visible = useMemo(() => {
    const inAlbum = cards.filter((c) => c.albumId === albumId).sort((a, b) => a.sortOrder - b.sortOrder);
    return filterCards(inAlbum, filters, search);
  }, [cards, albumId, filters, search]);

  return (
    <>
      <AlbumBanner />
      {/* Toolbar */}
      <div style={{ height: 46, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, height: 36, borderRadius: 9, background: T.bl, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
          <Icon.search c={T.tl} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="포카 검색" style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 13, color: T.t, fontFamily: T.f }} />
        </div>
        <div style={{ display: 'flex', background: T.bl, borderRadius: 9, padding: 3, gap: 2 }}>
          {([{ id: 'list', Ico: Icon.list }, { id: 'grid', Ico: Icon.grid }] as const).map(({ id, Ico }) => (
            <button key={id} onClick={() => setView(id)} style={{ width: 32, height: 30, borderRadius: 6, background: viewMode === id ? T.s : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: viewMode === id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none', border: 'none', cursor: 'pointer' }}>
              <Ico c={viewMode === id ? T.t : T.tl} />
            </button>
          ))}
        </div>
      </div>
      {/* Filter row */}
      <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '10px 16px', display: 'flex', gap: 8, flexShrink: 0 }}>
        <FilterButton prefix="버전" sel={filters.version} onClick={() => openFilterModal(0)} />
        <FilterButton prefix="멤버" sel={filters.member} onClick={() => openFilterModal(1)} />
        <FilterButton prefix="구매처" sel={filters.source} onClick={() => openFilterModal(2)} />
      </div>
      {/* Legend */}
      <div style={{ height: 34, background: T.bg, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        {STATUS_ORDER.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, border: `2px solid ${STATUS[s].c}` }} />
            <span style={{ fontSize: 11, color: T.tm }}>{s}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: T.tl }}>{visible.length}종</span>
      </div>
      {/* Content */}
      {visible.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13, background: T.s }}>표시할 포카가 없습니다</div>
      ) : viewMode === 'list' ? (
        <VList style={{ flex: 1, background: T.s }}>
          {visible.map((card) => <ListRow key={card.id} card={card} />)}
        </VList>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 10px' }}>
            {visible.map((card) => <GridCell key={card.id} card={card} />)}
          </div>
        </div>
      )}
    </>
  );
}

function FilterButton({ prefix, sel, onClick }: { prefix: string; sel: string[]; onClick: () => void }) {
  const active = sel.length > 0;
  return (
    <button onClick={onClick} style={{ flex: 1, height: 38, borderRadius: 9, border: `${active ? 1.5 : 1}px solid ${active ? T.p : T.b}`, background: active ? T.pb : T.s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', gap: 4, cursor: 'pointer', fontFamily: T.f }}>
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? T.p : T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{filterLabel(prefix, sel)}</span>
      <Icon.chev c={active ? T.p : T.tm} />
    </button>
  );
}
