// ── 데스크탑 대시보드 — 2열 통계 그리드 ──────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import type { PocaCard } from '../../types';
import { CATEGORY_TYPES } from '../../types';

const ITEM_COLORS = [T.p, '#8050DF', '#00BF40', '#FF9200', '#20B2AA'];
const itemColor = (i: number) => ITEM_COLORS[i % ITEM_COLORS.length];

function countMembers(items: PocaCard[]): Map<string, number> {
  const m = new Map<string, number>();
  items.forEach((c) => {
    const key = c.member.includes(',') ? '유닛' : c.member.trim();
    m.set(key, (m.get(key) ?? 0) + 1);
  });
  return m;
}

const ChartCard = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{title}</p>
      {action}
    </div>
    {children}
  </div>
);

const BarRow = ({ label, n, max, color, secondary, secondaryMax }: {
  label: string; n: number; max: number; color: string; secondary?: number; secondaryMax?: number;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
    <div style={{ width: 72, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span title={label} style={{ fontSize: 12, fontWeight: 600, color: T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
    <div style={{ flex: 1, height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden', position: 'relative' }}>
      {secondary != null && secondaryMax ? <div style={{ position: 'absolute', inset: 0, width: `${(secondary / secondaryMax) * 100}%`, borderRadius: 100, background: color + '26' }} /> : null}
      <div style={{ width: `${max ? (n / max) * 100 : 0}%`, height: '100%', borderRadius: 100, background: color }} />
    </div>
    <span style={{ width: 28, textAlign: 'right', fontSize: 12, fontWeight: 700, color: T.t, flexShrink: 0 }}>{n}</span>
  </div>
);

const CatDropdown = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    style={{ height: 28, padding: '0 8px', borderRadius: 8, border: `1px solid ${T.b}`, background: T.bl, fontSize: 12, color: T.tm, fontWeight: 600, cursor: 'pointer', fontFamily: T.f, outline: 'none' }}>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

export function DesktopDashboard() {
  const allCards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const allAlbums = useStore(useShallow((s) => s.albums));
  const ensureCards = useStore((s) => s.ensureCards);
  const albumIds = useStore(useShallow((s) => s.albums.map((a) => a.id)));

  useEffect(() => { albumIds.forEach((id) => ensureCards(id)); }, [albumIds, ensureCards]);

  const availableCats = useMemo(() => {
    const used = new Set(allAlbums.map((a) => a.categoryType));
    return CATEGORY_TYPES.filter((ct) => used.has(ct));
  }, [allAlbums]);

  const [totalCatFilter, setTotalCatFilter] = useState('');
  const [ownedCatFilter, setOwnedCatFilter] = useState('');
  const defaultCat = availableCats[0] ?? '';
  const activeTotalCat = totalCatFilter || defaultCat;
  const activeOwnedCat = ownedCatFilter || defaultCat;

  const albumCardMap = useMemo(() => {
    const m = new Map<string, PocaCard[]>();
    allCards.forEach((c) => {
      const arr = m.get(c.albumId) ?? [];
      arr.push(c);
      m.set(c.albumId, arr);
    });
    return m;
  }, [allCards]);

  const catTotals = useMemo(() => {
    const m = new Map<string, number>();
    allAlbums.forEach((al) => {
      const cnt = (albumCardMap.get(al.id) ?? []).length;
      m.set(al.categoryType, (m.get(al.categoryType) ?? 0) + cnt);
    });
    return m;
  }, [allAlbums, albumCardMap]);

  const totalTopItems = useMemo(() => {
    return allAlbums
      .filter((al) => al.categoryType === activeTotalCat)
      .map((al) => ({ name: al.name, n: (albumCardMap.get(al.id) ?? []).length }))
      .sort((a, b) => b.n - a.n).slice(0, 5);
  }, [allAlbums, albumCardMap, activeTotalCat]);

  const ownedTopItems = useMemo(() => {
    return allAlbums
      .filter((al) => al.categoryType === activeOwnedCat)
      .map((al) => {
        const cards = albumCardMap.get(al.id) ?? [];
        return { name: al.name, owned: cards.filter((c) => statusMap[c.id] === '소장').length, total: cards.length };
      })
      .sort((a, b) => b.owned - a.owned).slice(0, 5);
  }, [allAlbums, albumCardMap, statusMap, activeOwnedCat]);

  const stats = useMemo(() => {
    const total = allCards.length;
    const owned = allCards.filter((c) => statusMap[c.id] === '소장');
    const wanted = allCards.filter((c) => statusMap[c.id] === '구해요').length;
    const tradable = allCards.filter((c) => statusMap[c.id] === '교환 가능').length;
    const ownedByMember = countMembers(owned);
    const totalByMember = countMembers(allCards);
    return { total, ownedTotal: owned.length, wanted, tradable, ownedByMember, totalByMember };
  }, [allCards, statusMap]);

  const ownRate = stats.total ? Math.round((stats.ownedTotal / stats.total) * 100) : 0;
  const ownAngle = stats.total ? (stats.ownedTotal / stats.total) * 360 : 0;
  const ownDonut = `conic-gradient(${T.p} 0deg ${ownAngle}deg, ${T.bl} ${ownAngle}deg 360deg)`;
  const maxMember = Math.max(1, ...[...stats.totalByMember.values()]);
  const maxTotalItem = Math.max(1, ...totalTopItems.map((x) => x.n));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 헤더 바 */}
      <div style={{ height: 56, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 28px', flexShrink: 0 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>컬렉션 대시보드</p>
        <span style={{ fontSize: 13, color: T.tm, marginLeft: 10 }}>소장 현황 + 발매 통계</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* 상단 스탯 카드 행 */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: '총 포카', value: stats.total, unit: '종', accent: T.p },
            { label: '소장', value: stats.ownedTotal, unit: '종', accent: T.p },
            { label: '소장률', value: `${ownRate}%`, accent: T.p },
            { label: '구해요', value: stats.wanted, unit: '종', accent: 'rgb(255,66,66)' },
            { label: '교환 가능', value: stats.tradable, unit: '종', accent: 'rgb(245,168,0)' },
          ].map(({ label, value, unit, accent }) => (
            <div key={label} style={{ flex: 1, background: T.s, borderRadius: 14, border: `1px solid ${T.b}`, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <p style={{ fontSize: 11, color: T.tm, fontWeight: 500, marginBottom: 6 }}>{label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: accent, letterSpacing: '-0.04em' }}>{value}</span>
                {unit && <span style={{ fontSize: 11, color: T.tm, fontWeight: 600 }}>{unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* 2열 차트 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* 소장 현황 전체 */}
          <ChartCard title="소장 현황 · 전체">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 108, height: 108, borderRadius: '50%', background: ownDonut, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: T.s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: T.p, letterSpacing: '-0.04em' }}>{ownRate}%</span>
                  <span style={{ fontSize: 9, color: T.tm }}>소장률</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: T.t, letterSpacing: '-0.04em' }}>{stats.ownedTotal}</span>
                  <span style={{ fontSize: 14, color: T.tm }}>/ {stats.total}종</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[['미보유', stats.total - stats.ownedTotal, T.t], ['구해요', stats.wanted, 'rgb(255,66,66)'], ['교환가능', stats.tradable, 'rgb(245,168,0)']].map(([label, val, c]) => (
                    <div key={String(label)}>
                      <p style={{ fontSize: 11, color: T.tm, marginBottom: 2 }}>{label}</p>
                      <span style={{ fontSize: 18, fontWeight: 700, color: String(c) }}>{val}<span style={{ fontSize: 10, color: T.tm, fontWeight: 600 }}>종</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ChartCard>

          {/* 멤버별 소장 현황 */}
          <ChartCard title="소장 현황 · 멤버별">
            {MEMBERS.map((m) => {
              const own = stats.ownedByMember.get(m) ?? 0;
              const total = stats.totalByMember.get(m) ?? 0;
              return <BarRow key={m} label={m} n={own} max={maxMember} color={MC[m] || T.p} secondary={total} secondaryMax={maxMember} />;
            })}
          </ChartCard>

          {/* 카테고리별 전체 포카 */}
          <ChartCard title="카테고리별 포카 현황" action={
            <CatDropdown value={activeTotalCat} onChange={setTotalCatFilter} options={availableCats} />
          }>
            {totalTopItems.length === 0
              ? <p style={{ fontSize: 13, color: T.tl, textAlign: 'center' }}>데이터 없음</p>
              : totalTopItems.map((item, i) => <BarRow key={item.name} label={item.name} n={item.n} max={maxTotalItem} color={itemColor(i)} />)
            }
          </ChartCard>

          {/* 카테고리별 소장 현황 */}
          <ChartCard title="소장 현황 · 카테고리별" action={
            <CatDropdown value={activeOwnedCat} onChange={setOwnedCatFilter} options={availableCats} />
          }>
            {ownedTopItems.length === 0
              ? <p style={{ fontSize: 13, color: T.tl, textAlign: 'center' }}>데이터 없음</p>
              : ownedTopItems.map((item, i) => (
                <div key={item.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span title={item.name} style={{ fontSize: 13, fontWeight: 600, color: T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>{item.name}</span>
                    <span style={{ fontSize: 12, color: T.tm }}>
                      <strong style={{ color: T.t }}>{item.owned}</strong> / {item.total}종 · {item.total ? Math.round(item.owned / item.total * 100) : 0}%
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden' }}>
                    <div style={{ width: `${item.total ? (item.owned / item.total) * 100 : 0}%`, height: '100%', borderRadius: 100, background: itemColor(i) }} />
                  </div>
                </div>
              ))
            }
          </ChartCard>
        </div>

        {/* 카테고리별 포카 요약 */}
        {availableCats.length > 0 && (
          <div style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.t, letterSpacing: '-0.02em', marginBottom: 14 }}>카테고리별 포카 수</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto', minWidth: 100, background: T.bg, borderRadius: 12, border: `1px solid ${T.b}`, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: T.tm, fontWeight: 500, marginBottom: 4 }}>총 포카</p>
                <span style={{ fontSize: 24, fontWeight: 700, color: T.p }}>{stats.total}<span style={{ fontSize: 11, color: T.tm, fontWeight: 600 }}>종</span></span>
              </div>
              {availableCats.map((ct, i) => (
                <div key={ct} style={{ flex: '0 0 auto', minWidth: 100, background: T.bg, borderRadius: 12, border: `1px solid ${T.b}`, padding: '12px 14px' }}>
                  <p style={{ fontSize: 11, color: T.tm, fontWeight: 500, marginBottom: 4 }}>{ct}</p>
                  <span style={{ fontSize: 24, fontWeight: 700, color: itemColor(i) }}>{catTotals.get(ct) ?? 0}<span style={{ fontSize: 11, color: T.tm, fontWeight: 600 }}>종</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
