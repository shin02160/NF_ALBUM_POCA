import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { T } from './theme/tokens';
import { PhoneFrame } from './components/PhoneFrame';
import { AlbumSelect } from './screens/mobile/AlbumSelect';
import { MobileShell } from './screens/mobile/MobileShell';
import { AdminLogin } from './screens/admin/AdminLogin';
import { AdminLayout } from './screens/admin/AdminLayout';
import { AdminAlbums } from './screens/admin/AdminAlbums';
import { AdminPocas } from './screens/admin/AdminPocas';

export default function App() {
  const loadData = useStore((s) => s.loadData);
  const hydrateAuth = useStore((s) => s.hydrateAuth);
  const loading = useStore((s) => s.loading);
  const selectedAlbumId = useStore((s) => s.selectedAlbumId);

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
        {/* 앨범 미선택 시 → AlbumSelect (탭바 없음), 선택 시 → collection */}
        <Route path="/" element={selectedAlbumId ? <Navigate to="/collection" replace /> : <PhoneFrame><AlbumSelect /></PhoneFrame>} />
        <Route path="/collection" element={<MobileShell />} />
        <Route path="/album" element={<MobileShell />} />
        <Route path="/dash" element={<MobileShell />} />
        <Route path="/book" element={<MobileShell />} />
        {/* 구버전 경로 호환 */}
        <Route path="/list" element={<Navigate to="/album" replace />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="albums" element={<AdminAlbums />} />
          <Route path="pocas" element={<AdminPocas />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
