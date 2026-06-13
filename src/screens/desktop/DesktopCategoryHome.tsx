// ── 데스크탑 카테고리 홈 — 3패널 (카테고리 트리 + 포카 리스트) ──────────
import { useMemo, useState } from 'react';
import { T, MC, STATUS, STATUS_ORDER, ALBUM_BANNER_GRADIENT } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import type { Album, PocaCard as Card } from '../../types';
import { CATEGORY_TYPES } from '../../types';
import type { CategoryType } from '../../types';

const CAT_COLOR: Record<CategoryType, string> = {
  앨범: T.p, 콘서트: '#FF6B35', 팬미팅: '#F553DA', 팬클럽: '#20B2AA',
  시즌그리팅: '#00BF40', 포토북: '#8050DF', 잡지: '#F5C400', MD: '#FF9200', 기타: T.tm,
};

const SOLO_MEMBERS = ['승협', '훈', '재현', '회승', '동성'];

// ── 상태 범례 ─────────────────────────────────────────────────────────────
function StatusLegend() {
  return (
    <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', background: T.bg, borderBottom: `1px solid ${T.b}`, flexShrink: 0 }}>
      {STATUS_ORDER.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, border: `2px solid ${STATUS[s].c}` }} />
          <span style={{ fontSize: 12, color: T.tm }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

// ── 툴바 (검색 + 뷰 전환) ─────────────────────────────────────────────────
function Toolbar({ view, onViewChange, search, onSearch }: {
  view: 'list' | 'grid'; onViewChange: (v: 'list' | 'grid') => void;
  search: string; onSearch: (v: string) => void;
}) {
  return (
    <div style={{ height: 50, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 10, flexShrink: 0 }}>
      <div style={{ width: 240, height: 34, borderRadius: 9, background: T.bg, border: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
        <Icon.search c={T.tl} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="포카 검색"
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: T.t, fontFamily: T.f, flex: 1 }}
        />
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', background: T.bg, borderRadius: 8, padding: 3, gap: 2 }}>
        {(['list', 'grid'] as const).map((id) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            style={{ width: 30, height: 28, borderRadius: 6, background: id === view ? T.s : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: id === view ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}
          >
            {id === 'list' ? <Icon.list c={id === view ? T.t : T.tl} /> : <Icon.grid c={id === view ? T.t : T.tl} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 리스트 뷰 ─────────────────────────────────────────────────────────────
function ListView({ album, cards, statusMap, search, onCardClick }: {
  album: Album; cards: Card[]; statusMap: Record<string, string | null>;
  search: string; onCardClick: (id: string) => void;
}) {
  const vGroups = useMemo(() => {
    return album.versions.map((ver) => {
      const vCards = cards.filter((c) => c.version === ver && (!search || c.member.includes(search) || c.name.includes(search)));
      const sources = [...new Set(cards.filter((c) => c.version === ver).map((c) => c.source))];
      // 멤버별로 카드를 배열로 묶음 (같은 멤버의 여러 포카 지원)
      const rows = SOLO_MEMBERS.map((m) => ({
        member: m,
        memberCards: vCards.filter((c) => !c.member.includes(',') && c.member.trim() === m),
      }));
      return { ver, sourceLabel: sources.join(' · '), rows };
    });
  }, [album, cards, search]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
      {vGroups.map(({ ver, sourceLabel, rows }) => (
        <div key={ver}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px 8px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.t }}>{ver}</span>
            {sourceLabel && <><span style={{ width: 1, height: 12, background: T.b }} /><span style={{ fontSize: 12, color: T.tm }}>{sourceLabel}</span></>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {rows.map(({ member, memberCards }, mi) => (
              <div
                key={member}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px',
                  borderBottom: `1px solid ${T.bl}`,
                  borderRight: mi % 2 === 0 ? `1px solid ${T.bl}` : 'none',
                }}
              >
                <div style={{ width: 54, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: MC[member] || T.tm, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.t }}>{member}</span>
                </div>
                {/* 카드 여러 장 가로 나열 */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {memberCards.length > 0
                    ? memberCards.map((card) => (
                        <div key={card.id} onClick={() => onCardClick(card.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 54 }}>
                            <PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] as any} width={54} radius={6} />
                          </div>
                          {statusMap[card.id] && (
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              color: STATUS[statusMap[card.id] as keyof typeof STATUS]?.c,
                              background: STATUS[statusMap[card.id] as keyof typeof STATUS]?.bg,
                              padding: '2px 6px', borderRadius: 100,
                              border: `1px solid ${STATUS[statusMap[card.id] as keyof typeof STATUS]?.c}33`,
                              whiteSpace: 'nowrap',
                            }}>{statusMap[card.id]}</span>
                          )}
                        </div>
                      ))
                    : <div style={{ width: 54, aspectRatio: '2/3', borderRadius: 6, background: T.bl, border: `1px dashed ${T.b}` }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 그리드 뷰 ─────────────────────────────────────────────────────────────
function GridView({ album, cards, statusMap, search, onCardClick }: {
  album: Album; cards: Card[]; statusMap: Record<string, string | null>;
  search: string; onCardClick: (id: string) => void;
}) {
  const vGroups = useMemo(() => {
    return album.versions.map((ver) => {
      const vCards = cards
        .filter((c) => c.version === ver && (!search || c.member.includes(search) || c.name.includes(search)))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const sources = [...new Set(cards.filter((c) => c.version === ver).map((c) => c.source))];
      return { ver, sourceLabel: sources.join(' · '), vCards };
    });
  }, [album, cards, search]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
      {vGroups.map(({ ver, sourceLabel, vCards }) => (
        <div key={ver}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px 8px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.t }}>{ver}</span>
            {sourceLabel && <><span style={{ width: 1, height: 12, background: T.b }} /><span style={{ fontSize: 12, color: T.tm }}>{sourceLabel}</span></>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '16px 12px', padding: '18px 28px' }}>
            {vCards.map((card) => (
              <div key={card.id} onClick={() => onCardClick(card.id)} style={{ cursor: 'pointer' }}>
                <PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] as any} />
                <p style={{ fontSize: 11, fontWeight: 600, color: T.tm, marginTop: 5, textAlign: 'center' }}>{card.member}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────
export function DesktopCategoryHome() {
  const albums = useStore(useShallow((s) => s.albums.filter((a) => a.isVisible !== false)));
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const openStatusSheet = useStore((s) => s.openStatusSheet);
  const ensureCards = useStore((s) => s.ensureCards);

  // 카테고리 타입별 그룹핑
  const grouped = useMemo(() => {
    return CATEGORY_TYPES
      .map((ct) => ({ type: ct, items: albums.filter((a) => a.categoryType === ct) }))
      .filter((g) => g.items.length > 0);
  }, [albums]);

  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(albums[0]?.id ?? null);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');

  const selectedAlbum = albums.find((a) => a.id === selectedAlbumId) ?? null;
  const albumCards = useMemo(
    () => cards.filter((c) => c.albumId === selectedAlbumId).sort((a, b) => a.sortOrder - b.sortOrder),
    [cards, selectedAlbumId],
  );

  async function handleSelectAlbum(id: string) {
    setSelectedAlbumId(id);
    setSearch('');
    setView('list');
    await ensureCards(id);
  }

  const bg = selectedAlbum?.headerImageUrl
    ? `linear-gradient(120deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${selectedAlbum.headerImageUrl}) center/cover`
    : ALBUM_BANNER_GRADIENT;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* ── Panel 2: 카테고리 트리 ── */}
      <div style={{ width: 280, background: T.s, borderRight: `1px solid ${T.b}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${T.b}`, flexShrink: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 2 }}>카테고리</p>
          <p style={{ fontSize: 12, color: T.tm }}>소장 포카를 카테고리별로 탐색</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
          {grouped.map(({ type, items }) => (
            <div key={type} style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px' }}>
                <span style={{ width: 4, height: 14, borderRadius: 100, background: CAT_COLOR[type], flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: CAT_COLOR[type], flex: 1 }}>{type}</span>
                <span style={{ fontSize: 10, color: T.tl }}>{items.length}</span>
              </div>
              {items.map((al) => {
                const on = al.id === selectedAlbumId;
                return (
                  <button
                    key={al.id}
                    onClick={() => handleSelectAlbum(al.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px 7px 18px',
                      borderRadius: 9, background: on ? T.pb : 'transparent',
                      border: `1px solid ${on ? 'rgba(51,102,255,0.2)' : 'transparent'}`,
                      marginBottom: 1, cursor: 'pointer', width: '100%', fontFamily: T.f, textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 7, overflow: 'hidden',
                      border: `1px solid ${T.b}`, flexShrink: 0,
                      background: al.thumbnailUrl ? undefined : T.bl,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {al.thumbnailUrl
                        ? <img src={al.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <img src={LOGO} alt="" style={{ width: '65%', opacity: 0.5 }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: on ? 700 : 500, color: on ? T.p : T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{al.name}</p>
                      <p style={{ fontSize: 10, color: T.tl }}>{[al.sub, al.year].filter(Boolean).join(' · ')}</p>
                    </div>
                    <span style={{ fontSize: 11, color: on ? T.p : T.tl, fontWeight: on ? 700 : 400, flexShrink: 0 }}>{al.count}종</span>
                  </button>
                );
              })}
            </div>
          ))}
          {grouped.length === 0 && (
            <p style={{ fontSize: 13, color: T.tl, textAlign: 'center', padding: '32px 0' }}>등록된 카테고리가 없습니다</p>
          )}
        </div>
      </div>

      {/* ── Panel 3: 포카 리스트 ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedAlbum ? (
          <>
            {/* 앨범 배너 */}
            <div style={{ height: 82, background: bg, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedAlbum.thumbnailUrl
                  ? <img src={selectedAlbum.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                  : <img src={LOGO} alt="" style={{ width: '62%', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 5 }}>{selectedAlbum.name}</p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  {selectedAlbum.sub && (
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)' }}>{selectedAlbum.sub}</span>
                  )}
                  {selectedAlbum.versions.map((v) => (
                    <span key={v} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>{v}</span>
                  ))}
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>· 포카 {albumCards.length}종</span>
                </div>
              </div>
            </div>
            <Toolbar view={view} onViewChange={setView} search={search} onSearch={setSearch} />
            <StatusLegend />
            {view === 'list'
              ? <ListView album={selectedAlbum} cards={albumCards} statusMap={statusMap} search={search} onCardClick={openStatusSheet} />
              : <GridView album={selectedAlbum} cards={albumCards} statusMap={statusMap} search={search} onCardClick={openStatusSheet} />}
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 14 }}>
            카테고리를 선택해주세요
          </div>
        )}
      </div>
    </div>
  );
}
