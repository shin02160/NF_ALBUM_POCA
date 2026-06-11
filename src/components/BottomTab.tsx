// ── 하단 탭바: 모아보기 / 앨범별 / 대시보드 / 포토북 — PRD v0.8 ─────────
import { T } from '../theme/tokens';
import { Icon } from './icons';

export type TabId = 'collection' | 'album' | 'dash' | 'book';

const tabs: { id: TabId; label: string; Ico: (p: { c?: string; sz?: number }) => React.ReactElement }[] = [
  { id: 'album',      label: '앨범',     Ico: Icon.list },
  { id: 'collection', label: '모아보기', Ico: Icon.grid },
  { id: 'dash',       label: '대시보드', Ico: Icon.chart },
  { id: 'book',       label: '포토북',   Ico: Icon.book },
];

export function BottomTab({ active, bookCount = 0, onChange }: { active: TabId; bookCount?: number; onChange: (id: TabId) => void }) {
  return (
    <div style={{ height: 60, background: T.s, borderTop: `1px solid ${T.b}`, display: 'flex', alignItems: 'stretch', flexShrink: 0, paddingBottom: 4 }}>
      {tabs.map(({ id, label, Ico }) => {
        const on = id === active;
        return (
          <button key={id} onClick={() => onChange(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.f }}>
            <div style={{ position: 'relative' }}>
              <Ico c={on ? T.p : T.tl} />
              {id === 'book' && bookCount > 0 && (
                <div style={{ position: 'absolute', top: -5, right: -8, minWidth: 15, height: 15, borderRadius: 8, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                  <span style={{ color: '#fff', fontSize: 8.5, fontWeight: 700 }}>{bookCount}</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, color: on ? T.p : T.tl }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
