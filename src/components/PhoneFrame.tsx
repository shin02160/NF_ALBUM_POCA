// ── 모바일 프레임 (375×812 중앙 정렬, 데스크탑에서도 폰 형태로 표시) ───
import { T } from '../theme/tokens';

export function PhoneFrame({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, padding: '0' }}>
      <div
        className="phone-frame"
        style={{ width: 375, height: 812, maxHeight: '100vh', fontFamily: T.f, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: bg || T.bg, position: 'relative', boxShadow: '0 12px 48px rgba(0,0,0,0.12)' }}
      >
        {children}
      </div>
    </div>
  );
}
