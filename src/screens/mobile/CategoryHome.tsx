// ── 카테고리 홈 (PRD v0.9 4-1) — 카테고리 타입별 그룹 ─────────────────
import { useNavigate } from 'react-router-dom';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import type { CategoryType } from '../../types';
import { CATEGORY_TYPES } from '../../types';

const CAT_COLOR: Record<CategoryType, string> = {
  앨범: T.p,
  콘서트: '#FF6B35',
  팬미팅: '#F553DA',
  팬클럽: '#20B2AA',
  시즌그리팅: '#00BF40',
  포토북: '#8050DF',
  잡지: '#F5C400',
  MD: '#FF9200',
  기타: T.tm,
};

export function CategoryHome({ onSelect }: { onSelect?: () => void }) {
  const albums = useStore(useShallow((s) => s.albums.filter((a) => a.isVisible !== false)));
  const selectAlbum = useStore((s) => s.selectAlbum);
  const navigate = useNavigate();

  // 카테고리 타입별로 그룹핑 (실제 데이터가 있는 것만)
  const grouped = CATEGORY_TYPES
    .map((ct) => ({ type: ct, items: albums.filter((a) => a.categoryType === ct) }))
    .filter((g) => g.items.length > 0);

  async function handleItemClick(albumId: string) {
    await selectAlbum(albumId);
    onSelect?.();
  }

  return (
    <>
      {/* 헤더 */}
      <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <img src={LOGO} alt="NFlying" style={{ height: 50, width: 'auto' }} />
        <button onClick={() => navigate('/admin')} style={{ height: 32, padding: '0 12px', borderRadius: 100, background: T.bl, display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer' }}>
          <Icon.lock c={T.tm} sz={13} />
          <span style={{ fontSize: 12, color: T.tm, fontWeight: 500 }}>관리자</span>
        </button>
      </div>

      {/* 페이지 타이틀 */}
      <div style={{ padding: '20px 16px 12px', flexShrink: 0 }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 3 }}>카테고리</p>
        <p style={{ fontSize: 13, color: T.tm }}>소장 중인 포카를 카테고리별로 기록해보세요</p>
      </div>

      {/* 카테고리 그룹 목록 */}
      <div style={{ flex: 1, padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
        {grouped.map(({ type, items }) => (
          <div key={type}>
            {/* 카테고리 타입 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 4, height: 16, borderRadius: 100, background: CAT_COLOR[type], flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: T.t }}>{type}</span>
              <span style={{ fontSize: 12, color: T.tl }}>{items.length}개</span>
            </div>
            {/* 아이템 카드 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((al, i) => (
                <button
                  key={al.id}
                  onClick={() => handleItemClick(al.id)}
                  style={{
                    background: T.s, borderRadius: 14, border: `1px solid ${i === 0 && type === '앨범' ? 'rgba(51,102,255,0.35)' : T.b}`,
                    padding: 14, display: 'flex', gap: 14, alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)', cursor: 'pointer', textAlign: 'left', fontFamily: T.f,
                  }}
                >
                  {/* 썸네일 */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 11,
                    background: al.thumbnailUrl ? undefined : `linear-gradient(135deg, ${CAT_COLOR[type]}22, ${MC[MEMBERS[i % MEMBERS.length]]}28)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: `1px solid ${T.b}`, overflow: 'hidden',
                  }}>
                    {al.thumbnailUrl
                      ? <img src={al.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <img src={LOGO} alt="" style={{ width: '60%', opacity: 0.5 }} />}
                  </div>
                  {/* 정보 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: T.t }}>{al.name}</span>
                      {al.sub && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: CAT_COLOR[type], background: CAT_COLOR[type] + '18', borderRadius: 6, padding: '2px 7px' }}>{al.sub}</span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: T.tm, marginBottom: 4 }}>
                      {[al.year, `포카 ${al.count}종`, `${al.versions.length}버전`].filter(Boolean).join(' · ')}
                    </p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {al.versions.slice(0, 3).map((v) => (
                        <span key={v} style={{ fontSize: 11, color: T.p, background: T.pb, borderRadius: 5, padding: '2px 7px', fontWeight: 600 }}>{v}</span>
                      ))}
                      {al.versions.length > 3 && (
                        <span style={{ fontSize: 11, color: T.tl, background: T.bl, borderRadius: 5, padding: '2px 7px' }}>+{al.versions.length - 3}</span>
                      )}
                    </div>
                  </div>
                  <Icon.chev c={T.tl} d="right" />
                </button>
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 13 }}>
            등록된 카테고리가 없습니다
          </div>
        )}
      </div>
    </>
  );
}
