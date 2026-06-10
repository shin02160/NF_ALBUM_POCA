// ── 모바일 셸: 탭 전환 + 오버레이 (PRD 4 / handoff 네비게이션) ──────────
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { SBar } from '../../components/atoms';
import { BottomTab, type TabId } from '../../components/BottomTab';
import { useStore } from '../../store/useStore';
import { PocaListScreen } from './PocaListScreen';
import { Dashboard } from './Dashboard';
import { Photobook } from './Photobook';
import { StatusSheet } from './StatusSheet';
import { FilterModal } from './FilterModal';

const VALID: TabId[] = ['list', 'dash', 'book'];

export function MobileShell() {
  const loc = useLocation();
  const tab = loc.pathname.replace('/', '');
  const navigate = useNavigate();
  const selectedAlbumId = useStore((s) => s.selectedAlbumId);
  const photobook = useStore((s) => s.photobook);
  const statusSheetOpen = useStore((s) => s.statusSheet.open);
  const filterModalOpen = useStore((s) => s.filterModal.open);

  const active = (VALID.includes(tab as TabId) ? tab : 'list') as TabId;

  // 앨범 미선택 시 선택 화면으로
  useEffect(() => {
    if (!selectedAlbumId) navigate('/', { replace: true });
  }, [selectedAlbumId, navigate]);

  if (!selectedAlbumId) return null;

  return (
    <PhoneFrame bg={active === 'list' ? '#ffffff' : '#f5f5f7'}>
      <SBar />
      {active === 'list' && <PocaListScreen />}
      {active === 'dash' && <Dashboard />}
      {active === 'book' && <Photobook />}
      <BottomTab active={active} bookCount={photobook.length} onChange={(id) => navigate(`/${id}`)} />
      {statusSheetOpen && <StatusSheet />}
      {filterModalOpen && <FilterModal />}
    </PhoneFrame>
  );
}
