// ── 모아보기: 버전별 섹션 · 멤버행 (PRD v0.8 1-4) ─────────────────────
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, MC, STATUS, STATUS_ORDER, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';

export function CollectionView() {
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  const albumId = useStore((s) => s.selectedAlbumId);
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const openStatusSheet = useStore((s) => s.openStatusSheet);
  const navigate = useNavigate();

  const versionGroups = useMemo(() => {
    const versions = album?.versions || [];
    const albumCards = cards.filter((c) => c.albumId === albumId);
    return versions.map((ver) => {
      const vCards = albumCards.filter((c) => c.version === ver);
      const sources = [...new Set(vCards.map((c) => c.source))];
      return {
        version: ver,
        sourceLabel: sources.join(' · '),
        memberRows: MEMBERS.map((m) => ({ member: m, card: vCards.find((c) => c.member === m) ?? null })),
      };
    });
  }, [album, cards, albumId]);

  return (
    <>
      {/* 헤더 */}
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" style={{ height: 46, width: 'auto' }} />
        <button onClick={() => navigate('/')} style={{ height: 30, padding: '0 12px', borderRadius: 100, background: T.bl, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.f }}>
          <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>{album?.name} ▾</span>
        </button>
      </div>
      {/* 타이틀 */}
      <div style={{ padding: '14px 16px 8px', flexShrink: 0, background: T.s, borderBottom: `1px solid ${T.b}` }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 2 }}>모아보기</p>
        <p style={{ fontSize: 13, color: T.tm }}>버전별 전체 포카 현황</p>
      </div>
      {/* 상태 범례 */}
      <div style={{ height: 34, background: T.bg, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        {STATUS_ORDER.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, border: `2px solid ${STATUS[s].c}` }} />
            <span style={{ fontSize: 11, color: T.tm, fontFamily: T.f }}>{s}</span>
          </div>
        ))}
      </div>
      {/* 버전별 섹션 */}
      <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
        {versionGroups.map(({ version, sourceLabel, memberRows }) => (
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
    </>
  );
}
