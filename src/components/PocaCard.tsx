// ── 포카 카드 (상태 테두리 색 포함) — core.jsx PocaCard ────────────────
import { T, STATUS, type StatusKey } from '../theme/tokens';
import { LOGO } from '../assets';

interface Props {
  member?: string;
  img?: string | null;
  status?: StatusKey | null;
  width?: number | string;
  radius?: number;
}

export function PocaCard({ member = '승협', img, status, width = '100%', radius = 8 }: Props) {
  const sc = status ? STATUS[status].c : null;
  const border = sc ? `2.5px solid ${sc}` : `1px solid ${T.b}`;
  const inner = img ? (
    <div style={{ width: '100%', height: '100%' }}>
      <img src={img} alt={member} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
    </div>
  ) : (
    <div style={{ width: '100%', height: '100%', background: '#dbeafe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 8 }}>
      <img src={LOGO} alt="" style={{ width: '64%', filter: 'invert(38%) sepia(93%) saturate(1900%) hue-rotate(205deg) brightness(95%)' }} />
      <p style={{ fontSize: 7.5, color: '#3b82f6', textAlign: 'center', fontWeight: 500, fontFamily: T.f, lineHeight: 1.45 }}>이미지<br />준비중입니다.</p>
    </div>
  );
  return (
    <div style={{ width, aspectRatio: '2/3', borderRadius: radius, overflow: 'hidden', position: 'relative', flexShrink: 0, border, boxShadow: sc ? `0 0 0 3px ${sc}1f, 0 2px 10px rgba(0,0,0,0.10)` : '0 1px 6px rgba(0,0,0,0.08)' }}>
      {inner}
    </div>
  );
}
