import type { PocaCard, Filters } from '../types';

// 필터 + 검색 적용 (클라이언트 처리 — PRD 3-4)
export function filterCards(cards: PocaCard[], filters: Filters, search: string): PocaCard[] {
  const q = search.trim().toLowerCase();
  return cards.filter((c) => {
    if (filters.version.length && !filters.version.includes(c.version)) return false;
    if (filters.member.length && !filters.member.includes(c.member)) return false;
    if (filters.source.length && !filters.source.includes(c.source)) return false;
    if (q && !c.name.toLowerCase().includes(q) && !c.member.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function filterLabel(prefix: string, selected: string[]): string {
  if (selected.length === 0) return `${prefix}: 전체`;
  if (selected.length === 1) return `${prefix}: ${selected[0]}`;
  return `${prefix}: ${selected.length}개`;
}
