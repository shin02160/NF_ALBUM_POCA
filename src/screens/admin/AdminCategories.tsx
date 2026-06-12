// ── 카테고리 관리 (CRUD) — PRD v0.9 Admin ───────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { T, MC, MEMBERS } from '../../theme/tokens';
import { LOGO } from '../../assets';
import { Icon } from '../../components/icons';
import { useStore } from '../../store/useStore';
import { uploadImage } from '../../lib/supabase';
import { SaveAlert, useSaveAlert } from '../../components/SaveAlert';
import type { Album, CategoryType } from '../../types';
import { CATEGORY_TYPES } from '../../types';

const fieldStyle: React.CSSProperties = { height: 42, borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, padding: '0 14px', fontSize: 14, color: T.t, width: '100%', fontFamily: T.f, outline: 'none' };
const Label = ({ children }: { children: React.ReactNode }) => <p style={{ fontSize: 12, fontWeight: 600, color: T.tm, marginBottom: 7 }}>{children}</p>;

const CAT_COLOR: Partial<Record<CategoryType, string>> = {
  앨범: T.p, 콘서트: '#FF6B35', 팬미팅: '#F553DA', 팬클럽: '#20B2AA',
  시즌그리팅: '#00BF40', 포토북: '#8050DF', 잡지: '#F5C400', MD: '#FF9200', 기타: T.tm,
};

function emptyItem(order: number): Album {
  return {
    id: '', name: '', sub: '', year: '', categoryType: '앨범',
    versions: [], sources: [], count: 0,
    thumbnailUrl: null, headerImageUrl: null, bgImageUrl: null, bannerImageUrl: null,
    sortOrder: order, isVisible: true,
  };
}

export function AdminCategories() {
  const albums = useStore((s) => s.albums);
  const saveAlbum = useStore((s) => s.saveAlbum);
  const deleteAlbum = useStore((s) => s.deleteAlbum);
  const { alertState, triggerSave } = useSaveAlert();

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
    setDraft(emptyItem(albums.length + 1));
  };

  const onSave = () => {
    if (!draft) return;
    const id = draft.id || draft.name.trim().toLowerCase().replace(/\s+/g, '-') || `item-${Date.now()}`;
    const toSave = { ...draft, id };
    triggerSave(async () => saveAlbum(toSave));
    setIsNew(false);
    setSelectedId(id);
  };

  const onDelete = () => {
    if (!draft?.id) return;
    if (!confirm(`'${draft.name}'을(를) 삭제할까요? 포함된 포카도 함께 삭제됩니다.`)) return;
    deleteAlbum(draft.id);
    setSelectedId(albums.find((a) => a.id !== draft.id)?.id ?? null);
    setIsNew(false);
  };

  return (
    <>
      {/* Left: 아이템 목록 */}
      <div style={{ width: 320, borderRight: `1px solid ${T.b}`, background: T.s, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.t }}>카테고리 목록</span>
          <button onClick={startNew} style={{ height: 32, padding: '0 12px', borderRadius: 100, background: T.p, display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer' }}><Icon.plus c="#fff" sz={12} /><span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>추가</span></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {albums.map((al, i) => {
            const on = al.id === selectedId;
            const accent = CAT_COLOR[al.categoryType] ?? T.p;
            return (
              <button key={al.id} onClick={() => { setIsNew(false); setSelectedId(al.id); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, background: on ? T.pb : 'transparent', marginBottom: 4, border: on ? `1px solid rgba(51,102,255,0.3)` : '1px solid transparent', cursor: 'pointer', textAlign: 'left', fontFamily: T.f }}>
                <div style={{ width: 44, height: 44, borderRadius: 9, background: al.thumbnailUrl ? `url(${al.thumbnailUrl}) center/cover` : `linear-gradient(135deg, ${accent}22, ${MC[MEMBERS[i % MEMBERS.length]]}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {!al.thumbnailUrl && <img src={LOGO} style={{ width: '60%', opacity: 0.5 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: on ? T.p : T.t }}>{al.name}</p>
                    {al.isVisible === false && <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: T.tm, borderRadius: 4, padding: '1px 5px' }}>OFF</span>}
                  </div>
                  <p style={{ fontSize: 11, color: T.tl }}>{al.categoryType} · {al.count}종</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: 편집 폼 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {!draft ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.tl, fontSize: 14 }}>항목을 선택하거나 새로 추가하세요</div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div>
                <p style={{ fontSize: 12, color: T.tl, fontWeight: 600, marginBottom: 3 }}>{isNew ? '새 항목' : '편집'}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>{draft.name || '(이름 없음)'}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={() => setDraft({ ...draft, isVisible: draft.isVisible === false ? true : false })}
                  style={{ height: 38, padding: '0 14px', borderRadius: 10, border: `1px solid ${draft.isVisible === false ? T.b : T.p}`, background: draft.isVisible === false ? T.bl : T.pb, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: draft.isVisible === false ? T.tm : T.p, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: draft.isVisible === false ? T.tm : T.p, fontWeight: 600 }}>{draft.isVisible === false ? 'OFF' : 'ON'}</span>
                </button>
                {!isNew && <button onClick={onDelete} style={{ height: 38, padding: '0 14px', borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Icon.trash c={T.tm} sz={15} /><span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>삭제</span></button>}
                <button onClick={onSave} style={{ height: 38, padding: '0 18px', borderRadius: 10, background: T.p, display: 'flex', alignItems: 'center', boxShadow: '0 2px 10px rgba(51,102,255,0.25)', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>저장</span></button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px', maxWidth: 760 }}>
              {/* 카테고리 타입 */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>카테고리 타입</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORY_TYPES.map((ct) => {
                    const on = draft.categoryType === ct;
                    const accent = CAT_COLOR[ct] ?? T.p;
                    return (
                      <button key={ct} onClick={() => setDraft({ ...draft, categoryType: ct })} style={{ height: 36, padding: '0 14px', borderRadius: 9, border: `${on ? 1.5 : 1}px solid ${on ? accent : T.b}`, background: on ? accent + '18' : T.bl, cursor: 'pointer', fontFamily: T.f }}>
                        <span style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: on ? accent : T.tm }}>{ct}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div><Label>이름</Label><input style={fieldStyle} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="예: Everlasting" /></div>
              <div><Label>정렬 순서</Label><input style={fieldStyle} type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></div>
              <div><Label>부제</Label><input style={fieldStyle} value={draft.sub} onChange={(e) => setDraft({ ...draft, sub: e.target.value })} placeholder="예: 정규 2집" /></div>
              <div><Label>발매 연도</Label><input style={fieldStyle} value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} placeholder="예: 2025" /></div>

              <ChipEditor label="버전 목록" items={draft.versions} onChange={(versions) => setDraft({ ...draft, versions })} addLabel="버전 추가" active />
              <ChipEditor label="구매처 목록" items={draft.sources} onChange={(sources) => setDraft({ ...draft, sources })} addLabel="구매처 추가" />

              {/* 이미지 4종 */}
              <ThumbUpload value={draft.thumbnailUrl} onChange={(thumbnailUrl) => setDraft({ ...draft, thumbnailUrl })} />
              <ImageUpload label="헤더 이미지" folder="categories" value={draft.headerImageUrl} onChange={(headerImageUrl) => setDraft({ ...draft, headerImageUrl })} hint="1080×320 권장" preview />
              <ImageUpload label="배경 이미지" folder="categories" value={draft.bgImageUrl} onChange={(bgImageUrl) => setDraft({ ...draft, bgImageUrl })} hint="배경 전체 영역" />
              <ImageUpload label="배너 이미지" folder="categories" value={draft.bannerImageUrl} onChange={(bannerImageUrl) => setDraft({ ...draft, bannerImageUrl })} hint="홈 배너 영역" preview />
            </div>
          </>
        )}
      </div>
      <SaveAlert state={alertState} />
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

function ThumbUpload({ value, onChange }: { value?: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    try { onChange(await uploadImage(f, 'categories')); }
    catch { alert('이미지 업로드에 실패했습니다.'); }
    finally { setUploading(false); }
  };
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <Label>썸네일 이미지</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, border: `1.5px dashed ${T.b}`, background: value ? `url(${value}) center/cover` : T.bl, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!value && <img src={LOGO} style={{ width: '60%', opacity: 0.4 }} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 11, color: T.tl }}>권장 사이즈: <strong style={{ color: T.tm }}>300×300</strong></p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => !uploading && ref.current?.click()} style={{ height: 36, padding: '0 16px', borderRadius: 9, background: T.p, border: 'none', cursor: uploading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon.upload c="#fff" sz={14} />
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{uploading ? '업로드 중…' : value ? '교체' : '업로드'}</span>
            </button>
            {value && <button onClick={() => onChange(null)} style={{ height: 36, padding: '0 12px', borderRadius: 9, border: `1px solid ${T.b}`, background: T.s, cursor: 'pointer' }}><span style={{ fontSize: 13, color: T.tm }}>제거</span></button>}
          </div>
        </div>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}

function ImageUpload({ label, folder, value, onChange, hint, preview }: { label: string; folder: string; value?: string | null; onChange: (v: string | null) => void; hint: string; preview?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    try { onChange(await uploadImage(f, folder)); }
    catch { alert('이미지 업로드에 실패했습니다.'); }
    finally { setUploading(false); }
  };
  const bg = value
    ? `url(${value}) center/cover`
    : preview ? 'linear-gradient(120deg, #1a1a2e, #3366FF)' : T.s;
  const light = !value && !preview;
  return (
    <div>
      <Label>{label}</Label>
      <div onClick={() => !uploading && ref.current?.click()} style={{ height: 120, borderRadius: 12, border: `1.5px dashed ${T.b}`, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden', position: 'relative', cursor: uploading ? 'default' : 'pointer' }}>
        {!value && !light && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, #1a1a2e, #3366FF)', opacity: 0.92 }} />}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <Icon.upload c={value || !light ? '#fff' : T.tl} sz={20} />
          <span style={{ fontSize: 12, color: value || !light ? '#fff' : T.tm, fontWeight: 600 }}>{uploading ? '업로드 중…' : value ? '교체' : `${label} 업로드`}</span>
          <span style={{ fontSize: 10, color: value || !light ? 'rgba(255,255,255,0.7)' : T.tl }}>{hint}</span>
        </div>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {value && <button onClick={() => onChange(null)} style={{ marginTop: 6, fontSize: 11, color: T.tl, background: 'none', border: 'none', cursor: 'pointer' }}>제거</button>}
    </div>
  );
}
