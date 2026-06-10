// ── 바텀시트 래퍼 (dimming + slide-up, handoff Interactions) ────────────
import { T } from '../theme/tokens';

export function BottomSheet({ onClose, dim = 0.5, children }: { onClose: () => void; dim?: number; children: React.ReactNode }) {
  return (
    <div className="sheet-overlay" style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: `rgba(15,15,18,${dim})` }} />
      <div className="sheet-panel" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: T.s, borderRadius: '22px 22px 0 0', overflow: 'hidden', boxShadow: '0 -12px 48px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 100, background: T.bl }} />
        </div>
        {children}
      </div>
    </div>
  );
}
