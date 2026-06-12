// ── Supabase 데이터 레이어 (PRD 3-2, 3-4, 6, 7) ─────────────────────────
// env 미설정 시 null → store가 샘플 데이터로 폴백한다.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Album, PocaCard, PocaStatusMap } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && key && !url.includes('[project]'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

// DB row ↔ 앱 모델 매핑
interface AlbumRow {
  album_id: string; album_name: string; versions: string[];
  thumbnail_url?: string | null; header_image_url: string | null; bg_image_url: string | null; banner_image_url?: string | null;
  sources: string[]; sort_order: number;
  sub?: string | null; year?: string | null; category_type?: string | null;
  is_visible?: boolean | null;
}
interface CardRow {
  id: string; album_id: string; version: string; name: string;
  member: string; source: string; image_url: string | null; sort_order: number;
}

const toAlbum = (r: AlbumRow, count: number): Album => ({
  id: r.album_id, name: r.album_name, sub: r.sub ?? '', year: r.year ?? '',
  categoryType: (r.category_type as Album['categoryType']) ?? '앨범',
  versions: r.versions ?? [], sources: r.sources ?? [], count,
  thumbnailUrl: r.thumbnail_url ?? null,
  headerImageUrl: r.header_image_url ?? null,
  bgImageUrl: r.bg_image_url ?? null,
  bannerImageUrl: r.banner_image_url ?? null,
  sortOrder: r.sort_order, isVisible: r.is_visible ?? true,
});
const toCard = (r: CardRow): PocaCard => ({
  id: r.id, albumId: r.album_id, version: r.version, name: r.name,
  member: r.member, source: r.source, imageUrl: r.image_url, sortOrder: r.sort_order,
});

export async function fetchAlbums(): Promise<Album[]> {
  if (!supabase) return [];
  const { data: albums, error } = await supabase
    .from('album_meta').select('*').order('sort_order');
  if (error) throw error;
  const { data: cards } = await supabase.from('album_poca_cards').select('album_id');
  const counts = new Map<string, number>();
  (cards ?? []).forEach((c: { album_id: string }) =>
    counts.set(c.album_id, (counts.get(c.album_id) ?? 0) + 1));
  return (albums as AlbumRow[]).map((r) => toAlbum(r, counts.get(r.album_id) ?? 0));
}

export async function fetchCards(albumId: string): Promise<PocaCard[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('album_poca_cards').select('*').eq('album_id', albumId).order('sort_order');
  if (error) throw error;
  return (data as CardRow[]).map(toCard);
}

// ── 관리자 인증 (Supabase Auth) ─────────────────────────────────────────
// 관리자 = 실제 Auth 계정. 로그인 세션의 JWT로 쓰기 → RLS의 is_admin()이 허용.
export async function signInAdmin(email: string, password: string): Promise<boolean> {
  if (!supabase) return /\S+@\S+/.test(email); // 로컬(샘플) 모드: 형식만 확인
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}
export async function signOutAdmin(): Promise<void> {
  await supabase?.auth.signOut();
}
export async function hasAdminSession(): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

// ── 관리자 쓰기 (인증 세션 + RLS is_admin()로 허용) ─────────────────────
function requireClient(): SupabaseClient {
  if (!supabase) throw new Error('Supabase 미설정');
  return supabase;
}

export async function upsertAlbumDb(a: Album): Promise<void> {
  const { error } = await requireClient().from('album_meta').upsert({
    album_id: a.id, album_name: a.name, sub: a.sub || null, year: a.year || null,
    category_type: a.categoryType ?? '앨범',
    versions: a.versions,
    thumbnail_url: a.thumbnailUrl ?? null,
    header_image_url: a.headerImageUrl ?? null,
    bg_image_url: a.bgImageUrl ?? null,
    banner_image_url: a.bannerImageUrl ?? null,
    sources: a.sources, sort_order: a.sortOrder, is_visible: a.isVisible ?? true,
  });
  if (error) throw error;
}
export async function deleteAlbumDb(id: string): Promise<void> {
  const { error } = await requireClient().from('album_meta').delete().eq('album_id', id);
  if (error) throw error;
}
export async function upsertCardDb(c: PocaCard): Promise<void> {
  const { error } = await requireClient().from('album_poca_cards').upsert({
    id: c.id, album_id: c.albumId, version: c.version, name: c.name,
    member: c.member, source: c.source, image_url: c.imageUrl, sort_order: c.sortOrder,
  });
  if (error) throw error;
}
export async function deleteCardDb(id: string): Promise<void> {
  const { error } = await requireClient().from('album_poca_cards').delete().eq('id', id);
  if (error) throw error;
}
export async function reorderCardsDb(orderedIds: string[]): Promise<void> {
  const client = requireClient();
  const results = await Promise.all(
    orderedIds.map((id, i) => client.from('album_poca_cards').update({ sort_order: i }).eq('id', id)),
  );
  const err = results.find((r) => r.error)?.error;
  if (err) throw err;
}

// ── 소장 정보 (user_data 테이블) ─────────────────────────────────────────
export async function fetchUserData(): Promise<{ statusMap: PocaStatusMap; photobook: string[] } | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) return null;
  const { data, error } = await supabase
    .from('user_data')
    .select('status_map, photobook')
    .eq('user_email', session.user.email)
    .maybeSingle();
  if (error) { console.warn('user_data 로드 실패', error); return null; }
  if (!data) return { statusMap: {}, photobook: [] };
  return {
    statusMap: (data.status_map as PocaStatusMap) ?? {},
    photobook: (data.photobook as string[]) ?? [],
  };
}

export async function upsertUserData(statusMap: PocaStatusMap, photobook: string[]): Promise<void> {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) return;
  const { error } = await supabase.from('user_data').upsert({
    user_email: session.user.email,
    status_map: statusMap,
    photobook,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_email' });
  if (error) console.warn('user_data 저장 실패', error);
}

// 이미지 업로드: 인증 관리자 → Storage 직접 업로드. 미설정 시 dataURL 폴백.
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  if (!supabase) {
    return await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from('poca-images').upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from('poca-images').getPublicUrl(path).data.publicUrl;
}
