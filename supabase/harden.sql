-- ── NF ALBUM POCA · 보안 하드닝 ────────────────────────────────────────
-- 목적: 관리자 PIN을 클라이언트 번들에서 제거하고, anon 직접 쓰기를 차단한다.
-- 쓰기는 Edge Function(poca-admin, service_role)만 수행. 클라이언트(anon)는 읽기 전용.

create extension if not exists pgcrypto with schema extensions;

-- 관리자 PIN 해시 보관 (비공개: RLS 정책 없음 → anon/authenticated 접근 불가, service_role만)
create table if not exists public.admin_config (
  id int primary key default 1,
  pin_hash text not null,
  constraint admin_config_single_row check (id = 1)
);
alter table public.admin_config enable row level security;

-- 초기 PIN (반드시 변경: select set_admin_pin('새6자리');)
insert into public.admin_config (id, pin_hash)
values (1, extensions.crypt('000000', extensions.gen_salt('bf')))
on conflict (id) do nothing;

-- PIN 검증/변경 함수 (service_role 전용)
create or replace function public.verify_admin_pin(p text)
returns boolean language sql security definer set search_path = public, extensions as $$
  select exists (select 1 from admin_config where id = 1 and pin_hash = extensions.crypt(p, pin_hash));
$$;
revoke all on function public.verify_admin_pin(text) from anon, authenticated, public;

create or replace function public.set_admin_pin(p text)
returns void language sql security definer set search_path = public, extensions as $$
  update admin_config set pin_hash = extensions.crypt(p, extensions.gen_salt('bf')) where id = 1;
$$;
revoke all on function public.set_admin_pin(text) from anon, authenticated, public;

-- ▼ 쓰기 잠금: anon 직접 쓰기 정책 제거 (공개 읽기 정책은 schema.sql에서 유지)
drop policy if exists "anon write album_meta" on public.album_meta;
drop policy if exists "anon write album_poca_cards" on public.album_poca_cards;
drop policy if exists "anon upload poca-images" on storage.objects;
drop policy if exists "anon update poca-images" on storage.objects;

-- 결과: album_meta/album_poca_cards/storage 는 공개 SELECT만 허용.
-- 모든 INSERT/UPDATE/DELETE 는 Edge Function(service_role) 경유. → supabase/functions/poca-admin
