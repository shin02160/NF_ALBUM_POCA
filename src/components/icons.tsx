// ── SVG 아이콘 (core.jsx 기준) ───────────────────────────────────────────
import { T } from '../theme/tokens';

interface IcoProps { c?: string; sz?: number }

export const Icon = {
  search: ({ c = T.tm }: IcoProps) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.2" stroke={c} strokeWidth="1.6" /><path d="M12 12L15.5 15.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  book: ({ c = T.tm, sz = 18 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 18 18" fill="none"><path d="M4 2h7l4 4v11H4V2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /><path d="M11 2v4h4" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 9h5M7 12h3.5" stroke={c} strokeWidth="1.3" strokeLinecap="round" /></svg>
  ),
  plus: ({ c = T.tm, sz = 13 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  close: ({ c = T.tm, sz = 9 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 9 9" fill="none"><path d="M1 1l7 7M8 1L1 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  back: ({ c = 'rgb(23,23,25)' }: IcoProps) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M14 4.5L8 11L14 17.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  chev: ({ c = T.tm, d = 'down' }: IcoProps & { d?: 'down' | 'right' }) => (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: d === 'right' ? 'rotate(-90deg)' : 'none' }}><path d="M1 1l4 4 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  list: ({ c = T.tm }: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 4h8M5.5 8h8M5.5 12h8" stroke={c} strokeWidth="1.5" strokeLinecap="round" /><circle cx="2.5" cy="4" r="1.2" fill={c} /><circle cx="2.5" cy="8" r="1.2" fill={c} /><circle cx="2.5" cy="12" r="1.2" fill={c} /></svg>
  ),
  grid: ({ c = T.tm }: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" /><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" /><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" /><rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4" /></svg>
  ),
  share: ({ c = 'rgb(23,23,25)' }: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.5v8" stroke={c} strokeWidth="1.5" strokeLinecap="round" /><path d="M5.5 5L8 2.5 10.5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 8.5v5h8v-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  drag: () => (
    <svg width="12" height="18" viewBox="0 0 12 18" fill="none">{[3, 9, 15].map((y) => [3, 9].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={T.b} />))}</svg>
  ),
  chart: ({ c = T.tm }: IcoProps) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 15V8M9 15V3M15 15v-5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  home: ({ c = T.tm }: IcoProps) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 8l6-5 6 5v7H3V8z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></svg>
  ),
  check: ({ c = '#fff', sz = 12 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.8 9.2L10 3.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  edit: ({ c = T.tm, sz = 16 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2L6 12l-2.5.5L4 10l7.5-7.5z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" /></svg>
  ),
  trash: ({ c = T.tm, sz = 16 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6 4.5V3h4v1.5M4.5 4.5l.5 8.5h6l.5-8.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  upload: ({ c = T.tm, sz = 18 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 18 18" fill="none"><path d="M9 12V3M6 6l3-3 3 3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.5 12v2.5h11V12" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  lock: ({ c = T.tm, sz = 18 }: IcoProps) => (
    <svg width={sz} height={sz} viewBox="0 0 18 18" fill="none"><rect x="3.5" y="8" width="11" height="7.5" rx="2" stroke={c} strokeWidth="1.5" /><path d="M6 8V5.5a3 3 0 0 1 6 0V8" stroke={c} strokeWidth="1.5" /></svg>
  ),
};
