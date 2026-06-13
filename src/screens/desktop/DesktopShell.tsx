// ── 데스크탑 셸 — 사이드바 + 콘텐츠 영역 ────────────────────────────────
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { T } from '../../theme/tokens';
import { useStore } from '../../store/useStore';
import { DesktopSidebar, type DesktopTabId } from './DesktopSidebar';
import { DesktopCategoryHome } from './DesktopCategoryHome';
import { DesktopCollectionView } from './DesktopCollectionView';
import { DesktopDashboard } from './DesktopDashboard';
import { DesktopPhotobook } from './DesktopPhotobook';
import { StatusSheet } from '../mobile/StatusSheet';
import { FilterModal } from '../mobile/FilterModal';

const VALID: DesktopTabId[] = ['category', 'collection', 'dash', 'book'];

export function DesktopShell() {
  const loc = useLocation();
  const navigate = useNavigate();
  const photobook = useStore((s) => s.photobook);
  const cards = useStore((s) => s.cards);
  const statusSheetOpen = useStore((s) => s.statusSheet.open);
  const filterModalOpen = useStore((s) => s.filterModal.open);

  const bookCount = useMemo(() => {
    const ids = new Set(cards.map((c) => c.id));
    return photobook.filter((id) => ids.has(id)).length;
  }, [photobook, cards]);

  const rawTab = loc.pathname.replace('/', '');
  const active = (VALID.includes(rawTab as DesktopTabId) ? rawTab : 'category') as DesktopTabId;

  function handleTabChange(id: DesktopTabId) {
    navigate(`/${id}`);
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: T.bg, fontFamily: T.f }}>
      <DesktopSidebar active={active} bookCount={bookCount} onChange={handleTabChange} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {active === 'category'   && <DesktopCategoryHome />}
        {active === 'collection' && <DesktopCollectionView />}
        {active === 'dash'       && <DesktopDashboard />}
        {active === 'book'       && <DesktopPhotobook />}
      </div>
      {/* 상태 변경 바텀시트 / 필터 모달 — 데스크탑에서도 오버레이로 노출 */}
      {statusSheetOpen && <StatusSheet />}
      {filterModalOpen && <FilterModal />}
    </div>
  );
}
