// ── 포카 추가/편집 모달 — PRD 4-6, handoff 2-4 ─────────────────────────
import { useRef, useState } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { Icon } from '../../components/icons';
import { useStore } from '../../store/useStore';
import { uploadImage } from '../../lib/supabase';
import type { Album, PocaCard } from '../../types';

const fieldStyle: React.CSSProperties = { height: 42, borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, padding: '0 14px', fontSize: 14, color: T.t, width: '100%', fontFamily: T.f, outline: 'none' };
const Label = ({ children }: { children: React.ReactNode }) => <p style={{ fontSize: 12, fontWeight: 600, color: T.tm, marginBottom: 7 }}>{children}</p>;

export function AdminPocaEditModal({ album, card, nextOrder, onClose }: { album: Album; card: PocaCard | null; nextOrder: number; onClose: () => void }) {
  const saveCard = useStore((s) => s.saveCard);
  const ref = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(card?.name ?? '');
  const [member, setMember] = useState(card?.member ?? MEMBERS[0]);
  const [version, setVersion] = useState(card?.version ?? album.versions[0] ?? '');
  const [source, setSource] = useState(card?.source ?? album.sources[0] ?? '');
  const [imageUrl, setImageUrl] = useState<string | null>(card?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    try {
      setImageUrl(await uploadImage(f, `cards/${album.id}`));
    } catch (e) {
      console.error('이미지 업로드 실패', e);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const onSave = () => {
    const finalName = name.trim() || `${member} 포토카드`;
    saveCard({
      id: card?.id ?? `${album.id}-${Date.now()}`,
      albumId: album.id,
      name: finalName, member, version, source, imageUrl,
      sortOrder: card?.sortOrder ?? nextOrder,
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,18,0.5)' }} className="sheet-overlay" />
      <div className="modal-panel" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 640, maxWidth: '94vw', background: T.s, borderRadius: 22, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.3)', fontFamily: T.f }}>
        <div style={{ padding: '22px 28px', borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: T.t }}>{card ? '포카 편집' : '포카 추가'}</span>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 9, background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><Icon.close c={T.tm} sz={12} /></button>
        </div>
        <div style={{ padding: 28, display: 'flex', gap: 24 }}>
          {/* Thumbnail */}
          <div style={{ width: 150, flexShrink: 0 }}>
            <Label>썸네일</Label>
            <div onClick={() => !uploading && ref.current?.click()} style={{ width: 150, aspectRatio: '2/3', borderRadius: 12, border: `1.5px dashed ${T.b}`, background: imageUrl ? `url(${imageUrl}) center top/cover` : T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: uploading ? 'default' : 'pointer', overflow: 'hidden' }}>
              {uploading ? <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>업로드 중…</span> : !imageUrl && <><Icon.upload c={T.tl} sz={24} /><span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>이미지 업로드</span><span style={{ fontSize: 10, color: T.tl }}>2:3 비율</span></>}
            </div>
            <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          {/* Fields */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><Label>포카명</Label><input style={fieldStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder={`${member} 포토카드`} /></div>
            <div>
              <Label>멤버</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {MEMBERS.map((m) => {
                  const on = m === member;
                  return (
                    <button key={m} onClick={() => setMember(m)} style={{ height: 34, padding: '0 12px', borderRadius: 100, background: on ? MC[m] : T.bl, border: `1.5px solid ${on ? MC[m] : T.b}`, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontFamily: T.f }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: on ? '#fff' : MC[m] }} />
                      <span style={{ fontSize: 12, fontWeight: on ? 700 : 500, color: on ? '#fff' : T.t }}>{m}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <Label>버전</Label>
                <select style={{ ...fieldStyle, cursor: 'pointer' }} value={version} onChange={(e) => setVersion(e.target.value)}>
                  {album.versions.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <Label>구매처</Label>
                <select style={{ ...fieldStyle, cursor: 'pointer' }} value={source} onChange={(e) => setSource(e.target.value)}>
                  {album.sources.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 28px 26px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ height: 44, padding: '0 20px', borderRadius: 11, border: `1px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', cursor: 'pointer' }}><span style={{ fontSize: 14, color: T.tm, fontWeight: 600 }}>취소</span></button>
          <button onClick={onSave} style={{ height: 44, padding: '0 26px', borderRadius: 11, background: T.p, display: 'flex', alignItems: 'center', boxShadow: '0 4px 16px rgba(51,102,255,0.26)', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>저장</span></button>
        </div>
      </div>
    </div>
  );
}
