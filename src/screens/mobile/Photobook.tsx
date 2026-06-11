// ── 포토북 편집/내보내기 (PRD 4-5, handoff 1-6/1-7) ────────────────────
import { useMemo, useRef, useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { T, STATUS, ALBUM_BANNER_GRADIENT } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { MemberBadge } from '../../components/atoms';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { useStore } from '../../store/useStore';
import type { PocaCard as Card } from '../../types';

function SortableRow({ card }: { card: Card }) {
  const status = useStore((s) => s.statusMap[card.id] ?? null);
  const remove = useStore((s) => s.removeFromPhotobook);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform), transition,
    display: 'flex', gap: 11, padding: '10px 16px', borderBottom: `1px solid ${T.b}`,
    alignItems: 'center', background: isDragging ? T.pb : T.s, opacity: isDragging ? 0.9 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} style={{ flexShrink: 0, cursor: 'grab', touchAction: 'none' }}><Icon.drag /></div>
      <div style={{ width: 42, flexShrink: 0 }}><PocaCard member={card.member} img={card.imageUrl} status={status} width={42} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.t, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</p>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <MemberBadge member={card.member} />
          {status && <span style={{ fontSize: 11, fontWeight: 700, color: STATUS[status].c }}>{status}</span>}
        </div>
      </div>
      <button onClick={() => remove(card.id)} style={{ width: 30, height: 30, borderRadius: '50%', background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none', cursor: 'pointer' }}><Icon.close c={T.tm} sz={9} /></button>
    </div>
  );
}

export function Photobook() {
  const photobook = useStore((s) => s.photobook);
  const cards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  const reorder = useStore((s) => s.reorderPhotobook);

  const [mode, setMode] = useState<'edit' | 'export'>('edit');
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  // 포토북 카드 (photobook 순서 유지)
  const bookCards = useMemo(() => {
    const map = new Map(cards.map((c) => [c.id, c]));
    return photobook.map((id) => map.get(id)).filter((c): c is Card => Boolean(c));
  }, [photobook, cards]);

  // 해당 앨범의 모든 카드 (내보내기용)
  const allAlbumCards = useMemo(() =>
    cards.filter((c) => c.albumId === album?.id).sort((a, b) => a.sortOrder - b.sortOrder),
    [cards, album?.id],
  );

  const fileName = useMemo(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `nf_poca_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.png`;
  }, [mode]);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIdx = photobook.indexOf(active.id as string);
      const newIdx = photobook.indexOf(over.id as string);
      reorder(arrayMove(photobook, oldIdx, newIdx));
    }
  }

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
      // 플랫폼별 공유 분기 (PRD 4-5)
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

  const empty = bookCards.length === 0;

  if (mode === 'export') {
    const albumBg = album?.headerImage
      ? `linear-gradient(120deg, rgba(0,0,0,0.45), rgba(0,0,0,0.15)), url(${album.headerImage}) center/cover`
      : ALBUM_BANNER_GRADIENT;

    return (
      <>
        {/* 상단: 앨범 헤더와 동일 + 뒤로가기 */}
        <div style={{ height: 96, position: 'relative', flexShrink: 0, overflow: 'hidden', background: albumBg }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }} />
          <button
            onClick={() => setMode('edit')}
            style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon.back c="#fff" />
          </button>
          <div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <img src={LOGO} alt="" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{album?.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{[album?.sub, album?.year].filter(Boolean).join(' · ')}</p>
            </div>
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', background: T.bg }}>
          {/* PNG 캡처 대상 */}
          <div ref={exportRef} style={{ background: T.s, margin: '16px 16px 0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            {/* 내보내기 헤더 */}
            <div style={{ background: albumBg, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={LOGO} alt="" style={{ height: 18, filter: 'brightness(0) invert(1)' }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{album?.name}</p>
                  {(album?.sub || album?.year) && (
                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', marginTop: 1 }}>{[album?.sub, album?.year].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{new Date().toISOString().slice(0, 10).replace(/-/g, '.')}</p>
            </div>
            {/* 앨범 전체 카드 그리드 (멤버 이름 미노출, 상태 테두리 유지) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '12px 12px 14px' }}>
              {allAlbumCards.map((card) => {
                const st = statusMap[card.id] ?? null;
                return (
                  <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <PocaCard member={card.member} img={card.imageUrl} status={st} radius={5} hideName />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 1px' }}>
                      <p style={{ fontSize: 7, color: T.tl, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ver. {card.version}</p>
                      <p style={{ fontSize: 7.5, color: T.tm, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.member}</p>
                      <p style={{ fontSize: 7, color: T.tl, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.source}</p>
                      {st
                        ? <p style={{ fontSize: 7, color: STATUS[st].c, fontWeight: 700 }}>{st}</p>
                        : <p style={{ fontSize: 7, color: T.b }}>—</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 파일명 + 액션 버튼 */}
          <div style={{ padding: '12px 16px 20px' }}>
            <p style={{ fontSize: 11, color: T.tl, textAlign: 'center', marginBottom: 12 }}>{fileName}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={share} disabled={exporting} style={btnStyle}><Icon.share /><span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>공유하기</span></button>
              <button onClick={savePng} disabled={exporting} style={btnStyle}><span style={{ fontSize: 15, color: T.t }}>↓</span><span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>{exporting ? '저장 중…' : 'PNG 저장'}</span></button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', color: T.t }}>포토북</span>
        <div style={{ height: 22, padding: '0 9px', borderRadius: 100, background: T.pb, display: 'flex', alignItems: 'center' }}><span style={{ fontSize: 11, color: T.p, fontWeight: 700 }}>{bookCards.length}장</span></div>
      </div>
      <div style={{ background: T.pb, padding: '9px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: T.p }}>드래그해서 순서를 바꿀 수 있어요</span>
        <span style={{ fontSize: 11, color: T.p, fontWeight: 600, opacity: 0.7 }}>상태 테두리 유지</span>
      </div>
      <div style={{ flex: 1, background: T.s, overflowY: 'auto' }}>
        {empty ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: T.tl }}>
            <Icon.book c={T.tl} sz={36} />
            <span style={{ fontSize: 13 }}>포토북이 비어있어요</span>
            <span style={{ fontSize: 12 }}>포카를 탭해서 담아보세요</span>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={photobook} strategy={verticalListSortingStrategy}>
              {bookCards.map((card) => <SortableRow key={card.id} card={card} />)}
            </SortableContext>
          </DndContext>
        )}
      </div>
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
