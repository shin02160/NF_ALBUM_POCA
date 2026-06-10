# NF ALBUM POCA

N.Flying 앨범 발매 시 버전별 포카리스트를 관리자가 구성하고, 사용자가 소장 상태를 기록·저장·공유하는 웹앱. (PRD v0.4 / 디자인 핸드오프 high-fidelity 기준 구현)

## 스택 (PRD 6장)

- **React 19 + Vite** (TypeScript) — 단일 웹앱 (모바일 뷰 + 관리자 뷰 통합)
- **Zustand** — 상태 관리
- **virtua** (VList) — 포카 목록 가상 스크롤
- **@dnd-kit/sortable** — 포토북/포카 테이블 드래그 정렬
- **html2canvas** (동적 import) — 포토북 PNG export
- **Supabase** (PostgreSQL + Storage) — 데이터/이미지 (미설정 시 샘플 데이터 폴백)
- **LocalStorage** — 사용자 소장 상태 / 포토북 영속화
- 배포: **Vercel**

## 빠른 시작

```bash
npm install
cp .env.example .env   # 값 채우기 (선택: Supabase 미설정 시 샘플 데이터로 동작)
npm run dev            # http://localhost:5173
npm run build          # 프로덕션 빌드 (tsc + vite)
```

### 환경변수 (.env — PRD 7장)

```
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_KEY=sb_publishable_***   # anon(publishable) 키 — 읽기 전용
```

> 관리자 PIN은 클라이언트 env에 두지 않습니다. DB(`admin_config`)에 해시로 저장되고
> Edge Function(`poca-admin`)에서만 대조합니다. (보안 모델 섹션 참조)
>
> Supabase 미설정/미연결 시 `src/data/sampleData.ts`의 샘플 앨범·포카로 동작하며,
> 소장 상태·포토북은 LocalStorage에 저장됩니다. (이 경우 관리자는 6자리 형식만 확인)

## 라우트

| 경로 | 화면 |
|---|---|
| `/` | 앨범 선택 (모바일) |
| `/list` `/dash` `/book` | 포카 목록 · 대시보드 · 포토북 (하단 탭) |
| `/admin` | 관리자 로그인 (Supabase Auth · 이메일/비번) |
| `/admin/albums` `/admin/pocas` | 앨범 관리 · 포카 관리 |

## 구현된 기능 (PRD 4장)

- **앨범 선택** → 포카 목록 진입
- **포카 목록**: 리스트/그리드 토글, 검색, 버전·멤버·구매처 복수 필터, 가상 스크롤, 상태 색상 범례
- **상태 기록**: 카드 탭 → 바텀시트 → 소장(파랑)/구해요(빨강)/교환가능(노랑) 토글, 즉시 LocalStorage 저장, 썸네일 테두리 색 반영
- **대시보드**: [일반] 전체/버전별/판매처별 현황 + [사용자 현황] 소장률 도넛·버전별·판매처별·멤버별 (실시간 계산)
- **포토북**: 담기/삭제, 드래그 순서 변경(@dnd-kit), 4열 PNG export(html2canvas) + 공유(Web Share API), LocalStorage 영속화
- **관리자**: Supabase Auth(이메일/비번) 로그인, 앨범 CRUD(버전·구매처 칩, 헤더/배경 이미지 업로드), 포카 CRUD(테이블 + 드래그 정렬 + 추가/편집 모달)

## Supabase 설정

1. `supabase/schema.sql` 실행 → `album_meta`/`album_poca_cards` + 공개 읽기 RLS
2. 공개 Storage 버킷 `poca-images` 생성 (+ 공개 read 정책)
3. `supabase/auth_rls.sql` 실행 → 관리자 role 기반 쓰기 정책 (`admin_users`, `is_admin()`)
4. **관리자 계정 생성**: Authentication → Users → Add user (Auto Confirm), 이메일을 `admin_users`와 일치
5. (권장) Authentication → "Allow new users to sign up" 비활성

## 보안 모델 (Supabase Auth + role RLS)

- **읽기**: 클라이언트 anon(publishable) 키로 **읽기 전용** (RLS: 공개 SELECT만).
- **쓰기**: 관리자가 **Supabase Auth로 로그인**한 세션 JWT로 직접 수행. RLS의 `is_admin()`
  (= JWT 이메일이 `admin_users`에 있는지)이 통과해야만 INSERT/UPDATE/DELETE 허용.
  → **비로그인/일반 사용자는 DB·Storage에 쓸 수 없음** (RLS 차단, 검증됨).
- **비밀번호**: Supabase Auth가 관리(해시·세션·리프레시). 앱 번들/`env` 어디에도 비번 없음.
- **세션**: 로그인 후 브라우저에 안전 보관 → 새로고침해도 유지. 로그아웃 시 폐기.
- **관리자 이메일 변경**: `delete from admin_users; insert into admin_users(email) values ('새이메일');`
- 이전 PIN/Edge Function 방식은 폐기됨(공유 비밀 제거).

## 디자인 토큰

`src/theme/tokens.ts` — 색상/상태색/멤버색. 디자인 핸드오프 README의 토큰을 그대로 반영했습니다.

## 구조

```
src/
  theme/tokens.ts        디자인 토큰
  types.ts               Album / PocaCard / Filters 등
  lib/supabase.ts        데이터 레이어 (Supabase ↔ 모델, 미설정 시 빈 결과)
  lib/selectors.ts       필터/검색 로직
  data/sampleData.ts     샘플 데이터 (폴백)
  store/useStore.ts      Zustand 스토어 (+ LocalStorage)
  components/            PocaCard, BottomTab, atoms, icons, BottomSheet, PhoneFrame
  screens/mobile/        AlbumSelect, PocaListScreen, StatusSheet, FilterModal, Dashboard, Photobook, MobileShell
  screens/admin/         AdminLogin, AdminLayout, AdminAlbums, AdminPocas, AdminPocaEditModal
```

## PRD ↔ 디자인 문서 정합성 메모

- 디자인 README는 "코드베이스 없을 시 RN+Expo/Next.js"를 *권장*했으나, **PRD 6장이 React 19+Vite 웹앱으로 스택을 확정**했고 디자인 시안(JSX) 자체가 웹 React이므로 **단일 웹앱**으로 구현했습니다.
- 모바일 화면은 375×812 폰 프레임으로 중앙 렌더, 관리자 화면은 데스크탑 전체 폭으로 렌더합니다.
