-- ── NF ALBUM POCA · Supabase 스키마 (PRD 3-2) ──────────────────────────
-- Supabase SQL Editor에서 실행. anon 키로 읽기, 관리자 쓰기는 앱단 PIN으로 게이트.

-- 앨범 메타
create table if not exists album_meta (
  album_id     text primary key,
  album_name   text not null,
  sub          text,
  year         text,
  versions     text[] not null default '{}',
  header_image text,
  bg_image     text,
  sources      text[] not null default array['FNC STORE','애플뮤직'],
  sort_order   int not null default 0
);

-- 포카 카드
create table if not exists album_poca_cards (
  id         text primary key,
  album_id   text not null references album_meta(album_id) on delete cascade,
  version    text not null,
  name       text not null,
  member     text not null,
  source     text not null,
  image_url  text,
  sort_order int not null default 0
);

create index if not exists idx_cards_album on album_poca_cards(album_id, sort_order);

-- RLS: 공개 읽기 (anon). 쓰기는 service_role 또는 별도 정책으로 제한.
alter table album_meta enable row level security;
alter table album_poca_cards enable row level security;

create policy "public read album_meta"
  on album_meta for select using (true);
create policy "public read album_poca_cards"
  on album_poca_cards for select using (true);

-- NOTE: 관리자 쓰기(insert/update/delete)는 PRD상 6자리 PIN(VITE_ADMIN_PASSWORD)으로
-- 클라이언트에서 게이트. 운영 강화 시 Supabase Auth + 별도 write 정책 권장.
-- 이미지: Supabase Storage 공개 버킷(예: poca-images) 생성 후 image_url에 public URL 저장.
