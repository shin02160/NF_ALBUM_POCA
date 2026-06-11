// ── 포토북 편집/내보내기 (PRD v0.8 1-7/1-8) ─────────────────────────────
import { useMemo, useRef, useState } from 'react';
import { T, STATUS, STATUS_ORDER, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import type { PocaCard as Card } from '../../types';

export function Photobook() {
  const photobook = useStore((s) => s.photobook);
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  const remove = useStore((s) => s.removeFromPhotobook);

  const [mode, setMode] = useState<'edit' | 'export'>('edit');
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // 포토북에 담긴 카드
  const bookCards = useMemo(() => {
    const map = new Map(cards.map((c) => [c.id, c]));
    return photobook.map((id) => map.get(id)).filter((c): c is Card => Boolean(c));
  }, [photobook, cards]);

  const empty = bookCards.length === 0;

  // 버전별 섹션 (편집용 — 포토북 카드만)
  const editGroups = useMemo(() => {
    const versions = album?.versions || [];
    return versions.map((ver) => {
      const vCards = bookCards.filter((c) => c.version === ver);
      const sources = [...new Set(vCards.map((c) => c.source))];
      return {
        version: ver,
        sourceLabel: sources.join(' · '),
        memberRows: MEMBERS.map((m) => ({ member: m, card: vCards.find((c) => c.member === m) ?? null })),
      };
    }).filter((g) => g.memberRows.some((r) => r.card));
  }, [album, bookCards]);

  // 버전별 섹션 (내보내기용 — 포토북 카드를 멤버 순서로)
  const exportSections = useMemo(() => {
    const versions = album?.versions || [];
    return versions.map((ver) => {
      const rows = MEMBERS.map((m) => bookCards.find((c) => c.version === ver && c.member === m)).filter(Boolean) as Card[];
      const sources = [...new Set(rows.map((c) => c.source))];
      return { version: ver, sourceLabel: sources.join(' · '), rows };
    }).filter((s) => s.rows.length > 0);
  }, [album, bookCards]);

  const fileName = useMemo(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `nf_poca_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.png`;
  }, [mode]);

  async function captureCanvas(): Promise<HTMLCanvasElement | null> {
    if (!exportRef.current) return null;
    const { default: html2canvas } = await import('html2canvas');
    return html2canvas(exportRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
  }

  async function savePng() {
    setExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('PNG 저장 실패', e);
      alert('PNG 저장에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  }

  async function share() {
    setExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      if (!blob) return;
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'NF ALBUM POCA' });
      } else {
        await savePng();
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') console.error(e);
    } finally {
      setExporting(false);
    }
  }

  // ── 내보내기 모드 ───────────────────────────────────────────────────
  if (mode === 'export') {
    return (
      <>
        <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 12px', flexShrink: 0 }}>
          <button onClick={() => setMode('edit')} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon.back />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: T.t }}>포토북 내보내기</span>
        </div>
        <div style={{ flex: 1, padding: '16px 20px 14px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          {/* PNG 캡처 대상 */}
          <div ref={exportRef} style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, overflow: 'hidden', boxShadow: '0 6px 28px rgba(0,0,0,0.06)' }}>
            {/* 헤더 */}
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={LOGO} alt="" style={{ height: 18 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: T.tm, letterSpacing: '0.04em' }}>{album?.name}</span>
              </div>
              <p style={{ fontSize: 11, color: T.tl }}>{new Date().toISOString().slice(0, 10).replace(/-/g, '.')}</p>
            </div>
            {/* 상태 범례 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 14px', borderBottom: `1px solid ${T.b}`, background: T.bg }}>
              {STATUS_ORDER.map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, border: `2.5px solid ${STATUS[s].c}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: T.tm, fontFamily: T.f }}>{s}</span>
                </div>
              ))}
            </div>
            {/* 버전별 섹션 */}
            {exportSections.map(({ version, sourceLabel, rows }) => (
              <div key={version}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px 5px', borderBottom: `1px solid ${T.b}`, background: T.bg }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.t }}>{version}</span>
                  {sourceLabel && (
                    <>
                      <span style={{ width: 1, height: 10, background: T.b }} />
                      <span style={{ fontSize: 10, color: T.tm }}>{sourceLabel}</span>
                    </>
                  )}
                </div>
                {rows.map((card) => (
                  <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderBottom: `1px solid ${T.bl}` }}>
                    <div style={{ width: 34, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: MC[card.member] || T.tm }} />
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: T.tm, whiteSpace: 'nowrap' }}>{card.member}</span>
                    </div>
                    <div style={{ width: 38 }}>
                      <PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] ?? null} width={38} radius={5} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: T.tl, textAlign: 'center' }}>{fileName}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={share} disabled={exporting} style={btnStyle}><Icon.share /><span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>공유하기</span></button>
            <button onClick={savePng} disabled={exporting} style={btnStyle}><span style={{ fontSize: 15, color: T.t }}>↓</span><span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>{exporting ? '저장 중…' : 'PNG 저장'}</span></button>
          </div>
        </div>
      </>
    );
  }

  // ── 편집 모드 ───────────────────────────────────────────────────────
  return (
    <>
      {/* 헤더 */}
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', color: T.t }}>포토북</span>
        <div style={{ height: 22, padding: '0 9px', borderRadius: 100, background: T.pb, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: T.p, fontWeight: 700 }}>{bookCards.length}장</span>
        </div>
      </div>
      {/* 안내 배너 */}
      <div style={{ background: T.pb, padding: '9px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: T.p }}>포카를 탭해서 포토북에 담아보세요</span>
        <span style={{ fontSize: 11, color: T.p, fontWeight: 600, opacity: 0.7 }}>상태 테두리 유지</span>
      </div>
      {/* 상태 범례 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 16px', borderBottom: `1px solid ${T.b}`, background: T.bg, flexShrink: 0 }}>
        {STATUS_ORDER.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, border: `2.5px solid ${STATUS[s].c}`, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: T.tm, fontFamily: T.f }}>{s}</span>
          </div>
        ))}
      </div>
      {/* 버전별 섹션 */}
      <div style={{ flex: 1, background: T.s, overflowY: 'auto' }}>
        {empty ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: T.tl }}>
            <Icon.book c={T.tl} sz={36} />
            <span style={{ fontSize: 13 }}>포토북이 비어있어요</span>
            <span style={{ fontSize: 12 }}>포카를 탭해서 담아보세요</span>
          </div>
        ) : (
          editGroups.map(({ version, sourceLabel, memberRows }) => (
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
                <div key={member} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderBottom: `1px solid ${T.bl}` }}>
                  <div style={{ flexShrink: 0, opacity: card ? 1 : 0.25 }}><Icon.drag /></div>
                  <div style={{ width: 44, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: MC[member] || T.tm, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.t, whiteSpace: 'nowrap' }}>{member}</span>
                  </div>
                  {card
                    ? <div style={{ width: 46 }}><PocaCard member={card.member} img={card.imageUrl} status={statusMap[card.id] ?? null} width={46} radius={6} /></div>
                    : <div style={{ width: 46, aspectRatio: '2/3', borderRadius: 6, background: T.bl, border: `1px dashed ${T.b}` }} />}
                  {card && (
                    <button onClick={() => remove(card.id)} style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: '50%', background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none', cursor: 'pointer' }}>
                      <Icon.close c={T.tm} sz={9} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      {/* 내보내기 버튼 */}
      <div style={{ padding: '12px 16px', background: T.s, borderTop: `1px solid ${T.b}`, flexShrink: 0 }}>
        <button onClick={() => !empty && setMode('export')} disabled={empty} style={{ width: '100%', height: 52, borderRadius: 14, background: empty ? T.b : T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: empty ? 'none' : '0 4px 20px rgba(51,102,255,0.26)', border: 'none', cursor: empty ? 'default' : 'pointer', fontFamily: T.f }}>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>포토북 내보내기</span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>→</span>
        </button>
      </div>
    </>
  );
}

const btnStyle: React.CSSProperties = {
  flex: 1, height: 52, borderRadius: 12, border: `1.5px solid ${T.b}`, background: T.s,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer', fontFamily: T.f,
};
