// ── 포카 카드 (상태 테두리 색 포함) — core.jsx PocaCard ────────────────
import { T, STATUS, type StatusKey } from '../theme/tokens';
import { LOGO } from '../assets';

interface Props {
  member?: string;
  img?: string | null;
  status?: StatusKey | null;
  width?: number | string;
  radius?: number;
  nameLabel?: string;
}

export function PocaCard({ member = '승협', img, status, width = '100%', radius = 8, nameLabel }: Props) {
  const sc = status ? STATUS[status].c : null;
  const border = sc ? `2.5px solid ${sc}` : `1px solid ${T.b}`;
  const inner = img ? (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <img src={img} alt={member} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 6px 6px', background: 'linear-gradient(transparent, rgba(0,0,0,0.46))' }}>
        <p style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: T.f, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{nameLabel || member}</p>
      </div>
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
      {status && (
        <div style={{ position: 'absolute', top: 5, left: 5, height: 17, padding: '0 6px', borderRadius: 100, background: sc!, display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff', fontFamily: T.f }}>{status}</span>
        </div>
      )}
    </div>
  );
}
