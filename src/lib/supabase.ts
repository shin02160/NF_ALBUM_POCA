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

// 관리자 쓰기는 anon 키로 직접 하지 않는다(RLS 읽기 전용). 모두 Edge Function 경유 → src/lib/adminApi.ts
