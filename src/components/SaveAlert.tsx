// ── 저장 결과 토스트 (PRD v0.9 Admin 공통) ────────────────────────────
import { useEffect, useState } from 'react';
import { T } from '../theme/tokens';

export type SaveAlertState = 'idle' | 'success' | 'error';

export function SaveAlert({ state }: { state: SaveAlertState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state === 'idle') { setVisible(false); return; }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [state]);

  if (!visible) return null;

  const isSuccess = state === 'success';
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, pointerEvents: 'none',
      background: isSuccess ? T.p : '#ef4444',
      color: '#fff', borderRadius: 12, padding: '11px 22px',
      fontSize: 14, fontWeight: 700, fontFamily: T.f,
      boxShadow: `0 6px 24px ${isSuccess ? 'rgba(51,102,255,0.35)' : 'rgba(239,68,68,0.35)'}`,
      whiteSpace: 'nowrap',
    }}>
      {isSuccess ? '저장되었습니다.' : '저장 실패되었습니다.'}
    </div>
  );
}

export function useSaveAlert() {
  const [alertState, setAlertState] = useState<SaveAlertState>('idle');
  const triggerSave = async (fn: () => Promise<void>) => {
    try {
      await fn();
      setAlertState('success');
    } catch {
      setAlertState('error');
    }
    setTimeout(() => setAlertState('idle'), 2700);
  };
  return { alertState, triggerSave };
}
