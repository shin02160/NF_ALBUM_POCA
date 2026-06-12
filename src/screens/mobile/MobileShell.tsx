// ── 모바일 셸: 탭 전환 + 오버레이 ────────────────────────────────────────
import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhoneFrame } from '../../components/PhoneFrame';
import { BottomTab, type TabId } from '../../components/BottomTab';
import { useStore } from '../../store/useStore';
import { CategoryHome } from './CategoryHome';
import { CollectionView } from './CollectionView';
import { PocaListScreen } from './PocaListScreen';
import { Dashboard } from './Dashboard';
import { Photobook } from './Photobook';
import { StatusSheet } from './StatusSheet';
import { FilterModal } from './FilterModal';

const VALID: TabId[] = ['collection', 'category', 'dash', 'book'];

export function MobileShell() {
  const loc = useLocation();
  const tab = loc.pathname.replace('/', '');
  const navigate = useNavigate();
  const photobook = useStore((s) => s.photobook);
  const cards = useStore((s) => s.cards);
  const statusSheetOpen = useStore((s) => s.statusSheet.open);
  const filterModalOpen = useStore((s) => s.filterModal.open);

  const bookCount = useMemo(() => {
    const ids = new Set(cards.map((c) => c.id));
    return photobook.filter((id) => ids.has(id)).length;
  }, [photobook, cards]);

  // album 경로 하위 호환
  const rawTab = tab === 'album' ? 'category' : tab;
  const active = (VALID.includes(rawTab as TabId) ? rawTab : 'category') as TabId;
  const [itemVisible, setItemVisible] = useState(false);

  const isListTab = active === 'category' || active === 'collection';

  return (
    <PhoneFrame bg={isListTab ? '#ffffff' : '#f5f5f7'}>
      {active === 'collection' && <CollectionView />}
      {active === 'category' && (
        itemVisible
          ? <PocaListScreen onBack={() => setItemVisible(false)} />
          : <CategoryHome onSelect={() => setItemVisible(true)} />
      )}
      {active === 'dash' && <Dashboard />}
      {active === 'book' && <Photobook />}
      <BottomTab active={active} bookCount={bookCount} onChange={(id) => { setItemVisible(false); navigate(`/${id}`); }} />
      {statusSheetOpen && <StatusSheet />}
      {filterModalOpen && <FilterModal />}
    </PhoneFrame>
  );
}
