// ── 관리자 레이아웃 + 상단바 (handoff 2-2 AdminBar) ────────────────────
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { T } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { useStore } from '../../store/useStore';

export function AdminLayout() {
  const isAuth = useStore((s) => s.isAuthenticated);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const loc = useLocation();

  if (!isAuth) return <Navigate to="/admin" replace />;

  const tab = loc.pathname.includes('/pocas') ? 1 : 0;
  const tabs = [
    { label: '앨범 관리', path: '/admin/albums' },
    { label: '포카 관리', path: '/admin/pocas' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: T.f, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ height: 60, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 28, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={LOGO} alt="" style={{ height: 34 }} />
          <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: T.pb, color: T.p }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map((tb, i) => (
            <button key={tb.label} onClick={() => navigate(tb.path)} style={{ height: 36, padding: '0 16px', borderRadius: 9, background: tab === i ? T.pb : 'transparent', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer', fontFamily: T.f }}>
              <span style={{ fontSize: 14, fontWeight: tab === i ? 700 : 500, color: tab === i ? T.p : T.tm }}>{tb.label}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: T.tm }}>Shin · 관리자</span>
          <button onClick={() => { logout(); navigate('/admin'); }} style={{ height: 34, padding: '0 14px', borderRadius: 100, border: `1px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', cursor: 'pointer' }}><span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>로그아웃</span></button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Outlet />
      </div>
    </div>
  );
}
