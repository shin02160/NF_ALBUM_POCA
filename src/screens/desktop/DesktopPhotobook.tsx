// ── 데스크탑 포토북 — 편집 패널 + 미리보기 패널 ─────────────────────────
import { useEffect, useMemo, useRef, useState } from 'react';
import { T, STATUS, STATUS_ORDER, MC, MEMBERS, ALBUM_BANNER_GRADIENT } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import type { PocaCard as Card } from '../../types';

export function DesktopPhotobook() {
  const photobook = useStore((s) => s.photobook);
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const allAlbums = useStore(useShallow((s) => s.albums));
  const remove = useStore((s) => s.removeFromPhotobook);
  const clearPhotobook = useStore((s) => s.clearPhotobook);
  const ensureCards = useStore((s) => s.ensureCards);
  const albumIds = useStore(useShallow((s) => s.albums.map((a) => a.id)));
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { albumIds.forEach((id) => ensureCards(id)); }, [albumIds, ensureCards]);

  const bookCards = useMemo(() => {
    const map = new Map(cards.map((c) => [c.id, c]));
    return photobook.map((id) => map.get(id)).filter((c): c is Card => Boolean(c));
  }, [photobook, cards]);

  const editGroups = useMemo(() => {
    return allAlbums.map((album) => {
      const albumBookCards = bookCards.filter((c) => c.albumId === album.id);
      if (albumBookCards.length === 0) return null;
      const vGroups = album.versions.map((ver) => {
        const vCards = albumBookCards.filter((c) => c.version === ver);
        const sources = [...new Set(vCards.map((c) => c.source))];
        return {
          version: ver, sourceLabel: sources.join(' · '),
          memberRows: MEMBERS.map((m) => ({
            member: m,
            card: vCards.find((c) => !c.member.includes(',') && c.member.trim() === m) ?? null,
          })),
        };
      }).filter((g) => g.memberRows.some((r) => r.card));
      if (vGroups.length === 0) return null;
      return { album, vGroups };
    }).filter((ag): ag is NonNullable<typeof ag> => ag !== null);
  }, [allAlbums, bookCards]);

  const exportSections = useMemo(() => {
    return allAlbums.flatMap((album) =>
      album.versions.map((ver) => {
        const rows = MEMBERS.map((m) =>
          bookCards.find((c) => c.albumId === album.id && c.version === ver && !c.member.includes(',') && c.member.trim() === m),
        ).filter((c): c is Card => Boolean(c));
        const sources = [...new Set(rows.map((c) => c.source))];
        return { albumId: album.id, albumName: album.name, version: ver, sourceLabel: sources.join(' · '), rows };
      }).filter((s) => s.rows.length > 0),
    );
  }, [allAlbums, bookCards]);

  async function handleExport() {
    const el = exportRef.current;
    if (!el) return;
    try {
      setExporting(true);
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: T.bg });
      const link = document.createElement('a');
      link.download = `포토북_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
      alert('내보내기에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  }

  const bannerGrad = editGroups[0]?.album?.headerImageUrl
    ? `linear-gradient(120deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${editGroups[0].album.headerImageUrl}) center/cover`
    : ALBUM_BANNER_GRADIENT;

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* ── 왼쪽: 편집 패널 ── */}
      <div style={{ width: 420, background: T.s, borderRight: `1px solid ${T.b}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* 편집 헤더 */}
        <div style={{ height: 54, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.t }}>포토북 편집</span>
            <span style={{ height: 22, padding: '0 9px', borderRadius: 100, background: T.pb, display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: T.p, fontWeight: 700 }}>{bookCards.length}장</span>
            </span>
          </div>
          {bookCards.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={clearPhotobook} style={{ height: 32, padding: '0 12px', borderRadius: 8, border: `1px solid ${T.b}`, background: 'none', cursor: 'pointer', fontSize: 12, color: T.tm, fontWeight: 600, fontFamily: T.f }}>비우기</button>
              <button onClick={handleExport} disabled={exporting} style={{ height: 32, padding: '0 14px', borderRadius: 8, background: T.p, border: 'none', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', boxShadow: '0 2px 8px rgba(51,102,255,0.25)', fontFamily: T.f }}>
                <Icon.share c="#fff" />
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{exporting ? '저장 중...' : 'PNG 저장'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 상태 범례 */}
        <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', background: T.bg, borderBottom: `1px solid ${T.b}`, flexShrink: 0 }}>
          {STATUS_ORDER.map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, border: `2px solid ${STATUS[s].c}` }} />
              <span style={{ fontSize: 11, color: T.tm }}>{s}</span>
            </div>
          ))}
        </div>

        {/* 편집 리스트 */}
        <div style={{ flex: 1, overflowY: 'auto', background: T.s }}>
          {editGroups.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: T.tl, fontSize: 13, padding: '60px 0' }}>
              <Icon.book c={T.tl} />
              <p>포토북이 비어있습니다</p>
              <p style={{ fontSize: 12 }}>포카 상태 변경 시 포토북에 추가할 수 있어요</p>
            </div>
          ) : (
            editGroups.map(({ album, vGroups }) => (
              <div key={album.id}>
                {editGroups.length > 1 && (
                  <div style={{ padding: '8px 16px 4px', background: T.bg, borderBottom: `1px solid ${T.b}`, fontSize: 11, fontWeight: 700, color: T.p }}>{album.name}</div>
                )}
                {vGroups.map(({ version, sourceLabel, memberRows }) => (
                  <div key={version}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px 7px', background: T.bg, borderBottom: `1px solid ${T.b}` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.t }}>{version}</span>
                      {sourceLabel && <><span style={{ width: 1, height: 10, background: T.b }} /><span style={{ fontSize: 11, color: T.tm }}>{sourceLabel}</span></>}
                    </div>
                    {memberRows.map(({ member, card }) => (
                      <div key={member} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderBottom: `1px solid ${T.bl}` }}>
                        <div style={{ width: 46, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: MC[member] || T.tm }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: T.t }}>{member}</span>
                        </div>
                        {card
                          ? <div style={{ width: 44 }}><PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] as any} width={44} radius={6} /></div>
                          : <div style={{ width: 44, aspectRatio: '2/3', borderRadius: 6, background: T.bl, border: `1px dashed ${T.b}` }} />}
                        {card && (
                          <button onClick={() => remove(card.id)} style={{ marginLeft: 'auto', width: 26, height: 26, borderRadius: '50%', background: T.bl, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon.close c={T.tm} sz={9} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 오른쪽: 미리보기 패널 ── */}
      <div style={{ flex: 1, background: T.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px 12px', background: T.s, borderBottom: `1px solid ${T.b}`, flexShrink: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: T.t, marginBottom: 2 }}>포토북 미리보기</p>
          <p style={{ fontSize: 11, color: T.tl }}>PNG로 저장하거나 공유할 수 있습니다</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '28px 32px', overflowY: 'auto' }}>
          {exportSections.length === 0 ? (
            <div style={{ color: T.tl, fontSize: 13, textAlign: 'center', paddingTop: 60 }}>
              <p>미리보기할 포카가 없습니다</p>
            </div>
          ) : (
            <div ref={exportRef} style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, overflow: 'hidden', boxShadow: '0 8px 36px rgba(0,0,0,0.08)', width: '100%', maxWidth: 500 }}>
              {/* 미리보기 헤더 */}
              <div style={{ background: bannerGrad, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={LOGO} alt="" style={{ height: 18, filter: 'brightness(0) invert(1)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                    {editGroups.length === 1 ? editGroups[0].album.name : 'NF POCA 포토북'}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{new Date().toISOString().slice(0, 10)}</span>
              </div>
              {/* 상태 범례 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 18px', borderBottom: `1px solid ${T.b}`, background: T.bg }}>
                {STATUS_ORDER.map((s) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, border: `2.5px solid ${STATUS[s].c}` }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.tm }}>{s}</span>
                  </div>
                ))}
              </div>
              {/* 섹션 */}
              {exportSections.map((sec) => (
                <div key={`${sec.albumId}-${sec.version}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 18px 4px', borderBottom: `1px solid ${T.b}`, background: T.bg }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.t }}>{sec.version}</span>
                    {sec.sourceLabel && <><span style={{ width: 1, height: 10, background: T.b }} /><span style={{ fontSize: 10, color: T.tm }}>{sec.sourceLabel}</span></>}
                  </div>
                  {sec.rows.map((card) => (
                    <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 18px', borderBottom: `1px solid ${T.bl}` }}>
                      <div style={{ width: 36, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: MC[card.member] || T.tm }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: T.tm }}>{card.member}</span>
                      </div>
                      <div style={{ width: 38 }}><PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] as any} width={38} radius={5} /></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
