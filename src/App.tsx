import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { T } from './theme/tokens';
import { useIsDesktop } from './hooks/useIsDesktop';
import { MobileShell } from './screens/mobile/MobileShell';
import { DesktopShell } from './screens/desktop/DesktopShell';
import { AdminLogin } from './screens/admin/AdminLogin';
import { AdminLayout } from './screens/admin/AdminLayout';
import { AdminCategories } from './screens/admin/AdminCategories';
import { AdminPocas } from './screens/admin/AdminPocas';

function AppShell() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopShell /> : <MobileShell />;
}

export default function App() {
  const loadData = useStore((s) => s.loadData);
  const hydrateAuth = useStore((s) => s.hydrateAuth);
  const loading = useStore((s) => s.loading);

  useEffect(() => { loadData(); hydrateAuth(); }, [loadData, hydrateAuth]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, color: T.tm, fontSize: 14 }}>
        불러오는 중…
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/category" replace />} />
        <Route path="/category" element={<AppShell />} />
        <Route path="/collection" element={<AppShell />} />
        <Route path="/dash" element={<AppShell />} />
        <Route path="/book" element={<AppShell />} />
        {/* 구버전 경로 호환 */}
        <Route path="/album" element={<Navigate to="/category" replace />} />
        <Route path="/list" element={<Navigate to="/category" replace />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="categories" element={<AdminCategories />} />
          <Route path="pocas" element={<AdminPocas />} />
          {/* 구버전 경로 호환 */}
          <Route path="albums" element={<Navigate to="/admin/categories" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
