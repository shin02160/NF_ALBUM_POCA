// ── 모바일 셸: 탭 전환 + 오버레이 ────────────────────────────────────────
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { BottomTab, type TabId } from '../../components/BottomTab';
import { useStore } from '../../store/useStore';
import { CollectionView } from './CollectionView';
import { PocaListScreen } from './PocaListScreen';
import { Dashboard } from './Dashboard';
import { Photobook } from './Photobook';
import { StatusSheet } from './StatusSheet';
import { FilterModal } from './FilterModal';

const VALID: TabId[] = ['collection', 'album', 'dash', 'book'];

export function MobileShell() {
  const loc = useLocation();
  const tab = loc.pathname.replace('/', '');
  const navigate = useNavigate();
  const selectedAlbumId = useStore((s) => s.selectedAlbumId);
  const photobook = useStore((s) => s.photobook);
  const statusSheetOpen = useStore((s) => s.statusSheet.open);
  const filterModalOpen = useStore((s) => s.filterModal.open);

  const active = (VALID.includes(tab as TabId) ? tab : 'album') as TabId;

  useEffect(() => {
    if (!selectedAlbumId && active !== 'collection') {
      navigate('/collection', { replace: true });
    }
  }, [selectedAlbumId, active, navigate]);

  if (!selectedAlbumId && active !== 'collection') return null;

  const isListTab = active === 'album' || active === 'collection';

  return (
    <PhoneFrame bg={isListTab ? '#ffffff' : '#f5f5f7'}>
      {active === 'collection' && <CollectionView />}
      {active === 'album' && <PocaListScreen />}
      {active === 'dash' && <Dashboard />}
      {active === 'book' && <Photobook />}
      <BottomTab active={active} bookCount={photobook.length} onChange={(id) => navigate(`/${id}`)} />
      {statusSheetOpen && <StatusSheet />}
      {filterModalOpen && <FilterModal />}
    </PhoneFrame>
  );
}
