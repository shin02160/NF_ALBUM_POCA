// ── 관리자 로그인 (Supabase Auth · 이메일/비밀번호) — PRD 4-6 ──────────
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { useStore } from '../../store/useStore';

const inputStyle: React.CSSProperties = {
  width: '100%', height: 48, borderRadius: 12, border: `1.5px solid ${T.b}`,
  background: T.s, padding: '0 14px', fontSize: 14, color: T.t, outline: 'none', fontFamily: T.f,
};

export function AdminLogin() {
  const authenticate = useStore((s) => s.authenticate);
  const isAuth = useStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isAuth) navigate('/admin/albums', { replace: true }); }, [isAuth, navigate]);
  useEffect(() => { emailRef.current?.focus(); }, []);

  const submit = async () => {
    if (!email || !password || checking) return;
    setChecking(true); setError('');
    const ok = await authenticate(email, password);
    setChecking(false);
    if (!ok) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다');
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: T.f, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f5f7 0%, #eaeefb 100%)' }}>
      <div className={shake ? 'shake' : ''} style={{ width: 420, maxWidth: '92vw', background: T.s, borderRadius: 24, border: `1px solid ${T.b}`, padding: '40px 40px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: T.pb, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon.lock c={T.p} sz={26} />
        </div>
        <img src={LOGO} alt="" style={{ height: 30, marginBottom: 6 }} />
        <p style={{ fontSize: 19, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 4 }}>관리자 인증</p>
        <p style={{ fontSize: 13, color: T.tm, marginBottom: 24, textAlign: 'center' }}>관리자 계정으로 로그인하세요</p>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input ref={emailRef} type="email" autoComplete="username" placeholder="이메일" value={email}
            onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" autoComplete="current-password" placeholder="비밀번호" value={password}
            onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

          {error && <p style={{ fontSize: 12, color: 'rgb(255,66,66)', marginTop: 2 }}>{error}</p>}

          <button type="submit" disabled={checking || !email || !password} style={{ marginTop: 8, width: '100%', height: 52, borderRadius: 14, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(51,102,255,0.28)', border: 'none', cursor: checking ? 'default' : 'pointer', fontFamily: T.f, opacity: (checking || !email || !password) ? 0.6 : 1 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{checking ? '확인 중…' : '로그인'}</span>
          </button>
        </form>
        <p style={{ fontSize: 11, color: T.tl, marginTop: 16 }}>Supabase Auth · 세션 유지 (새로고침해도 로그인 유지)</p>
      </div>
    </div>
  );
}
