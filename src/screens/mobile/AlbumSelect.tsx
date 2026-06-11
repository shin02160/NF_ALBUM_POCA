// ── 앨범 선택 화면 (PRD 4-1) ────────────────────────────────────────────
import { useNavigate } from 'react-router-dom';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Pill } from '../../components/atoms';
import { Icon } from '../../components/icons';
import { BottomTab } from '../../components/BottomTab';
import { useStore } from '../../store/useStore';

export function AlbumSelect() {
  const albums = useStore((s) => s.albums);
  const selectAlbum = useStore((s) => s.selectAlbum);
  const photobook = useStore((s) => s.photobook);
  const navigate = useNavigate();

  return (
    <>
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" style={{ height: 50, width: 'auto' }} />
        <button onClick={() => navigate('/admin')} style={{ height: 32, padding: '0 12px', borderRadius: 100, background: T.bl, display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer' }}>
          <Icon.lock c={T.tm} sz={13} />
          <span style={{ fontSize: 12, color: T.tm, fontWeight: 500 }}>관리자</span>
        </button>
      </div>
      <div style={{ padding: '20px 16px 8px', flexShrink: 0 }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 3 }}>앨범 선택</p>
        <p style={{ fontSize: 13, color: T.tm }}>소장 중인 포카를 앨범별로 기록해보세요</p>
      </div>
      <div style={{ flex: 1, padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        {albums.map((al, i) => (
          <button
            key={al.id}
            onClick={async () => { await selectAlbum(al.id); navigate('/album'); }}
            style={{ background: T.s, borderRadius: 16, border: `1px solid ${i === 0 ? 'rgba(51,102,255,0.35)' : T.b}`, padding: 14, display: 'flex', gap: 14, alignItems: 'center', boxShadow: i === 0 ? '0 4px 20px rgba(51,102,255,0.10)' : '0 2px 10px rgba(0,0,0,0.04)', cursor: 'pointer', textAlign: 'left', fontFamily: T.f }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${MC[MEMBERS[i % MEMBERS.length]]}22, ${MC[MEMBERS[(i + 1) % MEMBERS.length]] || T.p}28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${T.b}` }}>
              <img src={LOGO} alt="" style={{ width: '62%', opacity: 0.55 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.t }}>{al.name}</span>
                {al.sub && <Pill label={al.sub} />}
              </div>
              <p style={{ fontSize: 12, color: T.tm, marginBottom: 7 }}>{al.year} · 포카 {al.count}종 · {al.versions.length}버전</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {al.versions.map((v) => <Pill key={v} label={v} tone={i === 0 ? 'blue' : 'gray'} />)}
              </div>
            </div>
            <Icon.chev c={T.tl} d="right" />
          </button>
        ))}
      </div>
      <BottomTab active="album" bookCount={photobook.length} onChange={(id) => navigate(`/${id}`)} />
    </>
  );
}
