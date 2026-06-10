// ── 관리자 쓰기 API (Supabase Edge Function `poca-admin` 경유) ───────────
// 모든 관리자 쓰기는 서버(service_role)에서 처리. PIN은 번들에 없고 서버에서 해시 대조.
import { isSupabaseConfigured } from './supabase';
import type { Album, PocaCard } from '../types';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/poca-admin`;

// 인증 성공 시 메모리에만 보관 (세션 내, 새로고침 시 소멸 — PRD 4-6)
let adminPin: string | null = null;
export const clearAdminPin = () => { adminPin = null; };
export const hasAdminPin = () => adminPin !== null;

async function call(action: string, payload?: unknown) {
  if (!adminPin) throw new Error('관리자 인증이 필요합니다');
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: adminPin, action, payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

// PIN 검증 (성공 시 메모리에 저장).
// 프로덕션(Supabase): Edge Function이 DB의 해시와 대조 → PIN 값은 번들에 없음.
// 로컬(샘플) 모드: 백엔드가 없으므로 형식만 확인(6자리). 실데이터 없음.
export async function adminVerify(pin: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const ok = /^\d{6}$/.test(pin);
    if (ok) adminPin = pin;
    return ok;
  }
  try {
    const res = await fetch(FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, action: 'verify' }),
    });
    if (res.ok) { adminPin = pin; return true; }
    return false;
  } catch (e) {
    console.error('인증 요청 실패', e);
    return false;
  }
}

// ── 쓰기 (앱 모델 → DB row 매핑은 서버 전송 전 여기서) ──────────────────
export const dbSaveAlbum = (a: Album) =>
  call('saveAlbum', {
    album_id: a.id, album_name: a.name, sub: a.sub || null, year: a.year || null,
    versions: a.versions, header_image: a.headerImage ?? null,
    bg_image: a.bgImage ?? null, sources: a.sources, sort_order: a.sortOrder,
  });

export const dbDeleteAlbum = (id: string) => call('deleteAlbum', { id });

export const dbSaveCard = (c: PocaCard) =>
  call('saveCard', {
    id: c.id, album_id: c.albumId, version: c.version, name: c.name,
    member: c.member, source: c.source, image_url: c.imageUrl, sort_order: c.sortOrder,
  });

export const dbDeleteCard = (id: string) => call('deleteCard', { id });

export const dbReorderCards = (orderedIds: string[]) => call('reorderCards', { orderedIds });

// 이미지 업로드: Supabase면 Edge Function(서버 Storage 업로드), 아니면 dataURL 폴백
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  if (!isSupabaseConfigured) {
    return await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }
  const base64 = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const data = await call('uploadImage', { base64, contentType: file.type, ext, folder });
  return data.url as string;
}
