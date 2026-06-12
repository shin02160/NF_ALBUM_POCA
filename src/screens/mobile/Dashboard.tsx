// ── 대시보드 (PRD v0.9) ────────────────────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import type { PocaCard } from '../../types';
import { CATEGORY_TYPES } from '../../types';

const StatCard = ({ label, value, unit, accent, sub }: { label: string; value: number | string; unit?: string; accent?: string; sub?: string }) => (
  <div style={{ flex: '0 0 auto', minWidth: 100, background: T.s, borderRadius: 14, border: `1px solid ${T.b}`, padding: '12px 12px 13px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
    <p style={{ fontSize: 11, color: T.tm, fontWeight: 500, marginBottom: 5 }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: accent || T.t, letterSpacing: '-0.04em' }}>{value}</span>
      {unit && <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>{unit}</span>}
    </div>
    {sub && <p style={{ fontSize: 10, color: T.tl, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</p>}
  </div>
);

const Section = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
    <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{title}</span>
      {action}
    </div>
    {children}
  </div>
);

const GroupHeader = ({ label, sub, accent }: { label: string; sub: string; accent: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 4, marginBottom: -2 }}>
    <span style={{ width: 4, height: 16, borderRadius: 100, background: accent }} />
    <span style={{ fontSize: 16, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{label}</span>
    <span style={{ fontSize: 11, color: T.tm, fontWeight: 500 }}>{sub}</span>
  </div>
);

const BarRow = ({ label, n, max, color, secondary, secondaryMax }: { label: string; n: number; max: number; color: string; secondary?: number; secondaryMax?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 84, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
    <div style={{ flex: 1, height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden', position: 'relative' }}>
      {secondary != null && secondaryMax ? <div style={{ position: 'absolute', inset: 0, width: `${(secondary / secondaryMax) * 100}%`, borderRadius: 100, background: color + '26' }} /> : null}
      <div style={{ width: `${max ? (n / max) * 100 : 0}%`, height: '100%', borderRadius: 100, background: color, position: 'relative' }} />
    </div>
    <span style={{ width: 24, textAlign: 'right', fontSize: 12, fontWeight: 700, color: T.t, flexShrink: 0 }}>{n}</span>
  </div>
);

const CatDropdown = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    style={{ height: 28, padding: '0 8px', borderRadius: 8, border: `1px solid ${T.b}`, background: T.bl, fontSize: 12, color: T.tm, fontWeight: 600, cursor: 'pointer', fontFamily: T.f, outline: 'none' }}>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

function countMembers(items: PocaCard[]): Map<string, number> {
  const m = new Map<string, number>();
  items.forEach((c) => {
    const key = c.member.includes(',') ? '유닛' : c.member.trim();
    m.set(key, (m.get(key) ?? 0) + 1);
  });
  return m;
}

const ITEM_COLORS = [T.p, '#8050DF', '#00BF40', '#FF9200', '#20B2AA'];
const itemColor = (i: number) => ITEM_COLORS[i % ITEM_COLORS.length];

export function Dashboard() {
  const allCards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const allAlbums = useStore(useShallow((s) => s.albums));
  const ensureCards = useStore((s) => s.ensureCards);
  const albumIds = useStore(useShallow((s) => s.albums.map((a) => a.id)));

  useEffect(() => {
    albumIds.forEach((id) => ensureCards(id));
  }, [albumIds, ensureCards]);

  // 카테고리별 드롭다운 선택 상태
  const availableCats = useMemo(() => {
    const used = new Set(allAlbums.map((a) => a.categoryType));
    return CATEGORY_TYPES.filter((ct) => used.has(ct));
  }, [allAlbums]);

  const [totalCatFilter, setTotalCatFilter] = useState('');
  const [ownedCatFilter, setOwnedCatFilter] = useState('');

  // 초기값 세팅
  const defaultCat = availableCats[0] ?? '';
  const activeTotalCat = totalCatFilter || defaultCat;
  const activeOwnedCat = ownedCatFilter || defaultCat;

  // 앨범별 카드 맵
  const albumCardMap = useMemo(() => {
    const m = new Map<string, PocaCard[]>();
    allCards.forEach((c) => {
      const arr = m.get(c.albumId) ?? [];
      arr.push(c);
      m.set(c.albumId, arr);
    });
    return m;
  }, [allCards]);

  // 카테고리 타입별 총 카드 수
  const catTotals = useMemo(() => {
    const m = new Map<string, number>();
    allAlbums.forEach((al) => {
      const cnt = (albumCardMap.get(al.id) ?? []).length;
      m.set(al.categoryType, (m.get(al.categoryType) ?? 0) + cnt);
    });
    return m;
  }, [allAlbums, albumCardMap]);

  // 선택된 카테고리의 상위 5개 아이템 (전체 포카 수 기준)
  const totalTopItems = useMemo(() => {
    return allAlbums
      .filter((al) => al.categoryType === activeTotalCat)
      .map((al) => ({ name: al.name, n: (albumCardMap.get(al.id) ?? []).length }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 5);
  }, [allAlbums, albumCardMap, activeTotalCat]);

  const maxTotalItem = Math.max(1, ...totalTopItems.map((x) => x.n));

  // 선택된 카테고리의 상위 5개 아이템 (소장 기준)
  const ownedTopItems = useMemo(() => {
    return allAlbums
      .filter((al) => al.categoryType === activeOwnedCat)
      .map((al) => {
        const cards = albumCardMap.get(al.id) ?? [];
        const total = cards.length;
        const owned = cards.filter((c) => statusMap[c.id] === '소장').length;
        return { name: al.name, owned, total };
      })
      .sort((a, b) => b.owned - a.owned)
      .slice(0, 5);
  }, [allAlbums, albumCardMap, statusMap, activeOwnedCat]);

  // 전체 통계
  const stats = useMemo(() => {
    const total = allCards.length;
    const owned = allCards.filter((c) => statusMap[c.id] === '소장');
    const wanted = allCards.filter((c) => statusMap[c.id] === '구해요').length;
    const tradable = allCards.filter((c) => statusMap[c.id] === '교환 가능').length;
    const ownedByMember = countMembers(owned);
    const totalByMember = countMembers(allCards);
    const orderedMembers = MEMBERS.filter((m) => totalByMember.has(m));
    return { total, ownedTotal: owned.length, wanted, tradable, ownedByMember, totalByMember, members: orderedMembers };
  }, [allCards, statusMap]);

  const ownRate = stats.total ? Math.round((stats.ownedTotal / stats.total) * 100) : 0;
  const ownAngle = stats.total ? (stats.ownedTotal / stats.total) * 360 : 0;
  const ownDonut = `conic-gradient(${T.p} 0deg ${ownAngle}deg, ${T.bl} ${ownAngle}deg 360deg)`;
  const maxMember = Math.max(1, ...[...stats.totalByMember.values()]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>전체 현황</p>
      </div>

      {/* [일반] */}
      <GroupHeader label="일반" sub="발매된 전체 포카 기준" accent={T.p} />

      {/* 전체 포카 현황 — 가로 스크롤 카드 */}
      <Section title="전체 포카 현황">
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', margin: '0 -4px', padding: '0 4px' } as React.CSSProperties}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
            <StatCard label="총 포카" value={stats.total} unit="종" accent={T.p} />
            {availableCats.map((ct, i) => (
              <StatCard key={ct} label={ct} value={catTotals.get(ct) ?? 0} unit="종" accent={itemColor(i)} />
            ))}
          </div>
        </div>
      </Section>

      {/* 카테고리별 포카 현황 (드롭다운 + 상위 5개 아이템) */}
      <Section title="카테고리별 포카 현황" action={
        <CatDropdown value={activeTotalCat} onChange={setTotalCatFilter} options={availableCats} />
      }>
        {totalTopItems.length === 0 ? (
          <p style={{ fontSize: 13, color: T.tl, textAlign: 'center' }}>데이터 없음</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {totalTopItems.map((item, i) => (
              <BarRow key={item.name} label={item.name} n={item.n} max={maxTotalItem} color={itemColor(i)} />
            ))}
          </div>
        )}
      </Section>

      {/* [사용자 현황] */}
      <GroupHeader label="사용자 현황" sub="내 소장 기준" accent="#00BF40" />

      {/* 소장 현황 전체 */}
      <Section title="소장 현황 · 전체">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: ownDonut, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: T.p, letterSpacing: '-0.04em' }}>{ownRate}%</span>
              <span style={{ fontSize: 9, color: T.tm }}>소장률</span>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: T.t, letterSpacing: '-0.04em' }}>{stats.ownedTotal}</span>
              <span style={{ fontSize: 14, color: T.tm, fontWeight: 600 }}>/ {stats.total}종 소장</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Mini label="미보유" value={stats.total - stats.ownedTotal} color={T.t} subColor={T.tm} />
              <Mini label="구해요" value={stats.wanted} color="#FF4242" subColor="#FF4242" />
              <Mini label="교환가능" value={stats.tradable} color="#F5A800" subColor="#F5A800" />
            </div>
          </div>
        </div>
      </Section>

      {/* 소장 현황 · 카테고리별 (드롭다운 + 상위 5개 아이템) */}
      <Section title="소장 현황 · 카테고리별" action={
        <CatDropdown value={activeOwnedCat} onChange={setOwnedCatFilter} options={availableCats} />
      }>
        {ownedTopItems.length === 0 ? (
          <p style={{ fontSize: 13, color: T.tl, textAlign: 'center' }}>데이터 없음</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ownedTopItems.map((item, i) => {
              const pct = item.total ? Math.round((item.owned / item.total) * 100) : 0;
              return (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.t }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: T.tm }}>
                      <strong style={{ color: T.t, fontWeight: 700 }}>{item.owned}</strong> / {item.total}종 · {pct}%
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden' }}>
                    <div style={{ width: `${item.total ? (item.owned / item.total) * 100 : 0}%`, height: '100%', borderRadius: 100, background: itemColor(i) }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* 소장 현황 · 멤버별 */}
      <Section title="소장 현황 · 멤버별">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {stats.members.map((m) => {
            const own = stats.ownedByMember.get(m) ?? 0;
            const total = stats.totalByMember.get(m) ?? 0;
            return (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: MC[m] }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.t }}>{m}</span>
                </div>
                <div style={{ flex: 1, height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${(total / maxMember) * 100}%`, borderRadius: 100, background: (MC[m] || T.p) + '22' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(own / maxMember) * 100}%`, borderRadius: 100, background: MC[m] || T.p }} />
                </div>
                <span style={{ width: 48, textAlign: 'right', fontSize: 11, color: T.tm, flexShrink: 0 }}>
                  <strong style={{ color: T.t, fontWeight: 700, fontSize: 12 }}>{own}</strong>/{total}종
                </span>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

const Mini = ({ label, value, color, subColor }: { label: string; value: number; color: string; subColor: string }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <span style={{ fontSize: 11, color: subColor }}>{label}</span>
    <span style={{ fontSize: 16, fontWeight: 700, color }}>{value}<span style={{ fontSize: 11, color: T.tm, fontWeight: 600 }}>종</span></span>
  </div>
);
