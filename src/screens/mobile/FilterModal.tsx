// ── 필터 모달 (PRD 4-2, handoff 1-5) — 버전/멤버/구매처 복수 선택 ───────
import { useMemo, useState } from 'react';
import { T, MC } from '../../theme/tokens';
import { BottomSheet } from '../../components/BottomSheet';
import { useStore } from '../../store/useStore';
import type { Filters } from '../../types';

export function FilterModal() {
  const close = useStore((s) => s.closeFilterModal);
  const initialTab = useStore((s) => s.filterModal.tab);
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const album = useStore((s) => s.albums.find((a) => a.id === s.selectedAlbumId));
  const albumId = useStore((s) => s.selectedAlbumId);
  const allCards = useStore((s) => s.cards);
  const members = useMemo(
    () => [...new Set(allCards.filter((c) => c.albumId === albumId).map((c) => c.member))],
    [allCards, albumId],
  );

  const [tab, setTab] = useState<0 | 1 | 2>(initialTab);
  const [draft, setDraft] = useState<Filters>({ ...filters });

  const TABS = ['버전', '멤버', '구매처'] as const;
  const keys = ['version', 'member', 'source'] as const;
  const data: string[][] = [album?.versions ?? [], members, album?.sources ?? []];
  const isMember = tab === 1;
  const key = keys[tab];
  const sel = draft[key];

  const toggle = (item: string) => {
    setDraft((d) => {
      const arr = d[key];
      const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      return { ...d, [key]: next };
    });
  };

  return (
    <BottomSheet onClose={close} dim={0.48}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px 4px' }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: T.t }}>필터</span>
        <button onClick={() => setDraft({ version: [], member: [], source: [] })} style={{ fontSize: 13, color: T.p, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>초기화</button>
      </div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.b}`, marginTop: 4 }}>
        {TABS.map((name, i) => {
          const count = draft[keys[i]].length;
          return (
            <button key={name} onClick={() => setTab(i as 0 | 1 | 2)} style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, borderBottom: i === tab ? `2.5px solid ${T.p}` : '2.5px solid transparent', marginBottom: -1, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.f }}>
              <span style={{ fontSize: 13, fontWeight: i === tab ? 700 : 400, color: i === tab ? T.p : T.tm }}>{name}</span>
              {count > 0 && <span style={{ minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: T.p, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '16px 22px', minHeight: 120, alignContent: 'flex-start' }}>
        {data[tab].map((item) => {
          const on = sel.includes(item);
          return (
            <button key={item} onClick={() => toggle(item)} style={{ height: 38, padding: '0 14px', borderRadius: 100, background: on ? T.p : T.bl, border: `1.5px solid ${on ? T.p : T.b}`, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: T.f }}>
              {isMember && <span style={{ width: 8, height: 8, borderRadius: '50%', background: on ? '#fff' : MC[item] }} />}
              <span style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: on ? '#fff' : T.t }}>{item}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '8px 22px 28px' }}>
        <button onClick={() => { setFilters(draft); close(); }} style={{ width: '100%', height: 54, borderRadius: 14, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(51,102,255,0.28)', border: 'none', cursor: 'pointer', fontFamily: T.f }}>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>적용하기</span>
        </button>
      </div>
    </BottomSheet>
  );
}
