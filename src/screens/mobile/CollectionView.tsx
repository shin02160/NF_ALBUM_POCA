// ── 모아보기: 전체 / 앨범별 필터 ─────────────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { filterLabel } from '../../lib/selectors';
import type { PocaCard as Card } from '../../types';

type MemberRow = { member: string; displayName: string; cards: Card[] };
type VerGroup = { version: string; source: string; memberRows: MemberRow[] };
type AlbumGroup = {
  albumId: string; albumName: string;
  versions: string[]; sources: string[];
  versionGroups: VerGroup[];
};

// 멤버 색상 (유닛은 첫 번째 멤버 색상 사용)
function memberDotColor(member: string): string {
  return MC[member.split(',')[0].trim()] || T.tm;
}

// 멤버행 빌더: 개별 멤버(단일) + 유닛(다중) 분리
function buildMemberRows(sCards: Card[], membersToShow: string[], showEmpty: boolean): MemberRow[] {
  // 개별 멤버행: 단일 멤버 포카만 (정확히 일치)
  const individualRows: MemberRow[] = membersToShow
    .map((m) => ({
      member: m,
      displayName: m,
      cards: sCards.filter((c) => !c.member.includes(',') && c.member.trim() === m),
    }))
    .filter((r) => r.cards.length > 0 || showEmpty);

  // 유닛행: 다중 멤버 포카 (member 문자열 기준 그룹)
  const unitStrings = [...new Set(sCards.filter((c) => c.member.includes(',')).map((c) => c.member))];
  const unitRows: MemberRow[] = unitStrings
    .map((unit) => ({
      member: unit,
      displayName: unit.split(',').map((s) => s.trim()).join(' · '),
      cards: sCards.filter((c) => c.member === unit),
    }))
    .filter((r) => r.cards.length > 0);

  return [...individualRows, ...unitRows];
}

export function CollectionView() {
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

  const [albumFilter, setAlbumFilter] = useState<string | null>(null);

  function handleAlbumSelect(id: string | null) {
    setAlbumFilter(id);
    if (id !== null) {
      void selectAlbum(id);
    } else {
      resetFilters();
    }
  }

  const contentData = useMemo((): { mode: 'all'; albumGroups: AlbumGroup[] } | { mode: 'album'; versionGroups: VerGroup[] } => {
    if (albumFilter === null) {
      const albumGroups: AlbumGroup[] = [];
      for (const album of albums) {
        const albumCards = cards.filter((c) => c.albumId === album.id);
        const verGroups: VerGroup[] = [];

        for (const ver of album.versions) {
          const allVerCards = albumCards.filter((c) => c.version === ver);
          const sources = [...new Set(allVerCards.map((c) => c.source))];

          for (const src of sources) {
            const sCards = allVerCards.filter((c) => c.source === src);
            const memberRows = buildMemberRows(sCards, MEMBERS, false);
            if (memberRows.length > 0) {
              verGroups.push({ version: ver, source: src, memberRows });
            }
          }
        }

        if (verGroups.length > 0) {
          albumGroups.push({
            albumId: album.id,
            albumName: album.name,
            versions: album.versions,
            sources: album.sources,
            versionGroups: verGroups,
          });
        }
      }
      return { mode: 'all', albumGroups };
    }

    const album = albums.find((a) => a.id === albumFilter);
    if (!album) return { mode: 'album', versionGroups: [] };

    const albumCards = cards.filter((c) => c.albumId === albumFilter);
    const versions = filters.version.length > 0
      ? album.versions.filter((v) => filters.version.includes(v))
      : album.versions;

    const versionGroups: VerGroup[] = [];
    const membersToShow = filters.member.length > 0 ? MEMBERS.filter((m) => filters.member.includes(m)) : MEMBERS;

    for (const ver of versions) {
      let allVerCards = albumCards.filter((c) => c.version === ver);
      if (filters.source.length > 0) allVerCards = allVerCards.filter((c) => filters.source.includes(c.source));

      const sources = [...new Set(allVerCards.map((c) => c.source))];

      for (const src of sources) {
        const sCards = allVerCards.filter((c) => c.source === src);
        // 소스 필터 활성 시 빈 행 표시 (어떤 멤버가 없는지 확인 가능)
        const memberRows = buildMemberRows(sCards, membersToShow, filters.source.length > 0);
        if (memberRows.length > 0) {
          versionGroups.push({ version: ver, source: src, memberRows });
        }
      }
    }

    return { mode: 'album', versionGroups };
  }, [albums, cards, albumFilter, filters]);

  // 공통 멤버행 렌더러
  function renderMemberRows(memberRows: MemberRow[]) {
    return memberRows.map(({ member, displayName, cards: rowCards }) => (
      <div
        key={member}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderBottom: `1px solid ${T.bl}`, fontFamily: T.f }}
      >
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

  // 공통 버전 섹션 헤더
  function renderVerHeader(version: string, source: string, compact = false) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: compact ? '8px 16px 6px' : '10px 16px 8px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
        <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{version}</span>
        {source && (
          <>
            <span style={{ width: 1, height: compact ? 10 : 12, background: T.b }} />
            <span style={{ fontSize: compact ? 11 : 12, color: T.tm, fontWeight: 500 }}>{source}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* 헤더 */}
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" style={{ height: 46, width: 'auto' }} />
      </div>

      {/* 앨범 chip 선택 */}
      <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '8px 0', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div style={{ display: 'inline-flex', gap: 8, padding: '0 16px', minWidth: '100%' }}>
          {/* 전체 chip */}
          <button
            onClick={() => handleAlbumSelect(null)}
            style={{
              height: 36, padding: '0 16px', borderRadius: 10,
              border: `${albumFilter === null ? 1.5 : 1}px solid ${albumFilter === null ? T.p : T.b}`,
              background: albumFilter === null ? T.pb : T.s,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontFamily: T.f, flexShrink: 0,
              boxShadow: albumFilter === null ? '0 2px 8px rgba(51,102,255,0.12)' : 'none',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: albumFilter === null ? 700 : 500, color: albumFilter === null ? T.p : T.t }}>전체</span>
          </button>

          {/* 앨범별 chip */}
          {albums.map((album) => {
            const on = albumFilter === album.id;
            return (
              <button
                key={album.id}
                onClick={() => handleAlbumSelect(album.id)}
                style={{
                  height: 36, padding: '0 14px', borderRadius: 10,
                  border: `${on ? 1.5 : 1}px solid ${on ? T.p : T.b}`,
                  background: on ? T.pb : T.s,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontFamily: T.f, flexShrink: 0,
                  boxShadow: on ? '0 2px 8px rgba(51,102,255,0.12)' : 'none',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: on ? 700 : 500, color: on ? T.p : T.t, whiteSpace: 'nowrap' }}>{album.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 버전/판매처 필터 (특정 앨범 선택 시만) */}
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

      {/* 컨텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
        {contentData.mode === 'all' ? (
          contentData.albumGroups.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13 }}>표시할 포카가 없습니다</div>
          ) : (
            contentData.albumGroups.map(({ albumId, albumName, versions, sources, versionGroups }) => (
              <div key={albumId}>
                {/* 앨범 섹션 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px 7px', background: T.bg }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.t }}>{albumName}</span>
                  <span style={{ width: 1, height: 11, background: T.b, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: T.tm, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {versions.join(' / ')}{sources.length > 0 && ` · ${sources.join(' / ')}`}
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
