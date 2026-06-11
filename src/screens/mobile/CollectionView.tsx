// ── 모아보기: 버전별 섹션 · 멤버행 (PRD v0.8 1-4) ─────────────────────
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { filterLabel } from '../../lib/selectors';

export function CollectionView() {
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  const albumId = useStore((s) => s.selectedAlbumId);
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const filters = useStore((s) => s.filters);
  const openStatusSheet = useStore((s) => s.openStatusSheet);
  const openFilterModal = useStore((s) => s.openFilterModal);
  const navigate = useNavigate();

  const versionGroups = useMemo(() => {
    const versions = filters.version.length > 0
      ? (album?.versions || []).filter((v) => filters.version.includes(v))
      : (album?.versions || []);

    const albumCards = cards.filter((c) => c.albumId === albumId);
    return versions.map((ver) => {
      let vCards = albumCards.filter((c) => c.version === ver);
      if (filters.source.length > 0) vCards = vCards.filter((c) => filters.source.includes(c.source));

      const sources = [...new Set(vCards.map((c) => c.source))];
      const membersToShow = filters.member.length > 0 ? MEMBERS.filter((m) => filters.member.includes(m)) : MEMBERS;

      const memberRows = membersToShow
        .map((m) => ({ member: m, card: vCards.find((c) => c.member === m) ?? null }))
        .filter((r) => !(filters.source.length > 0 && !r.card));

      return { version: ver, sourceLabel: sources.join(' · '), memberRows };
    }).filter((g) => g.memberRows.length > 0);
  }, [album, cards, albumId, filters]);

  return (
    <>
      {/* 헤더 */}
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" style={{ height: 46, width: 'auto' }} />
        <button onClick={() => navigate('/')} style={{ height: 30, padding: '0 12px', borderRadius: 100, background: T.bl, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.f }}>
          <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>{album?.name} ▾</span>
        </button>
      </div>
      {/* 필터 */}
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
      {/* 버전별 섹션 */}
      <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
        {versionGroups.length === 0
          ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13 }}>
              표시할 포카가 없습니다
            </div>
          )
          : versionGroups.map(({ version, sourceLabel, memberRows }) => (
            <div key={version}>
              {/* 섹션 헤더 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px 8px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{version}</span>
                {sourceLabel && (
                  <>
                    <span style={{ width: 1, height: 12, background: T.b }} />
                    <span style={{ fontSize: 12, color: T.tm, fontWeight: 500 }}>{sourceLabel}</span>
                  </>
                )}
              </div>
              {/* 멤버행 */}
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
          ))}
      </div>
    </>
  );
}
