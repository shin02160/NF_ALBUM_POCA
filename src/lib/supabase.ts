// ── Supabase 데이터 레이어 (PRD 3-2, 3-4, 6, 7) ─────────────────────────
// env 미설정 시 null → store가 샘플 데이터로 폴백한다.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Album, PocaCard } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && key && !url.includes('[project]'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, key!)
  : null;

// DB row ↔ 앱 모델 매핑
interface AlbumRow {
  album_id: string; album_name: string; versions: string[];
  header_image: string | null; bg_image: string | null;
  sources: string[]; sort_order: number;
  sub?: string | null; year?: string | null;
}
interface CardRow {
  id: string; album_id: string; version: string; name: string;
  member: string; source: string; image_url: string | null; sort_order: number;
}

const toAlbum = (r: AlbumRow, count: number): Album => ({
  id: r.album_id, name: r.album_name, sub: r.sub ?? '', year: r.year ?? '',
  versions: r.versions ?? [], sources: r.sources ?? [], count,
  headerImage: r.header_image, bgImage: r.bg_image, sortOrder: r.sort_order,
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

// ── 관리자 쓰기 (PRD 4-6) ───────────────────────────────────────────────
export async function upsertAlbumDb(a: Album): Promise<void> {
  if (!supabase) return;
  const row = {
    album_id: a.id, album_name: a.name, sub: a.sub || null, year: a.year || null,
    versions: a.versions, header_image: a.headerImage ?? null,
    bg_image: a.bgImage ?? null, sources: a.sources, sort_order: a.sortOrder,
  };
  const { error } = await supabase.from('album_meta').upsert(row);
  if (error) throw error;
}

export async function deleteAlbumDb(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('album_meta').delete().eq('album_id', id);
  if (error) throw error;
}

export async function upsertCardDb(c: PocaCard): Promise<void> {
  if (!supabase) return;
  const row = {
    id: c.id, album_id: c.albumId, version: c.version, name: c.name,
    member: c.member, source: c.source, image_url: c.imageUrl, sort_order: c.sortOrder,
  };
  const { error } = await supabase.from('album_poca_cards').upsert(row);
  if (error) throw error;
}

export async function deleteCardDb(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('album_poca_cards').delete().eq('id', id);
  if (error) throw error;
}

// 이미지 업로드: Supabase Storage 공개 버킷(poca-images). 미설정 시 dataURL 폴백.
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
    .from('poca-images')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from('poca-images').getPublicUrl(path).data.publicUrl;
}

export async function reorderCardsDb(orderedIds: string[]): Promise<void> {
  if (!supabase) return;
  const updates = orderedIds.map((id, i) =>
    supabase.from('album_poca_cards').update({ sort_order: i }).eq('id', id));
  const results = await Promise.all(updates);
  const err = results.find((r) => r.error)?.error;
  if (err) throw err;
}
