import React from 'react';
import { T } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { useNavigate } from 'react-router-dom';

export type DesktopTabId = 'category' | 'collection' | 'dash' | 'book';

const NAV_ITEMS: { id: DesktopTabId; label: string; Ico: (p: { c: string }) => React.ReactElement }[] = [
  { id: 'category',   label: '카테고리', Ico: Icon.home  },
  { id: 'collection', label: '모아보기', Ico: Icon.grid  },
  { id: 'dash',       label: '대시보드', Ico: Icon.chart },
  { id: 'book',       label: '포토북',   Ico: Icon.book  },
];

interface Props {
  active: DesktopTabId;
  bookCount?: number;
  onChange: (id: DesktopTabId) => void;
}

export function DesktopSidebar({ active, bookCount = 0, onChange }: Props) {
  const navigate = useNavigate();
  return (
    <div style={{
      width: 220, background: T.s, borderRight: `1px solid ${T.b}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%',
    }}>
      {/* 로고 */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${T.b}`, flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" style={{ height: 38 }} />
      </div>

      {/* 네비게이션 */}
      <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ id, label, Ico }) => {
          const on = id === active;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                height: 42, borderRadius: 10, background: on ? T.pb : 'transparent',
                display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
                cursor: 'pointer', border: 'none', fontFamily: T.f, position: 'relative', width: '100%',
              }}
            >
              <Ico c={on ? T.p : T.tm} />
              <span style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? T.p : T.t }}>{label}</span>
              {id === 'book' && bookCount > 0 && (
                <span style={{
                  position: 'absolute', right: 12,
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: T.p, color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>{bookCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 관리자 버튼 */}
      <div style={{ padding: '10px 10px 22px', flexShrink: 0 }}>
        <button
          onClick={() => navigate('/admin')}
          style={{
            width: '100%', height: 38, borderRadius: 10, border: `1px solid ${T.b}`,
            background: T.bg, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
            cursor: 'pointer', fontFamily: T.f,
          }}
        >
          <Icon.lock c={T.tm} sz={14} />
          <span style={{ fontSize: 13, color: T.tm, fontWeight: 500 }}>관리자</span>
        </button>
      </div>
    </div>
  );
}
