import type { StatusKey } from './theme/tokens';

// PRD v0.9 카테고리 타입 (8종)
export type CategoryType = '앨범' | '콘서트' | '팬미팅' | '팬클럽' | '시즌그리팅' | '포토북' | '잡지' | 'MD' | '기타';
export const CATEGORY_TYPES: CategoryType[] = ['앨범', '콘서트', '팬미팅', '팬클럽', '시즌그리팅', '포토북', '잡지', 'MD', '기타'];

// PRD 3-2 album_meta + v0.9 카테고리 필드 추가
export interface Album {
  id: string;
  name: string;
  sub: string;
  year: string;
  categoryType: CategoryType;   // NEW v0.9
  versions: string[];
  sources: string[];
  count: number;
  thumbnailUrl?: string | null;   // NEW v0.9 (64×64 썸네일)
  headerImageUrl?: string | null; // NEW v0.9 (renamed from headerImage)
  bgImageUrl?: string | null;     // NEW v0.9 (renamed from bgImage)
  bannerImageUrl?: string | null; // NEW v0.9
  sortOrder: number;
  isVisible?: boolean;
}

// PRD 3-2 album_poca_cards
export interface PocaCard {
  id: string;
  albumId: string;
  name: string;
  member: string;
  version: string;
  source: string;
  imageUrl: string | null;
  sortOrder: number;
}

export type ViewMode = 'list' | 'grid';

// PRD 3-3 LocalStorage 사용자 상태
export type PocaStatusMap = Record<string, StatusKey | null>;

export interface Filters {
  version: string[];
  member: string[];
  source: string[];
}
