// ── 공유 atom 컴포넌트 (core.jsx 기준) ──────────────────────────────────
import { T, MC } from '../theme/tokens';
import { Icon } from './icons';

export const SBar = () => (
  <div style={{ height: 44, padding: '0 22px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 9, background: T.s, flexShrink: 0 }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: T.t, fontFamily: T.f }}>{nowTime()}</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><rect x="0" y="4" width="3" height="7" rx="0.8" fill={T.t} /><rect x="4.5" y="2.5" width="3" height="8.5" rx="0.8" fill={T.t} /><rect x="9" y="0.5" width="3" height="10.5" rx="0.8" fill={T.t} /><rect x="13.5" y="0" width="2.5" height="11" rx="0.8" fill={T.t} opacity="0.35" /></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill={T.t} /><path d="M3.5 6.5C5 4.8 6.4 4 8 4s3 .8 4.5 2.5" stroke={T.t} strokeWidth="1.4" strokeLinecap="round" opacity="0.85" /><path d="M1 3.5C3.2 1.3 5.4 0 8 0s4.8 1.3 7 3.5" stroke={T.t} strokeWidth="1.4" strokeLinecap="round" opacity="0.4" /></svg>
      <div style={{ width: 22, height: 11, borderRadius: 3, border: `1.2px solid ${T.t}`, padding: '1.5px 2px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{ height: '100%', width: '78%', borderRadius: 1.5, background: T.t }} />
        <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 2.5, height: 6, background: T.t, borderRadius: '0 1px 1px 0', opacity: 0.5 }} />
      </div>
    </div>
  </div>
);

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const Pill = ({ label, tone = 'gray' }: { label: string; tone?: 'gray' | 'blue' }) => {
  const map: Record<string, [string, string]> = { gray: [T.bl, T.tm], blue: [T.pb, T.p] };
  const [bg, c] = map[tone] || map.gray;
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 5, background: bg, color: c, fontSize: 11, fontWeight: 600, fontFamily: T.f, whiteSpace: 'nowrap' }}>{label}</span>;
};

export const MemberDot = ({ member, size = 8 }: { member: string; size?: number }) => (
  <span style={{ width: size, height: size, borderRadius: '50%', background: MC[member] || T.tm, display: 'inline-block', flexShrink: 0 }} />
);

export const MemberBadge = ({ member }: { member: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, padding: '0 8px 0 7px', borderRadius: 100, background: (MC[member] || T.tm) + '1c', fontFamily: T.f }}>
    <MemberDot member={member} size={7} />
    <span style={{ fontSize: 11, fontWeight: 600, color: MC[member] || T.tm }}>{member}</span>
  </span>
);

export const FilterBtn = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} style={{ flex: 1, height: 38, borderRadius: 9, border: `${active ? 1.5 : 1}px solid ${active ? T.p : T.b}`, background: active ? T.pb : T.s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', gap: 4, cursor: 'pointer', fontFamily: T.f }}>
    <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? T.p : T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{label}</span>
    <Icon.chev c={active ? T.p : T.tm} />
  </button>
);
