import type { StatusKey } from './theme/tokens';

// PRD 3-2 album_meta + handoff Album 모델
export interface Album {
  id: string;
  name: string;
  sub: string; // 예: "정규 2집"
  year: string;
  versions: string[];
  sources: string[];
  count: number; // 총 포카 종수 (파생값)
  headerImage?: string | null;
  bgImage?: string | null;
  sortOrder: number;
}

// PRD 3-2 album_poca_cards + handoff PocaCard 모델
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
