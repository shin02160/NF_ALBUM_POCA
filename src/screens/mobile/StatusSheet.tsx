// ── 상태 선택 바텀시트 (PRD 4-3, handoff 1-4) ──────────────────────────
import { T, STATUS, STATUS_ORDER } from '../../theme/tokens';
import { Pill } from '../../components/atoms';
import { Icon } from '../../components/icons';
import { PocaCard } from '../../components/PocaCard';
import { BottomSheet } from '../../components/BottomSheet';
import { useStore } from '../../store/useStore';

export function StatusSheet() {
  const cardId = useStore((s) => s.statusSheet.cardId);
  const card = useStore((s) => s.cards.find((c) => c.id === cardId));
  const status = useStore((s) => (cardId ? s.statusMap[cardId] ?? null : null));
  const close = useStore((s) => s.closeStatusSheet);
  const toggleStatus = useStore((s) => s.toggleStatus);
  const setStatus = useStore((s) => s.setStatus);
  const addToPhotobook = useStore((s) => s.addToPhotobook);
  const inBook = useStore((s) => (cardId ? s.photobook.includes(cardId) : false));

  if (!card) return null;

  const memberDisplay = card.member.split(',').map((s) => s.trim()).join(' · ');

  return (
    <BottomSheet onClose={close} dim={0.55}>
      {/* 닫기 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px 0', marginTop: -6 }}>
        <button onClick={close} style={{ width: 32, height: 32, borderRadius: '50%', background: T.bl, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.close c={T.tm} sz={12} />
        </button>
      </div>
      {/* Card preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0 8px', gap: 12 }}>
        <div style={{ width: 132, filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.18))' }}>
          <PocaCard member={card.member} img={card.imageUrl} status={status} radius={12} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: T.t, marginBottom: 4 }}>{memberDisplay}</p>
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            <Pill label={card.version} tone="blue" />
            <Pill label={card.source} />
          </div>
        </div>
      </div>
      {/* Status buttons */}
      <div style={{ padding: '8px 20px 4px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <p style={{ fontSize: 12, color: T.tm, fontWeight: 600, marginBottom: 2 }}>소장 상태 선택</p>
        {STATUS_ORDER.map((s) => {
          const on = s === status;
          const sc = STATUS[s].c;
          return (
            <button key={s} onClick={() => toggleStatus(card.id, s)} style={{ height: 52, borderRadius: 13, border: `2px solid ${on ? sc : T.b}`, background: on ? STATUS[s].bg : T.s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', cursor: 'pointer', fontFamily: T.f }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, background: sc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <Icon.check sz={11} />}</span>
                <span style={{ fontSize: 15, fontWeight: on ? 700 : 500, color: on ? sc : T.t }}>{s}</span>
              </div>
            </button>
          );
        })}
      </div>
      {/* Photobook + clear */}
      <div style={{ padding: '12px 20px 28px', display: 'flex', gap: 10 }}>
        <button onClick={() => setStatus(card.id, null)} style={{ flex: 1, height: 50, borderRadius: 13, border: `1.5px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', fontFamily: T.f }}>
          <span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>상태 해제</span>
        </button>
        <button onClick={() => { addToPhotobook(card.id); close(); }} style={{ flex: 1.6, height: 50, borderRadius: 13, background: inBook ? T.tm : T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 16px rgba(51,102,255,0.26)', border: 'none', cursor: 'pointer', fontFamily: T.f }}>
          <Icon.book c="#fff" sz={16} />
          <span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>{inBook ? '담김' : '포토북에 담기'}</span>
        </button>
      </div>
    </BottomSheet>
  );
}
