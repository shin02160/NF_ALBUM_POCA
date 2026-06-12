// ── 대시보드 (PRD 4-4, handoff 1-8) ─────────────────────────────────────
import { useEffect, useMemo } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import type { PocaCard } from '../../types';

const StatCard = ({ label, value, unit, accent, sub }: { label: string; value: number | string; unit?: string; accent?: string; sub?: string }) => (
  <div style={{ flex: 1, background: T.s, borderRadius: 14, border: `1px solid ${T.b}`, padding: '12px 12px 13px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
    <p style={{ fontSize: 11, color: T.tm, fontWeight: 500, marginBottom: 5 }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: accent || T.t, letterSpacing: '-0.04em' }}>{value}</span>
      {unit && <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>{unit}</span>}
    </div>
    {sub && <p style={{ fontSize: 10, color: T.tl, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</p>}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
    <div style={{ marginBottom: 14 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{title}</span>
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
    <div style={{ width: 78, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
    <div style={{ flex: 1, height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden', position: 'relative' }}>
      {secondary != null && secondaryMax ? <div style={{ position: 'absolute', inset: 0, width: `${(secondary / secondaryMax) * 100}%`, borderRadius: 100, background: color + '26' }} /> : null}
      <div style={{ width: `${max ? (n / max) * 100 : 0}%`, height: '100%', borderRadius: 100, background: color, position: 'relative' }} />
    </div>
    <span style={{ width: 24, textAlign: 'right', fontSize: 12, fontWeight: 700, color: T.t, flexShrink: 0 }}>{n}</span>
  </div>
);

function countBy<T extends string>(items: PocaCard[], key: (c: PocaCard) => T): Map<T, number> {
  const m = new Map<T, number>();
  items.forEach((c) => { const k = key(c); m.set(k, (m.get(k) ?? 0) + 1); });
  return m;
}

function countMembers(items: PocaCard[]): Map<string, number> {
  const m = new Map<string, number>();
  items.forEach((c) => {
    c.member.split(',').map((s) => s.trim()).filter(Boolean).forEach((mbr) => {
      m.set(mbr, (m.get(mbr) ?? 0) + 1);
    });
  });
  return m;
}

export function Dashboard() {
  const albumId = useStore((s) => s.selectedAlbumId);
  const allCards = useStore((s) => s.cards);
  const statusMap = useStore((s) => s.statusMap);
  const ensureCards = useStore((s) => s.ensureCards);
  const albumIds = useStore(useShallow((s) => s.albums.map((a) => a.id)));

  useEffect(() => {
    albumIds.forEach((id) => ensureCards(id));
  }, [albumIds, ensureCards]);

  const cards = useMemo(
    () => albumId ? allCards.filter((c) => c.albumId === albumId) : allCards,
    [allCards, albumId],
  );

  const stats = useMemo(() => {
    const total = cards.length;
    const owned = cards.filter((c) => statusMap[c.id] === '소장');
    const wanted = cards.filter((c) => statusMap[c.id] === '구해요').length;
    const tradable = cards.filter((c) => statusMap[c.id] === '교환 가능').length;

    const versionsAll = [...countBy(cards, (c) => c.version)].map(([name, n]) => ({ name, n }));
    const sourcesAll = [...countBy(cards, (c) => c.source)].map(([name, n]) => ({ name, n }));
    const versionsOwned = countBy(owned, (c) => c.version);
    const sourcesOwned = countBy(owned, (c) => c.source);
    const ownedByMember = countMembers(owned);
    const totalByMember = countMembers(cards);

    const orderedMembers = MEMBERS.filter((m) => totalByMember.has(m))
      .concat([...totalByMember.keys()].filter((m) => !MEMBERS.includes(m)));
    return {
      total, ownedTotal: owned.length, wanted, tradable,
      versionsAll, sourcesAll, versionsOwned, sourcesOwned,
      ownedByMember, totalByMember,
      members: orderedMembers,
    };
  }, [cards, statusMap]);

  const ownRate = stats.total ? Math.round((stats.ownedTotal / stats.total) * 100) : 0;
  const ownAngle = stats.total ? (stats.ownedTotal / stats.total) * 360 : 0;
  const ownDonut = `conic-gradient(${T.p} 0deg ${ownAngle}deg, ${T.bl} ${ownAngle}deg 360deg)`;
  const maxVersionAll = Math.max(1, ...stats.versionsAll.map((x) => x.n));
  const maxSellerAll = Math.max(1, ...stats.sourcesAll.map((x) => x.n));
  const maxMember = Math.max(1, ...[...stats.totalByMember.values()]);

  const versionColor = (i: number) => (i === 0 ? T.p : '#8050DF');
  const SOURCE_COLORS = [T.p, '#8050DF', '#00BF40', '#FF9200', '#20B2AA'];
  const sourceColor = (i: number) => SOURCE_COLORS[i % SOURCE_COLORS.length];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>{albumId ? '컬렉션 대시보드' : '전체 현황'}</p>
      </div>

      {/* [일반] */}
      <GroupHeader label="일반" sub="발매된 전체 포카 기준" accent={T.p} />
      <Section title="전체 포카 현황">
        <div style={{ display: 'flex', gap: 8 }}>
          <StatCard label="총 포카" value={stats.total} unit="종" accent={T.p} />
          <StatCard label="버전" value={stats.versionsAll.length} sub={stats.versionsAll.map((v) => v.name).join(' / ')} />
          <StatCard label="판매처" value={stats.sourcesAll.length} sub={stats.sourcesAll.map((s) => s.name).join(' / ')} />
        </div>
      </Section>
      <Section title="버전별 포카 현황">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.versionsAll.map((v, i) => <BarRow key={v.name} label={v.name} n={v.n} max={maxVersionAll} color={versionColor(i)} />)}
        </div>
      </Section>
      <Section title="판매처별 포카 현황">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {stats.sourcesAll.map((s, i) => <BarRow key={s.name} label={s.name} n={s.n} max={maxSellerAll} color={sourceColor(i)} />)}
        </div>
      </Section>

      {/* [사용자 현황] */}
      <GroupHeader label="사용자 현황" sub="내 소장 기준" accent="#00BF40" />
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
      <Section title="소장 현황 · 버전별">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stats.versionsAll.map((v, i) => {
            const own = stats.versionsOwned.get(v.name) ?? 0;
            return (
              <div key={v.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.t }}>{v.name}</span>
                  <span style={{ fontSize: 11, color: T.tm }}><strong style={{ color: T.t, fontWeight: 700 }}>{own}</strong> / {v.n}종 · {v.n ? Math.round((own / v.n) * 100) : 0}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden' }}>
                  <div style={{ width: `${v.n ? (own / v.n) * 100 : 0}%`, height: '100%', borderRadius: 100, background: versionColor(i) }} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <Section title="소장 현황 · 판매처별">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.sourcesAll.map((s, i) => {
            const own = stats.sourcesOwned.get(s.name) ?? 0;
            return <BarRow key={s.name} label={s.name} n={own} max={maxSellerAll} color={sourceColor(i)} secondary={s.n} secondaryMax={maxSellerAll} />;
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12, paddingTop: 11, borderTop: `1px solid ${T.b}` }}>
          {stats.sourcesAll.map((s, i) => <Legend key={s.name} color={sourceColor(i)} label={s.name} />)}
          <div style={{ width: '100%', display: 'flex', gap: 12 }}>
            <Legend color={T.tm} label="진한 색: 소장" />
            <Legend color={T.bl} label="연한 색: 전체 발매" />
          </div>
        </div>
      </Section>
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
                <span style={{ width: 48, textAlign: 'right', fontSize: 11, color: T.tm, flexShrink: 0 }}><strong style={{ color: T.t, fontWeight: 700, fontSize: 12 }}>{own}</strong>/{total}종</span>
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

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
    <span style={{ fontSize: 11, color: T.tm }}>{label}</span>
  </div>
);
