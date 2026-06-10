-- ── NF ALBUM POCA · 관리자 인증(Supabase Auth) + role 기반 RLS ──────────
-- 보안 모델:
--   읽기  = 공개(anon)         → schema.sql의 public read 정책
--   쓰기  = 인증된 관리자만     → 아래 is_admin() 기반 정책
-- 관리자 = Supabase Auth 계정(이메일/비번). 클라이언트가 로그인 세션 JWT로 직접 쓰기.
-- (이전 PIN/Edge Function 방식은 폐기 — 공유 비밀 없음, 번들에 비번 없음.)

-- 관리자 허용 이메일 (비공개: 정책 없음 → is_admin()만 security definer로 조회)
create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz default now()
);
alter table public.admin_users enable row level security;

-- 관리자 이메일 등록 (본인 Auth 계정 이메일로 변경)
insert into public.admin_users(email) values ('youngshin02160@aol.com')
on conflict (email) do nothing;

-- 현재 로그인 사용자가 관리자인지 (JWT email 기준)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from admin_users where lower(email) = lower(coalesce(auth.email(), ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 쓰기 정책: 인증된 관리자만 (공개 SELECT는 schema.sql)
create policy "admin write album_meta" on public.album_meta
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write album_poca_cards" on public.album_poca_cards
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write poca-images" on storage.objects
  for all to authenticated using (bucket_id = 'poca-images' and public.is_admin())
  with check (bucket_id = 'poca-images' and public.is_admin());

-- 운영 체크리스트:
--   1) Authentication → Users → Add user 로 관리자 계정 생성 (Auto Confirm)
--      또는 위 admin_users 이메일과 동일하게.
--   2) Authentication → Sign In/Up → "Allow new users to sign up" 비활성(권장).
--   3) 관리자 이메일 변경 시:
--        delete from admin_users; insert into admin_users(email) values ('새이메일');
