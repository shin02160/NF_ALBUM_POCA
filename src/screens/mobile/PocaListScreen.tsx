// ── 포카 목록 (앨범별 탭) — PRD v0.8 1-2/1-3 ──────────────────────────
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, MC, STATUS, STATUS_ORDER, MEMBERS, ALBUM_BANNER_GRADIENT } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { filterCards, filterLabel } from '../../lib/selectors';

// ── 앨범 배너 (뒤로가기 포함) ─────────────────────────────────────────
function AlbumBanner() {
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  const navigate = useNavigate();
  if (!album) return null;
  const bg = album.headerImage
    ? `linear-gradient(120deg, rgba(0,0,0,0.45), rgba(0,0,0,0.15)), url(${album.headerImage}) center/cover`
    : ALBUM_BANNER_GRADIENT;
  return (
    <div style={{ height: 96, position: 'relative', flexShrink: 0, overflow: 'hidden', background: bg }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }} />
      <button
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: 10, left: 8, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon.back c="rgba(255,255,255,0.9)" />
      </button>
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

export function PocaListScreen() {
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  const albumId = useStore((s) => s.selectedAlbumId);
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const filters = useStore((s) => s.filters);
  const search = useStore((s) => s.search);
  const setSearch = useStore((s) => s.setSearch);
  const viewMode = useStore((s) => s.viewMode);
  const setView = useStore((s) => s.setView);
  const openFilterModal = useStore((s) => s.openFilterModal);
  const openStatusSheet = useStore((s) => s.openStatusSheet);

  const albumCards = useMemo(
    () => cards.filter((c) => c.albumId === albumId).sort((a, b) => a.sortOrder - b.sortOrder),
    [cards, albumId],
  );

  // 리스트 뷰: 버전별 섹션
  const versionGroups = useMemo(() => {
    const versions = filters.version.length > 0
      ? (album?.versions || []).filter((v) => filters.version.includes(v))
      : (album?.versions || []);

    return versions.map((ver) => {
      let vCards = albumCards.filter((c) => c.version === ver);
      if (filters.source.length > 0) vCards = vCards.filter((c) => filters.source.includes(c.source));

      const sources = [...new Set(albumCards.filter((c) => c.version === ver).map((c) => c.source))];
      const membersToShow = filters.member.length > 0 ? MEMBERS.filter((m) => filters.member.includes(m)) : MEMBERS;

      const memberRows = membersToShow
        .map((m) => ({ member: m, card: vCards.find((c) => c.member === m) ?? null }))
        .filter((r) => !search || r.member.includes(search) || (r.card?.name ?? '').includes(search));

      return { version: ver, sourceLabel: sources.join(' · '), memberRows };
    }).filter((g) => g.memberRows.length > 0);
  }, [album, albumCards, filters, search]);

  // 그리드 뷰: 평면 필터 결과
  const gridCards = useMemo(() => filterCards(albumCards, filters, search), [albumCards, filters, search]);

  const visible = viewMode === 'list' ? versionGroups.flatMap((g) => g.memberRows) : gridCards;

  return (
    <>
      <AlbumBanner />
      {/* 검색 + 뷰 토글 */}
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
      {/* 필터 */}
      <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '10px 16px', display: 'flex', gap: 8, flexShrink: 0 }}>
        {(['버전', '멤버', '구매처'] as const).map((prefix, i) => {
          const sel = [filters.version, filters.member, filters.source][i];
          const active = sel.length > 0;
          return (
            <button key={prefix} onClick={() => openFilterModal(i as 0 | 1 | 2)} style={{ flex: 1, height: 38, borderRadius: 9, border: `${active ? 1.5 : 1}px solid ${active ? T.p : T.b}`, background: active ? T.pb : T.s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', gap: 4, cursor: 'pointer', fontFamily: T.f }}>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? T.p : T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{filterLabel(prefix, sel)}</span>
              <Icon.chev c={active ? T.p : T.tm} />
            </button>
          );
        })}
      </div>
      {/* 상태 범례 */}
      <div style={{ height: 34, background: T.bg, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        {STATUS_ORDER.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, border: `2px solid ${STATUS[s].c}` }} />
            <span style={{ fontSize: 11, color: T.tm, fontFamily: T.f }}>{s}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: T.tl, fontFamily: T.f }}>{visible.length}종</span>
      </div>
      {/* 컨텐츠 */}
      {viewMode === 'list' ? (
        <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
          {versionGroups.length === 0
            ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13 }}>표시할 포카가 없습니다</div>
            : versionGroups.map(({ version, sourceLabel, memberRows }) => (
              <div key={version}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px 8px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{version}</span>
                  {sourceLabel && (
                    <>
                      <span style={{ width: 1, height: 12, background: T.b }} />
                      <span style={{ fontSize: 12, color: T.tm, fontWeight: 500 }}>{sourceLabel}</span>
                    </>
                  )}
                </div>
                {memberRows.map(({ member, card }) => (
                  <button
                    key={member}
                    onClick={() => card && openStatusSheet(card.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderBottom: `1px solid ${T.bl}`, width: '100%', background: 'none', border: 'none', borderBottomStyle: 'solid', cursor: card ? 'pointer' : 'default', textAlign: 'left', fontFamily: T.f }}
                  >
                    <div style={{ width: 44, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: MC[member] || T.tm, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.t, whiteSpace: 'nowrap' }}>{member}</span>
                    </div>
                    {card
                      ? <div style={{ width: 52 }}><PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] ?? null} width={52} radius={6} /></div>
                      : <div style={{ width: 52, aspectRatio: '2/3', borderRadius: 6, background: T.bl, border: `1px dashed ${T.b}` }} />}
                  </button>
                ))}
              </div>
            ))}
        </div>
      ) : (
        gridCards.length === 0
          ? <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13, background: T.s }}>표시할 포카가 없습니다</div>
          : <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: T.s }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 10px' }}>
              {gridCards.map((card) => (
                <button key={card.id} onClick={() => openStatusSheet(card.id)} style={{ display: 'flex', flexDirection: 'column', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: T.f }}>
                  <PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] ?? null} radius={6} />
                </button>
              ))}
            </div>
          </div>
      )}
    </>
  );
}
