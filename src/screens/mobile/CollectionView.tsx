// ── 모아보기: 전체 / 앨범별 필터 ─────────────────────────────────────────
import { useMemo, useState } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { filterLabel } from '../../lib/selectors';
import type { PocaCard as Card } from '../../types';

type MemberRow = { member: string; card: Card | null };
type VerGroup = { version: string; sourceLabel: string; memberRows: MemberRow[] };
type AlbumGroup = {
  albumId: string; albumName: string;
  versions: string[]; sources: string[];
  versionGroups: VerGroup[];
};

export function CollectionView() {
  const albums = useStore((s) => s.albums);
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const filters = useStore((s) => s.filters);
  const openStatusSheet = useStore((s) => s.openStatusSheet);
  const openFilterModal = useStore((s) => s.openFilterModal);
  const selectAlbum = useStore((s) => s.selectAlbum);
  const resetFilters = useStore((s) => s.resetFilters);

  const [albumFilter, setAlbumFilter] = useState<string | null>(null);

  function handleAlbumSelect(id: string | null) {
    setAlbumFilter(id);
    if (id !== null) {
      void selectAlbum(id); // selectAlbum already resets filters
    } else {
      resetFilters();
    }
  }

  const contentData = useMemo((): { mode: 'all'; albumGroups: AlbumGroup[] } | { mode: 'album'; versionGroups: VerGroup[] } => {
    if (albumFilter === null) {
      const albumGroups: AlbumGroup[] = [];
      for (const album of albums) {
        const albumCards = cards.filter((c) => c.albumId === album.id);
        const verGroups: VerGroup[] = album.versions.map((ver) => {
          const vCards = albumCards.filter((c) => c.version === ver);
          const sources = [...new Set(vCards.map((c) => c.source))];
          const memberRows = MEMBERS
            .map((m) => ({ member: m, card: vCards.find((c) => c.member === m) ?? null }))
            .filter((r) => r.card !== null);
          return { version: ver, sourceLabel: sources.join(' · '), memberRows };
        }).filter((g) => g.memberRows.length > 0);

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

    const versionGroups: VerGroup[] = versions.map((ver) => {
      let vCards = albumCards.filter((c) => c.version === ver);
      if (filters.source.length > 0) vCards = vCards.filter((c) => filters.source.includes(c.source));
      const sources = [...new Set(albumCards.filter((c) => c.version === ver).map((c) => c.source))];
      const membersToShow = filters.member.length > 0 ? MEMBERS.filter((m) => filters.member.includes(m)) : MEMBERS;
      const memberRows = membersToShow
        .map((m) => ({ member: m, card: vCards.find((c) => c.member === m) ?? null }))
        .filter((r) => !(filters.source.length > 0 && !r.card));
      return { version: ver, sourceLabel: sources.join(' · '), memberRows };
    }).filter((g) => g.memberRows.length > 0);

    return { mode: 'album', versionGroups };
  }, [albums, cards, albumFilter, filters]);

  return (
    <>
      {/* 헤더 */}
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" style={{ height: 46, width: 'auto' }} />
      </div>

      {/* 앨범 chip 선택 */}
      <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '10px 0', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {/* 전체 chip */}
          <button
            onClick={() => handleAlbumSelect(null)}
            style={{
              height: 52, padding: '0 16px', borderRadius: 10,
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
                  minWidth: 108, padding: '7px 13px', borderRadius: 10,
                  border: `${on ? 1.5 : 1}px solid ${on ? T.p : T.b}`,
                  background: on ? T.pb : T.s,
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
                  cursor: 'pointer', fontFamily: T.f, flexShrink: 0, textAlign: 'left',
                  boxShadow: on ? '0 2px 8px rgba(51,102,255,0.12)' : 'none',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: on ? T.p : T.t, whiteSpace: 'nowrap' }}>{album.name}</span>
                <span style={{ fontSize: 10, color: on ? T.p : T.tl, whiteSpace: 'nowrap', opacity: on ? 0.8 : 1 }}>
                  {album.versions.join(' / ')}
                  {album.sources.length > 0 && ` · ${album.sources.join(' / ')}`}
                </span>
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
                {versionGroups.map(({ version, sourceLabel, memberRows }) => (
                  <div key={version}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px 6px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.t }}>{version}</span>
                      {sourceLabel && (
                        <>
                          <span style={{ width: 1, height: 10, background: T.b }} />
                          <span style={{ fontSize: 11, color: T.tm }}>{sourceLabel}</span>
                        </>
                      )}
                    </div>
                    {memberRows.map(({ member, card }) => (
                      <button
                        key={member}
                        onClick={() => card && openStatusSheet(card.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${T.bl}`, cursor: card ? 'pointer' : 'default', textAlign: 'left', fontFamily: T.f }}
                      >
                        <div style={{ width: 44, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: MC[member] || T.tm, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: T.t, whiteSpace: 'nowrap' }}>{member}</span>
                        </div>
                        <div style={{ width: 52 }}>
                          <PocaCard member={card!.member} img={card!.imageUrl} status={statusMap[card!.id] ?? null} width={52} radius={6} />
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )
        ) : (
          contentData.versionGroups.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13 }}>표시할 포카가 없습니다</div>
          ) : (
            contentData.versionGroups.map(({ version, sourceLabel, memberRows }) => (
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
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${T.bl}`, cursor: card ? 'pointer' : 'default', textAlign: 'left', fontFamily: T.f }}
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
            ))
          )
        )}
      </div>
    </>
  );
}
