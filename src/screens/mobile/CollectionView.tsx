// ── 모아보기: 카테고리 타입 / 아이템 필터 — PRD v0.9 ─────────────────────
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, MC, MEMBERS, STATUS, STATUS_ORDER } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { filterLabel } from '../../lib/selectors';
import type { PocaCard as Card, CategoryType } from '../../types';
import { CATEGORY_TYPES } from '../../types';

type MemberRow = { member: string; displayName: string; cards: Card[] };
type VerGroup = { version: string; source: string; memberRows: MemberRow[] };
type AlbumGroup = {
  albumId: string; albumName: string;
  versions: string[]; sources: string[];
  versionGroups: VerGroup[];
};

function memberDotColor(member: string): string {
  return MC[member.split(',')[0].trim()] || T.tm;
}

const SOLO_MEMBERS = ['승협', '훈', '재현', '회승', '동성'];

function buildMemberRows(sCards: Card[], membersToShow: string[], showEmpty: boolean): MemberRow[] {
  const individualRows: MemberRow[] = SOLO_MEMBERS
    .filter((m) => membersToShow.includes(m))
    .map((m) => ({
      member: m, displayName: m,
      cards: sCards.filter((c) => !c.member.includes(',') && c.member.trim() === m),
    }))
    .filter((r) => r.cards.length > 0 || showEmpty);

  const unitStrings = [...new Set(sCards.filter((c) => c.member.includes(',')).map((c) => c.member))];
  const useUnitLabel = membersToShow.includes('유닛') && membersToShow.length > 1;
  const dynamicUnitRows: MemberRow[] = unitStrings
    .map((unit) => ({
      member: unit,
      displayName: useUnitLabel ? '유닛' : unit.split(',').map((s) => s.trim()).join(' · '),
      cards: sCards.filter((c) => c.member === unit),
    }))
    .filter((r) => r.cards.length > 0);

  const groupRows: MemberRow[] = membersToShow.includes('단체')
    ? [{
        member: '단체', displayName: '단체',
        cards: sCards.filter((c) => !c.member.includes(',') && c.member.trim() === '단체'),
      }].filter((r) => r.cards.length > 0 || showEmpty)
    : [];

  return [...individualRows, ...dynamicUnitRows, ...groupRows];
}

export function CollectionView() {
  const navigate = useNavigate();
  const albums = useStore(useShallow((s) => s.albums.filter((a) => a.isVisible !== false)));
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const filters = useStore((s) => s.filters);
  const openStatusSheet = useStore((s) => s.openStatusSheet);
  const openFilterModal = useStore((s) => s.openFilterModal);
  const selectAlbum = useStore((s) => s.selectAlbum);
  const resetFilters = useStore((s) => s.resetFilters);
  const ensureCards = useStore((s) => s.ensureCards);
  const albumIds = useStore(useShallow((s) => s.albums.map((a) => a.id)));

  useEffect(() => {
    albumIds.forEach((id) => ensureCards(id));
  }, [albumIds, ensureCards]);

  // 레벨 1: 카테고리 타입 필터 (null=전체)
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | null>(null);
  // 레벨 2: 특정 아이템(앨범) 필터 (null=카테고리 전체)
  const [albumFilter, setAlbumFilter] = useState<string | null>(null);

  // 실제 데이터가 있는 카테고리 타입만
  const availableCategories = useMemo(() => {
    const usedTypes = new Set(albums.map((a) => a.categoryType));
    return CATEGORY_TYPES.filter((ct) => usedTypes.has(ct));
  }, [albums]);

  // 선택된 카테고리 타입 내의 아이템들
  const categoryItems = useMemo(
    () => categoryFilter ? albums.filter((a) => a.categoryType === categoryFilter) : [],
    [albums, categoryFilter],
  );

  function handleCategoryClick(ct: CategoryType | null) {
    setCategoryFilter(ct);
    setAlbumFilter(null);
    resetFilters();
  }

  function handleAlbumClick(id: string | null) {
    setAlbumFilter(id);
    if (id !== null) void selectAlbum(id);
    else resetFilters();
  }

  const contentData = useMemo((): { mode: 'all'; albumGroups: AlbumGroup[] } | { mode: 'album'; versionGroups: VerGroup[] } => {
    // 필터링할 앨범 목록
    const targetAlbums = categoryFilter
      ? (albumFilter ? albums.filter((a) => a.id === albumFilter) : albums.filter((a) => a.categoryType === categoryFilter))
      : albums;

    if (!albumFilter) {
      const albumGroups: AlbumGroup[] = [];
      for (const album of targetAlbums) {
        const albumCards = cards.filter((c) => c.albumId === album.id);
        const verGroups: VerGroup[] = [];
        for (const ver of album.versions) {
          const allVerCards = albumCards.filter((c) => c.version === ver);
          const sources = [...new Set(allVerCards.map((c) => c.source))];
          for (const src of sources) {
            const sCards = allVerCards.filter((c) => c.source === src);
            const memberRows = buildMemberRows(sCards, MEMBERS, false);
            if (memberRows.length > 0) verGroups.push({ version: ver, source: src, memberRows });
          }
        }
        if (verGroups.length > 0) {
          albumGroups.push({ albumId: album.id, albumName: album.name, versions: album.versions, sources: album.sources, versionGroups: verGroups });
        }
      }
      return { mode: 'all', albumGroups };
    }

    const album = albums.find((a) => a.id === albumFilter);
    if (!album) return { mode: 'album', versionGroups: [] };

    const albumCards = cards.filter((c) => c.albumId === albumFilter);
    const versions = filters.version.length > 0 ? album.versions.filter((v) => filters.version.includes(v)) : album.versions;
    const membersToShow = filters.member.length > 0 ? MEMBERS.filter((m) => filters.member.includes(m)) : MEMBERS;
    const versionGroups: VerGroup[] = [];

    for (const ver of versions) {
      let allVerCards = albumCards.filter((c) => c.version === ver);
      if (filters.source.length > 0) allVerCards = allVerCards.filter((c) => filters.source.includes(c.source));
      const sources = [...new Set(allVerCards.map((c) => c.source))];
      for (const src of sources) {
        const sCards = allVerCards.filter((c) => c.source === src);
        const memberRows = buildMemberRows(sCards, membersToShow, true);
        if (memberRows.length > 0) versionGroups.push({ version: ver, source: src, memberRows });
      }
    }
    return { mode: 'album', versionGroups };
  }, [albums, cards, categoryFilter, albumFilter, filters]);

  function renderMemberRows(memberRows: MemberRow[]) {
    return memberRows.map(({ member, displayName, cards: rowCards }) => (
      <div key={member} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderBottom: `1px solid ${T.bl}`, fontFamily: T.f }}>
        <div style={{ width: 44, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: memberDotColor(member), flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.t, whiteSpace: 'nowrap' }}>{displayName}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {rowCards.length > 0
            ? rowCards.map((card) => (
                <button key={card.id} onClick={() => openStatusSheet(card.id)} style={{ width: 52, flexShrink: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] ?? null} width={52} radius={6} />
                </button>
              ))
            : <div style={{ width: 52, aspectRatio: '2/3', borderRadius: 6, background: T.bl, border: `1px dashed ${T.b}` }} />}
        </div>
      </div>
    ));
  }

  function renderVerHeader(version: string, source: string, compact = false) {
    // 버전이 있으면 버전만 표시, 버전 없으면 판매처 표시
    const hasVersion = Boolean(version && version !== '-');
    const label = hasVersion ? version : source;
    const sub = hasVersion ? null : null; // 버전 있을 때 판매처 미노출
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: compact ? '8px 16px 6px' : '10px 16px 8px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
        <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{label}</span>
        {sub && (<><span style={{ width: 1, height: compact ? 10 : 12, background: T.b }} /><span style={{ fontSize: compact ? 11 : 12, color: T.tm, fontWeight: 500 }}>{sub}</span></>)}
      </div>
    );
  }

  const chipBtn = (active: boolean, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      style={{
        height: 34, padding: '0 14px', borderRadius: 9,
        border: `${active ? 1.5 : 1}px solid ${active ? T.p : T.b}`,
        background: active ? T.pb : T.s,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontFamily: T.f, flexShrink: 0,
        boxShadow: active ? '0 2px 8px rgba(51,102,255,0.12)' : 'none',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? T.p : T.t, whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );

  return (
    <>
      {/* 헤더 */}
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" onClick={() => navigate('/category')} style={{ height: 46, width: 'auto', cursor: 'pointer' }} />
      </div>

      {/* Level 1: 카테고리 타입 chips */}
      <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '8px 0', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
        <div style={{ display: 'inline-flex', gap: 8, padding: '0 16px', minWidth: '100%' }}>
          {chipBtn(categoryFilter === null, () => handleCategoryClick(null), '전체')}
          {availableCategories.map((ct) => chipBtn(categoryFilter === ct, () => handleCategoryClick(ct), ct))}
        </div>
      </div>

      {/* Level 2: 카테고리 내 아이템 chips (카테고리 선택 시만 표시) */}
      {categoryFilter !== null && categoryItems.length > 1 && (
        <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '6px 0', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
          <div style={{ display: 'inline-flex', gap: 6, padding: '0 16px', minWidth: '100%' }}>
            {categoryItems.map((al) => (
              <button
                key={al.id}
                onClick={() => handleAlbumClick(albumFilter === al.id ? null : al.id)}
                style={{
                  height: 30, padding: '0 12px', borderRadius: 8,
                  border: `${albumFilter === al.id ? 1.5 : 1}px solid ${albumFilter === al.id ? T.p : T.b}`,
                  background: albumFilter === al.id ? T.pb : T.bl,
                  display: 'flex', alignItems: 'center', cursor: 'pointer', fontFamily: T.f, flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: albumFilter === al.id ? 700 : 500, color: albumFilter === al.id ? T.p : T.tm, whiteSpace: 'nowrap' }}>{al.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level 3: 버전/멤버/구매처 필터 (특정 아이템 선택 시만) */}
      {albumFilter !== null && (
        <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '8px 16px', display: 'flex', gap: 8, flexShrink: 0 }}>
          {(['버전', '멤버', '구매처'] as const).map((prefix, i) => {
            const sel = [filters.version, filters.member, filters.source][i];
            const active = sel.length > 0;
            return (
              <button key={prefix} onClick={() => openFilterModal(i as 0 | 1 | 2)} style={{ flex: 1, height: 36, borderRadius: 9, border: `${active ? 1.5 : 1}px solid ${active ? T.p : T.b}`, background: active ? T.pb : T.s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', gap: 4, cursor: 'pointer', fontFamily: T.f }}>
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 500, color: active ? T.p : T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{filterLabel(prefix, sel)}</span>
                <Icon.chev c={active ? T.p : T.tm} />
              </button>
            );
          })}
        </div>
      )}

      {/* 상태 범례 */}
      <div style={{ height: 34, background: T.bg, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        {STATUS_ORDER.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, border: `2px solid ${STATUS[s].c}` }} />
            <span style={{ fontSize: 11, color: T.tm, fontFamily: T.f }}>{s}</span>
          </div>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
        {contentData.mode === 'all' ? (
          contentData.albumGroups.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13 }}>표시할 포카가 없습니다</div>
          ) : (
            contentData.albumGroups.map(({ albumId, albumName, versions, versionGroups }) => (
              <div key={albumId}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px 7px', background: T.bg }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.t }}>{albumName}</span>
                  <span style={{ width: 1, height: 11, background: T.b, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: T.tm, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {versions.join(' / ')}
                  </span>
                </div>
                {versionGroups.map(({ version, source, memberRows }) => (
                  <div key={`${version}-${source}`}>
                    {renderVerHeader(version, source, true)}
                    {renderMemberRows(memberRows)}
                  </div>
                ))}
              </div>
            ))
          )
        ) : (
          contentData.versionGroups.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13 }}>표시할 포카가 없습니다</div>
          ) : (
            contentData.versionGroups.map(({ version, source, memberRows }) => (
              <div key={`${version}-${source}`}>
                {renderVerHeader(version, source)}
                {renderMemberRows(memberRows)}
              </div>
            ))
          )
        )}
      </div>
    </>
  );
}
