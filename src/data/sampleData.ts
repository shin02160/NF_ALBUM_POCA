// ── 샘플 데이터 (Supabase 미설정 시 사용) — core.jsx 기준 ──────────────
import type { Album, PocaCard } from '../types';
import { MEMBERS, DEFAULT_VERSIONS } from '../theme/tokens';
import { MEMBER_IMG } from '../assets';

const VERSIONS = DEFAULT_VERSIONS;
const SOURCES = ['FNC STORE', '애플뮤직', '기타'];

export const SAMPLE_ALBUMS: Album[] = [
  {
    id: 'everlasting', name: 'Everlasting', sub: '정규 2집', year: '2025',
    versions: VERSIONS, sources: ['FNC STORE', '애플뮤직'], count: 12,
    headerImage: null, bgImage: null, sortOrder: 1, isVisible: true,
  },
  {
    id: 'woosahap', name: '우사합', sub: '스페셜', year: '2026',
    versions: ['통합 ver.'], sources: ['FNC STORE'], count: 6,
    headerImage: null, bgImage: null, sortOrder: 2, isVisible: true,
  },
  {
    id: 'motm', name: 'Man on the Moon', sub: '미니 3집', year: '2021',
    versions: ['A ver.', 'B ver.'], sources: ['FNC STORE', '기타'], count: 9,
    headerImage: null, bgImage: null, sortOrder: 3, isVisible: true,
  },
];

// Everlasting 카드 생성 (멤버 × 버전)
function buildEverlasting(): PocaCard[] {
  const cards: PocaCard[] = [];
  VERSIONS.forEach((ver, vi) => {
    MEMBERS.forEach((m, mi) => {
      cards.push({
        id: `ev-${vi}-${mi}`,
        albumId: 'everlasting',
        version: ver,
        name: `${m} 포토카드`,
        member: m,
        source: SOURCES[(mi + vi) % 2],
        imageUrl: MEMBER_IMG[m] ?? null,
        sortOrder: vi * MEMBERS.length + mi,
      });
    });
  });
  return cards;
}

// 우사합 / motm 도 간단히 생성 → 앨범 전환 데모 가능
function buildSimple(albumId: string, versions: string[], sources: string[], n: number): PocaCard[] {
  const cards: PocaCard[] = [];
  let order = 0;
  for (let i = 0; i < n; i++) {
    const m = MEMBERS[i % MEMBERS.length];
    cards.push({
      id: `${albumId}-${i}`,
      albumId,
      version: versions[i % versions.length],
      name: `${m} 포토카드`,
      member: m,
      source: sources[i % sources.length],
      imageUrl: MEMBER_IMG[m] ?? null,
      sortOrder: order++,
    });
  }
  return cards;
}

export const SAMPLE_CARDS: PocaCard[] = [
  ...buildEverlasting(),
  ...buildSimple('woosahap', ['통합 ver.'], ['FNC STORE'], 6),
  ...buildSimple('motm', ['A ver.', 'B ver.'], ['FNC STORE', '기타'], 9),
];
