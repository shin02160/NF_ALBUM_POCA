// ── 데스크탑 모아보기 — 모바일 CollectionView 콘텐츠 재사용 ──────────────
// 헤더(로고)는 사이드바가 담당하므로 모바일 컴포넌트를 flex 컨테이너 안에 배치
import { CollectionView } from '../mobile/CollectionView';

export function DesktopCollectionView() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CollectionView />
    </div>
  );
}
