// ── 앨범 관리 (CRUD) — PRD 4-6, handoff 2-2 ────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { useStore } from '../../store/useStore';
import { uploadImage } from '../../lib/adminApi';
import type { Album } from '../../types';

const fieldStyle: React.CSSProperties = { height: 42, borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, padding: '0 14px', fontSize: 14, color: T.t, width: '100%', fontFamily: T.f, outline: 'none' };
const Label = ({ children }: { children: React.ReactNode }) => <p style={{ fontSize: 12, fontWeight: 600, color: T.tm, marginBottom: 7 }}>{children}</p>;

function emptyAlbum(order: number): Album {
  return { id: '', name: '', sub: '', year: '', versions: [], sources: [], count: 0, headerImage: null, bgImage: null, sortOrder: order };
}

export function AdminAlbums() {
  const albums = useStore((s) => s.albums);
  const saveAlbum = useStore((s) => s.saveAlbum);
  const deleteAlbum = useStore((s) => s.deleteAlbum);

  const [selectedId, setSelectedId] = useState<string | null>(albums[0]?.id ?? null);
  const [draft, setDraft] = useState<Album | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const al = albums.find((a) => a.id === selectedId);
    setDraft(al ? { ...al } : null);
  }, [selectedId, albums, isNew]);

  const startNew = () => {
    setIsNew(true);
    setSelectedId(null);
    setDraft(emptyAlbum(albums.length + 1));
  };

  const onSave = () => {
    if (!draft) return;
    const id = draft.id || draft.name.trim().toLowerCase().replace(/\s+/g, '-') || `album-${Date.now()}`;
    const toSave = { ...draft, id };
    saveAlbum(toSave);
    setIsNew(false);
    setSelectedId(id);
  };

  const onDelete = () => {
    if (!draft?.id) return;
    if (!confirm(`'${draft.name}' 앨범을 삭제할까요? 포함된 포카도 함께 삭제됩니다.`)) return;
    deleteAlbum(draft.id);
    setSelectedId(albums.find((a) => a.id !== draft.id)?.id ?? null);
    setIsNew(false);
  };

  return (
    <>
      {/* Left: album list */}
      <div style={{ width: 340, borderRight: `1px solid ${T.b}`, background: T.s, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.t }}>앨범 목록</span>
          <button onClick={startNew} style={{ height: 32, padding: '0 12px', borderRadius: 100, background: T.p, display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer' }}><Icon.plus c="#fff" sz={12} /><span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>추가</span></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {albums.map((al, i) => {
            const on = al.id === selectedId;
            return (
              <button key={al.id} onClick={() => { setIsNew(false); setSelectedId(al.id); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, background: on ? T.pb : 'transparent', marginBottom: 4, border: on ? `1px solid rgba(51,102,255,0.3)` : '1px solid transparent', cursor: 'pointer', textAlign: 'left', fontFamily: T.f }}>
                <div style={{ width: 44, height: 44, borderRadius: 9, background: al.headerImage ? `url(${al.headerImage}) center/cover` : `linear-gradient(135deg, ${MC[MEMBERS[i % MEMBERS.length]]}22, ${T.p}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{!al.headerImage && <img src={LOGO} style={{ width: '60%', opacity: 0.5 }} />}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: on ? T.p : T.t, marginBottom: 2 }}>{al.name}</p>
                  <p style={{ fontSize: 11, color: T.tm }}>{al.count}종 · {al.versions.length}버전</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: edit form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {!draft ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 14 }}>앨범을 선택하거나 새로 추가하세요</div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div>
                <p style={{ fontSize: 12, color: T.tl, fontWeight: 600, marginBottom: 3 }}>{isNew ? '새 앨범' : '앨범 편집'}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>{draft.name || '(이름 없음)'}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!isNew && <button onClick={onDelete} style={{ height: 38, padding: '0 14px', borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Icon.trash c={T.tm} sz={15} /><span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>삭제</span></button>}
                <button onClick={onSave} style={{ height: 38, padding: '0 18px', borderRadius: 10, background: T.p, display: 'flex', alignItems: 'center', boxShadow: '0 2px 10px rgba(51,102,255,0.25)', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>저장</span></button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px', maxWidth: 760 }}>
              <div><Label>앨범명</Label><input style={fieldStyle} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="예: Everlasting" /></div>
              <div><Label>정렬 순서</Label><input style={fieldStyle} type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></div>
              <div><Label>부제</Label><input style={fieldStyle} value={draft.sub} onChange={(e) => setDraft({ ...draft, sub: e.target.value })} placeholder="예: 정규 2집" /></div>
              <div><Label>발매 연도</Label><input style={fieldStyle} value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} placeholder="예: 2025" /></div>

              <ChipEditor label="버전 목록" items={draft.versions} onChange={(versions) => setDraft({ ...draft, versions })} addLabel="버전 추가" active />
              <ChipEditor label="구매처 목록" items={draft.sources} onChange={(sources) => setDraft({ ...draft, sources })} addLabel="구매처 추가" />

              <ImageUpload label="헤더 이미지" value={draft.headerImage} onChange={(headerImage) => setDraft({ ...draft, headerImage })} hint="1080×320 권장" preview />
              <ImageUpload label="배경 이미지" value={draft.bgImage} onChange={(bgImage) => setDraft({ ...draft, bgImage })} hint="Supabase Storage" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ChipEditor({ label, items, onChange, addLabel, active }: { label: string; items: string[]; onChange: (v: string[]) => void; addLabel: string; active?: boolean }) {
  const add = () => {
    const v = prompt(`${addLabel}`)?.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
  };
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <Label>{label}</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {items.map((v) => (
          <div key={v} style={{ height: 36, padding: '0 8px 0 14px', borderRadius: 100, background: active ? T.pb : T.bl, border: `1.5px solid ${active ? T.p : T.b}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: active ? T.p : T.t, fontWeight: active ? 600 : 500 }}>{v}</span>
            <button onClick={() => onChange(items.filter((x) => x !== v))} style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><Icon.close c={active ? T.p : T.tm} sz={8} /></button>
          </div>
        ))}
        <button onClick={add} style={{ height: 36, padding: '0 14px', borderRadius: 100, border: `1.5px dashed ${T.b}`, background: 'none', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}><Icon.plus c={T.tm} sz={11} /><span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>{addLabel}</span></button>
      </div>
    </div>
  );
}

function ImageUpload({ label, value, onChange, hint, preview }: { label: string; value?: string | null; onChange: (v: string | null) => void; hint: string; preview?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    try {
      onChange(await uploadImage(f, 'albums'));
    } catch (e) {
      console.error('이미지 업로드 실패', e);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };
  const bg = value
    ? `url(${value}) center/cover`
    : preview ? 'linear-gradient(120deg, #1a1a2e, #3366FF)' : T.s;
  const light = !value && !preview;
  return (
    <div>
      <Label>{label}</Label>
      <div onClick={() => !uploading && ref.current?.click()} style={{ height: 130, borderRadius: 12, border: `1.5px dashed ${T.b}`, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden', position: 'relative', cursor: uploading ? 'default' : 'pointer' }}>
        {!value && !light && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, #1a1a2e, #3366FF)', opacity: 0.92 }} />}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Icon.upload c={value || !light ? '#fff' : T.tl} sz={22} />
          <span style={{ fontSize: 12, color: value || !light ? '#fff' : T.tm, fontWeight: 600 }}>{uploading ? '업로드 중…' : value ? '이미지 교체' : `${label} 업로드`}</span>
          <span style={{ fontSize: 10, color: value || !light ? 'rgba(255,255,255,0.7)' : T.tl }}>{hint}</span>
        </div>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
