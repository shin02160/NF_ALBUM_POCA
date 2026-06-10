// ── 관리자 로그인 (6자리 PIN) — PRD 4-6, handoff 2-1 ───────────────────
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { useStore } from '../../store/useStore';

export function AdminLogin() {
  const authenticate = useStore((s) => s.authenticate);
  const isAuth = useStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isAuth) navigate('/admin/albums', { replace: true }); }, [isAuth, navigate]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  // 6자리 완성 시 자동 인증
  useEffect(() => {
    if (pin.length === 6) {
      const ok = authenticate(pin);
      if (!ok) {
        setShake(true);
        setTimeout(() => { setShake(false); setPin(''); }, 420);
      }
    }
  }, [pin, authenticate]);

  const digits = Array.from({ length: 6 }, (_, i) => pin[i] ?? '');

  return (
    <div style={{ minHeight: '100vh', fontFamily: T.f, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f5f7 0%, #eaeefb 100%)' }}>
      <div className={shake ? 'shake' : ''} style={{ width: 420, maxWidth: '92vw', background: T.s, borderRadius: 24, border: `1px solid ${T.b}`, padding: '40px 40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: T.pb, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon.lock c={T.p} sz={26} />
        </div>
        <img src={LOGO} alt="" style={{ height: 30, marginBottom: 6 }} />
        <p style={{ fontSize: 19, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 4 }}>관리자 인증</p>
        <p style={{ fontSize: 13, color: T.tm, marginBottom: 28, textAlign: 'center' }}>6자리 비밀번호를 입력해주세요</p>
        <div style={{ position: 'relative', marginBottom: 28 }} onClick={() => inputRef.current?.focus()}>
          <div style={{ display: 'flex', gap: 10 }}>
            {digits.map((d, i) => {
              const focused = i === pin.length;
              return (
                <div key={i} style={{ width: 48, height: 56, borderRadius: 12, border: `2px solid ${d ? T.p : focused ? T.p : T.b}`, background: d ? T.pb : T.s, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: focused ? '0 0 0 4px rgba(51,102,255,0.12)' : 'none' }}>
                  {d ? <span style={{ width: 12, height: 12, borderRadius: '50%', background: T.p }} /> : null}
                </div>
              );
            })}
          </div>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            value={pin}
            maxLength={6}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
          />
        </div>
        <button onClick={() => authenticate(pin)} style={{ width: '100%', height: 52, borderRadius: 14, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(51,102,255,0.28)', border: 'none', cursor: 'pointer', fontFamily: T.f }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>인증하기</span>
        </button>
        <p style={{ fontSize: 11, color: T.tl, marginTop: 16 }}>세션 내 유지 · 새로고침 시 재입력</p>
      </div>
    </div>
  );
}
