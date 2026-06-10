-- ── NF ALBUM POCA · Supabase 스키마 (PRD 3-2) ──────────────────────────
-- 1) 이 파일 실행 → 테이블 + 공개 읽기 RLS
-- 2) auth_rls.sql 실행 → 관리자(Auth) role 기반 쓰기 정책
-- 읽기: anon(공개). 쓰기: 인증된 관리자(Supabase Auth)만 (auth_rls.sql 참조).

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

-- RLS: 공개 읽기만. 쓰기 정책은 auth_rls.sql에서 관리자(Auth)로 제한.
alter table album_meta enable row level security;
alter table album_poca_cards enable row level security;

create policy "public read album_meta"
  on album_meta for select using (true);
create policy "public read album_poca_cards"
  on album_poca_cards for select using (true);

-- 이미지: Supabase Storage 공개 버킷(poca-images). 공개 read + 관리자 write는 auth_rls.sql.
