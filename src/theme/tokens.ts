// ── NF ALBUM POCA · 디자인 토큰 (design_handoff README + core.jsx 기준) ──

export const T = {
  bg: '#f5f5f7',
  s: '#ffffff',
  b: '#dbdcdf',
  bl: '#f4f4f5',
  t: 'rgb(23,23,25)',
  tm: 'rgb(112,115,124)',
  tl: 'rgb(152,155,162)',
  p: 'rgb(51,102,255)',
  pb: 'rgb(234,242,254)',
  f: `'Pretendard JP', -apple-system, BlinkMacSystemFont, sans-serif`,
} as const;

export type StatusKey = '소장' | '구해요' | '교환 가능';

// 상태 테두리/배지 색: 소장 파랑 / 구해요 빨강 / 교환가능 앰버
export const STATUS: Record<StatusKey, { c: string; bg: string }> = {
  소장: { c: 'rgb(51,102,255)', bg: 'rgb(234,242,254)' },
  구해요: { c: 'rgb(255,66,66)', bg: 'rgb(254,236,236)' },
  '교환 가능': { c: 'rgb(245,168,0)', bg: 'rgb(255,247,229)' },
};

export const STATUS_ORDER: StatusKey[] = ['소장', '구해요', '교환 가능'];

// 멤버 컬러 (뱃지/차트)
export const MC: Record<string, string> = {
  승협: '#3366FF',
  훈: '#00BF40',
  재현: '#F5C400',
  회승: '#FF9200',
  동성: '#F553DA',
  유닛: '#20B2AA',
  단체: '#8050DF',
};

export const MEMBERS = ['승협', '훈', '재현', '회승', '동성', '유닛', '단체'];
export const DEFAULT_VERSIONS = ['Ever ver.', 'Lasting ver.'];
export const DEFAULT_SOURCES = ['FNC STORE', '애플뮤직'];

export const ALBUM_BANNER_GRADIENT =
  'linear-gradient(120deg, #1a1a2e 0%, #2d2d52 50%, #3366FF 140%)';
