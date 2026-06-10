# Handoff: NF ALBUM POCA

## Overview

**NF ALBUM POCA**는 N.Flying 팬들이 포토카드(포카)를 앨범별로 기록·관리하는 앱입니다.  
사용자는 소장/구해요/교환가능 상태를 카드에 태깅하고, 포토북으로 내보내거나 컬렉션 통계를 확인할 수 있습니다.  
별도의 관리자 웹(데스크탑)에서 앨범·포카 데이터를 CRUD 방식으로 관리합니다.

---

## About the Design Files

`design_files/` 폴더의 HTML 파일들은 **HTML/React로 제작된 디자인 레퍼런스**입니다.  
프로덕션 코드로 그대로 사용하는 것이 아니라, 기존 코드베이스(React Native, Next.js, Flutter 등)의 패턴과 라이브러리를 활용해 **이 디자인을 그대로 재현**하는 것이 목표입니다.  
코드베이스가 없다면, 모바일은 **React Native + Expo**, 어드민 웹은 **Next.js**를 권장합니다.

브라우저에서 `design_files/NF ALBUM POCA.html`을 열면 전체 화면을 패닝·줌으로 탐색할 수 있습니다.

---

## Fidelity

**High-fidelity** — 최종 색상, 타이포그래피, 여백, 인터랙션 흐름이 모두 픽셀 수준으로 명세되어 있습니다.  
개발 시 아래 스펙을 그대로 적용하세요.

---

## Design System Tokens

### Colors

| Token | Value | Usage |
|---|---|---|
| `bg` | `#f5f5f7` | 앱 배경 |
| `surface` | `#ffffff` | 카드, 헤더, 탭바 배경 |
| `border` | `#dbdcdf` | 구분선, 카드 테두리 |
| `border-light` | `#f4f4f5` | 배경 칩, 토글 트랙 |
| `text` | `rgb(23,23,25)` | 기본 텍스트 |
| `text-mid` | `rgb(112,115,124)` | 보조 텍스트, 레이블 |
| `text-light` | `rgb(152,155,162)` | 플레이스홀더, 비활성 |
| `primary` | `rgb(51,102,255)` | 주요 액션, 활성 탭, CTA |
| `primary-bg` | `rgb(234,242,254)` | 프라이머리 배경 틴트 |

#### Status Colors (포카 상태 테두리/배지)

| 상태 | 텍스트 색 | 배경 색 |
|---|---|---|
| 소장 | `rgb(51,102,255)` | `rgb(234,242,254)` |
| 구해요 | `rgb(255,66,66)` | `rgb(254,236,236)` |
| 교환 가능 | `rgb(245,168,0)` | `rgb(255,247,229)` |

#### Member Colors (뱃지/차트)

| 멤버 | 색상 |
|---|---|
| 승협 | `#3366FF` |
| 훈 | `#00BF40` |
| 재현 | `#F5C400` |
| 회승 | `#FF9200` |
| 동성 | `#F553DA` |
| 단체 | `#8050DF` |

### Typography

- **Font**: `'Pretendard JP'` → `-apple-system, BlinkMacSystemFont, sans-serif` 순 fallback
- **CDN**: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard-jp/dist/web/static/pretendard-jp.css`

| 역할 | Size | Weight | Letter-spacing |
|---|---|---|---|
| 페이지 타이틀 | 22px | 700 | -0.03em |
| 섹션 타이틀 | 20px | 700 | -0.03em |
| 서브 타이틀 | 18px | 700 | — |
| Body 강조 | 15–16px | 700 | — |
| Body 기본 | 14px | 500–600 | — |
| Caption | 11–13px | 500–600 | — |
| 마이크로 | 8–10px | 500–700 | 0.04–0.08em |

### Spacing & Radius

| 용도 | 값 |
|---|---|
| 화면 좌우 패딩 | 16px |
| 카드 내부 패딩 | 14–16px |
| 섹션 간격 | 12–13px |
| 리스트 행 간격 | 10–11px |
| 카드 radius | 14–16px |
| 버튼 radius (소) | 9–10px |
| 버튼 radius (CTA) | 13–14px |
| 배지/pill radius | 100px (완전 원형) |
| 포카 썸네일 radius | 8px (리스트) / 6px (그리드) |

### Shadows

| 용도 | 값 |
|---|---|
| 기본 카드 | `0 2px 10px rgba(0,0,0,0.04)` |
| 강조 카드 | `0 4px 20px rgba(51,102,255,0.10)` |
| CTA 버튼 | `0 4px 20px rgba(51,102,255,0.28)` |
| 바텀시트 | `0 -12px 48px rgba(0,0,0,0.18)` |
| 모달 | `0 32px 80px rgba(0,0,0,0.30)` |

---

## Screens / Views

### 1. 모바일 앱 (375 × 812 — iOS 표준)

#### 1-1. 앨범 선택 (`NFAlbumSelect`)

**목적**: 앱 진입 시 관리할 앨범 선택

**레이아웃**:
- 상단 Status Bar (44px, 시스템 시간·상태 아이콘)
- Header (54px): 로고 이미지 좌측, "관리자" 버튼(pill) 우측
- 페이지 타이틀 영역 (padding 20px 16px 8px)
- 앨범 카드 리스트 (flex column, gap 12px, padding 8px 16px)

**앨범 카드 컴포넌트**:
- `background: #ffffff`, `border-radius: 16px`, `border: 1px solid #dbdcdf`
- `padding: 14px`, `box-shadow: 0 2px 10px rgba(0,0,0,0.04)`
- 선택된 앨범: `border-color: rgba(51,102,255,0.35)`, `box-shadow: 0 4px 20px rgba(51,102,255,0.10)`
- 좌측 썸네일 (64×64, radius 12px, 멤버 컬러 그라디언트 배경)
- 우측: 앨범명(16px/700) + Pill 배지, 연도·종수 설명(12px/T.tm), 버전 pill들

**Pill 배지**: `height: 22px`, `padding: 0 8px`, `border-radius: 5px`
- gray: `background: #f4f4f5`, `color: rgb(112,115,124)`
- blue: `background: rgb(234,242,254)`, `color: rgb(51,102,255)`

---

#### 1-2. 포카 목록 — 리스트 뷰 (`NFPocaList`)

**목적**: 선택 앨범의 전체 포카를 리스트로 탐색·상태 관리

**레이아웃 (위→아래)**:
1. Status Bar
2. AlbumBanner (96px): 그라디언트 배경 `linear-gradient(120deg, #1a1a2e 0%, #2d2d52 50%, #3366FF 140%)`  
   — 좌하단에 로고(26px) + 앨범명·설명
3. ListToolbar (46px): 검색바(flex 1) + 뷰 토글(리스트/그리드, 32×30px 버튼)
4. FilterRow (padding 10px 16px): 버전·멤버·구매처 필터 버튼 3개 (flex, gap 8px)
5. StatusLegend (34px): 소장/구해요/교환가능 색상 범례
6. 리스트 영역 (flex 1, scroll): 행마다 `border-bottom: 1px solid #dbdcdf`
7. BottomTab (64px)

**리스트 행**:
- `padding: 11px 16px`, `gap: 12px`, `align-items: center`
- 포카 썸네일 46px width
- 정보: 포카명(14px/600) + 뱃지 행(MemberBadge + 버전Pill + 구매처Pill)
- 우측: 상태 배지 (pill, height 28px) 또는 "상태 기록" 버튼 (outline pill)

**MemberBadge**: `height: 22px`, `border-radius: 100px`, 멤버 컬러 `1c` opacity 배경, 컬러 도트 7px + 멤버명 11px/600

**FilterBtn (필터 버튼)**: `height: 38px`, `border-radius: 9px`, `border: 1px solid #dbdcdf`
- 활성: `border: 1.5px solid primary`, `background: primary-bg`

---

#### 1-3. 포카 목록 — 그리드 뷰 (`NFPocaGrid`)

**목적**: 포카 썸네일 중심의 그리드 탐색

**레이아웃**: AlbumBanner → Toolbar → FilterRow → StatusLegend → 그리드

**그리드**: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 12px 10px`, `padding: 12px 14px`
- 각 셀: PocaCard + 멤버 컬러 도트 + 멤버명(10px)

---

#### 1-4. 상태 선택 바텀시트 (`NFStatusSheet`)

**목적**: 포카 카드 탭 → 소장 상태 설정

**구조**:
- 배경: 흐린 포카 그리드(opacity 0.16) + 오버레이 `rgba(15,15,18,0.55)`
- 바텀시트: `border-radius: 22px 22px 0 0`, `box-shadow: 0 -12px 48px rgba(0,0,0,0.20)`
  - 드래그 핸들: `width: 40px`, `height: 4px`, `border-radius: 100px`, `background: #f4f4f5`
  - 포카 프리뷰 (132px 너비, `drop-shadow(0 12px 28px rgba(0,0,0,0.18))`)
  - 상태 선택 버튼 3개 (height 52px, radius 13px)
    - 선택됨: `border: 2px solid {상태색}`, `background: {상태 배경색}`
    - 비선택: `border: 2px solid #dbdcdf`, `background: #ffffff`
    - 좌측: 컬러 체크박스(16×16, radius 5px) + 상태명(15px)
    - 우측: 테두리 색 설명 캡션(11px)
  - 하단 버튼 2개 (gap 10px):
    - "상태 해제": `flex: 1`, `height: 50px`, `border: 1.5px solid #dbdcdf`
    - "포토북에 담기": `flex: 1.6`, `height: 50px`, `background: primary`, CTA 스타일

---

#### 1-5. 필터 모달 (`NFFilterModal`)

**목적**: 버전/멤버/구매처 복수 선택 필터

**구조**:
- 배경: 흐린 그리드(opacity 0.16) + 오버레이 `rgba(15,15,18,0.48)`
- 바텀시트 (radius 22px 22px 0 0):
  - 헤더: "필터" 타이틀 + "초기화" 링크(primary 색)
  - 탭: 버전/멤버/구매처 (각 `flex: 1`, height 44px)
    - 활성 탭: `border-bottom: 2.5px solid primary`, `font-weight: 700`, `color: primary`
    - 선택된 개수 배지: `min-width: 16px`, `height: 16px`, `border-radius: 8px`, `background: primary`
  - 필터 칩 목록 (flexWrap, gap 8px, padding 16px 22px):
    - 비선택: `height: 38px`, `background: #f4f4f5`, `border-radius: 100px`
    - 선택됨: `background: primary`, `color: #ffffff`
    - 멤버 탭: 칩 안에 컬러 도트(8px) 포함
  - CTA "적용하기": `height: 54px`, `border-radius: 14px`, `background: primary`

---

#### 1-6. 포토북 편집 (`NFPhotobookEdit`)

**목적**: 포카를 포토북에 담고 순서 재배치

**레이아웃**:
- Header (back 버튼 + "N장" 배지)
- 안내 배너: `background: primary-bg`, 드래그 안내 + "상태 테두리 유지" 텍스트
- 리스트 (scroll, flex 1):
  - 행: 드래그 핸들(12×18 dot grid) + 포카 썸네일 42px + 포카명·멤버뱃지·상태 + 삭제 버튼(30×30 원형)
- 하단: "포토북 내보내기" CTA (height 52px, radius 14px)
- BottomTab (book 탭 활성, 배지 표시)

**드래그 핸들**: 3열 2행 도트 그리드 (dot size 3px, color `#dbdcdf`)

---

#### 1-7. 포토북 내보내기 (`NFPhotobookExport`)

**목적**: 4열 그리드 이미지 미리보기 및 PNG 저장/공유

**레이아웃**:
- Header (back)
- 내보내기 카드 (white, radius 16px, shadow):
  - 상단 바: 로고 + 앨범명 좌측, 날짜 우측
  - 4열 그리드: `grid-template-columns: repeat(4, 1fr)`, `gap: 8px`, `padding: 14px`
  - 포카: radius 6px, 멤버명 8px 캡션
- 파일명 텍스트 (11px, 중앙)
- 공유/저장 버튼 2개 (flex, gap 10px, height 52px, radius 12px)

---

#### 1-8. 대시보드 (`NFDashboard`)

**목적**: 앨범 발매 현황 + 사용자 소장 통계

**레이아웃**:
- Header: 로고 + 앨범 선택 드롭다운 버튼
- 스크롤 영역 (flex 1, padding 16px):
  - 그룹 헤더 ([일반] / [사용자 현황]): 컬러 세로바(4px) + 제목 + 설명
  - StatCard: `flex: 1`, `border-radius: 14px`, 숫자(26px/700) + 레이블
  - Section 카드: white, radius 16px, 내부 타이틀(15px/700)
  - BarRow: 레이블(78px 고정) + 게이지바(flex 1, height 10px, radius 100px) + 숫자
  - 소장 도넛: `conic-gradient` CSS, 100×100px, 내부 white 원(64px)
- BottomTab (dash 탭 활성)

**섹션 목록**: 전체 포카 현황 / 버전별 / 판매처별 / 소장률 전체 / 버전별 소장 / 판매처별 소장 / 멤버별 소장

---

### 2. 관리자 웹 (1280 × 860 — 데스크탑)

#### 2-1. 관리자 로그인 (`NFAdminLogin`)

**목적**: 6자리 PIN 번호 인증

**레이아웃**: 전체 배경 `linear-gradient(135deg, #f5f5f7 0%, #eaeefb 100%)`  
중앙 카드 (width 420px, radius 24px, padding 40px):
- 자물쇠 아이콘 컨테이너 (60×60, radius 18px, primary-bg)
- 로고 이미지 (height 30px)
- 타이틀 "관리자 인증" (19px/700)
- PIN 입력 칸 6개 (48×56, radius 12px, gap 10px):
  - 미입력: `border: 2px solid #dbdcdf`
  - 입력됨: `border: 2px solid primary`, `background: primary-bg`, 내부 채워진 원(12px)
  - 현재 포커스: `box-shadow: 0 0 0 4px rgba(51,102,255,0.12)`, 커서 표시
- CTA "인증하기" (height 52px, radius 14px)
- 세션 안내 캡션 (11px)

---

#### 2-2. 앨범 관리 (`NFAdminAlbums`)

**목적**: 앨범 CRUD + 버전/구매처/이미지 편집

**레이아웃**: 상단 AdminBar + 좌우 2열

**AdminBar** (60px):
- 좌: 로고 + "ADMIN" 배지(primary-bg, primary 텍스트, radius 6px)
- 중앙: 탭 "앨범 관리" / "포카 관리" (height 36px, radius 9px)
  - 활성: `background: primary-bg`, `color: primary`, `font-weight: 700`
- 우: 사용자명 + 로그아웃 버튼

**좌측 패널** (width 340px, `border-right: 1px solid #dbdcdf`):
- 헤더: "앨범 목록" + 파란 "+ 추가" 버튼(pill)
- 앨범 행 (padding 12px, radius 12px):
  - 활성: `background: primary-bg`, `border: 1px solid rgba(51,102,255,0.3)`
  - 드래그 핸들 + 썸네일(44×44) + 앨범명/종수

**우측 편집 폼** (flex 1, padding 24px 32px):
- 상단: 섹션 타이틀 + 삭제/저장 버튼
- 2열 그리드 (gap 20px 28px):
  - 앨범명, 정렬 순서 입력 필드 (height 42px, radius 10px)
  - 버전 목록: pill + "×" 버튼 + "버전 추가" 점선 pill
  - 구매처 목록: 동일 패턴
  - 헤더/배경 이미지 업로드 영역 (height 130px, radius 12px, 점선 테두리)

**입력 필드 스타일**: `height: 42px`, `border-radius: 10px`, `border: 1px solid #dbdcdf`, `padding: 0 14px`, `font-size: 14px`

---

#### 2-3. 포카 관리 (`NFAdminPocas`)

**목적**: 포카 CRUD 테이블 + 정렬

**레이아웃**: AdminBar + 테이블 영역 (padding 24px 32px)

**툴바** (margin-bottom 18px):
- 좌: 페이지 타이틀 + 앨범 선택 드롭다운 + 총 종수
- 우: 검색 인풋(width 220px) + "+ 포카 추가" 버튼(primary)

**테이블** (radius 16px, border, overflow hidden):
- 헤더 행 (height 46px, `background: #f5f5f7`): 각 컬럼 12px/700/T.tm
- 데이터 행 (height 66px, padding 0 20px):
  - 컬럼: 드래그핸들 / 썸네일(36px) / 포카명(14px/600) / 멤버뱃지 / 버전Pill / 구매처 / 수정·삭제 버튼
- 그리드: `grid-template-columns: 50px 70px 1.4fr 1fr 1fr 1fr 90px`
- 수정/삭제 버튼: `width: 32px`, `height: 32px`, `border-radius: 8px`, `background: #f4f4f5`

---

#### 2-4. 포카 추가/편집 모달 (`NFAdminPocaEdit`)

**목적**: 포카 신규 추가 또는 편집

**구조**:
- 배경: 테이블(opacity 0.35) + 오버레이 `rgba(15,15,18,0.5)`
- 모달 (width 640px, radius 22px, `box-shadow: 0 32px 80px rgba(0,0,0,0.30)`):
  - 모달 헤더 (padding 22px 28px): 타이틀 + 닫기 버튼(34×34, radius 9px)
  - 바디 (padding 28px, flex row, gap 24px):
    - 좌: 썸네일 업로드 (150px, `aspect-ratio: 2/3`, 점선 테두리, radius 12px)
    - 우 폼 영역 (flex 1):
      - 포카명 인풋
      - 멤버 선택 (pill 칩들, `height: 34px`, 선택됨: 멤버 컬러 배경/흰 텍스트)
      - 버전·구매처 select (height 42px, 시브런 아이콘)
  - 모달 푸터 (padding 0 28px 26px, flex-end):
    - "취소" (height 44px, radius 11px, outline)
    - "저장" (height 44px, radius 11px, primary)

---

## Interactions & Behavior

### 모바일 네비게이션
- **앨범 선택 → 포카 목록**: 앨범 카드 탭 → 리스트 화면으로 push
- **BottomTab**: 목록 / 대시보드 / 포토북 탭 전환 (탭바 고정)
- **포카 탭 → 상태 바텀시트**: 리스트/그리드 어디서든 카드 탭 → 바텀시트 slide-up
- **필터 버튼 → 필터 모달**: 버전/멤버/구매처 버튼 탭 → 바텀시트 slide-up

### 바텀시트 / 모달
- **배경 dimming**: `rgba(15,15,18, 0.48–0.55)` 오버레이
- **열기 애니메이션**: `translateY(100%) → translateY(0)`, duration 320ms, `cubic-bezier(0.32,0.72,0,1)`
- **닫기**: 드래그 핸들 스와이프 다운 또는 외부 탭

### 상태 변경
- 상태 배지 선택 즉시 카드 테두리 색 업데이트
- 상태 해제 → 테두리 기본(1px solid `#dbdcdf`)으로 복귀

### 포토북
- 드래그 앤 드롭으로 순서 변경 (react-native: `react-native-draggable-flatlist` 추천)
- "포토북 내보내기" → PNG 생성 (4열 고정 그리드, `react-native-view-shot` 또는 `html2canvas` 추천)

### 관리자 PIN 입력
- 숫자 키패드로 순차 입력 → 6자리 완성 시 자동 인증 시도
- 실패 시 칸 흔들림 애니메이션 (`shake`, 400ms) + 입력 초기화

### 드래그 정렬 (관리자)
- 포카 테이블 및 앨범 목록 행: drag handle 클릭 + 드래그로 순서 변경
- `@dnd-kit/sortable` (웹) 또는 `react-native-draggable-flatlist` (앱) 권장

---

## State Management

### 모바일 앱

```
AppState:
  selectedAlbum: Album | null
  pocaList: PocaCard[]         // 현재 앨범 포카
  filters: { version, member, source }  // 복수 선택 가능
  viewMode: 'list' | 'grid'
  photobookCards: PocaCard[]   // 포토북에 담긴 카드들
  statusSheet: { open: boolean, card: PocaCard | null }
  filterModal: { open: boolean, tab: 0|1|2 }
```

### 관리자 웹
```
AdminState:
  isAuthenticated: boolean
  selectedAlbum: Album | null
  albums: Album[]
  pocas: PocaCard[]
  editingPoca: PocaCard | null   // null이면 추가 모드
  editingAlbum: Album | null
```

### 데이터 모델

```typescript
interface Album {
  id: string
  name: string
  sub: string          // 예: "정규 2집"
  year: string
  versions: string[]   // 예: ["Ever ver.", "Lasting ver."]
  sources: string[]    // 구매처
  count: number        // 총 포카 종수
  headerImage?: string
  bgImage?: string
  sortOrder: number
}

interface PocaCard {
  id: string
  albumId: string
  name: string         // 예: "승협 포토카드"
  member: string       // 예: "승협"
  version: string
  source: string
  imageUrl: string | null
  status: '소장' | '구해요' | '교환 가능' | null
  sortOrder: number
}
```

---

## Design Tokens Quick Reference (Copy-Paste)

```javascript
const T = {
  bg: '#f5f5f7',
  surface: '#ffffff',
  border: '#dbdcdf',
  borderLight: '#f4f4f5',
  text: 'rgb(23,23,25)',
  textMid: 'rgb(112,115,124)',
  textLight: 'rgb(152,155,162)',
  primary: 'rgb(51,102,255)',
  primaryBg: 'rgb(234,242,254)',
};

const STATUS_COLORS = {
  '소장':     { text: 'rgb(51,102,255)',  bg: 'rgb(234,242,254)' },
  '구해요':   { text: 'rgb(255,66,66)',   bg: 'rgb(254,236,236)' },
  '교환 가능': { text: 'rgb(245,168,0)',  bg: 'rgb(255,247,229)' },
};

const MEMBER_COLORS = {
  '승협': '#3366FF', '훈': '#00BF40', '재현': '#F5C400',
  '회승': '#FF9200', '동성': '#F553DA', '단체': '#8050DF',
};
```

---

## Assets

| 파일 | 용도 |
|---|---|
| `design_files/assets/nflying-logo.png` | N.Flying 공식 로고 |
| `design_files/assets/poca-seunghyub.jpeg` | 승협 포카 샘플 이미지 |
| `design_files/assets/poca-hoon.jpeg` | 훈 포카 샘플 이미지 |
| `design_files/assets/poca-jaehyun.jpeg` | 재현 포카 샘플 이미지 |
| `design_files/assets/poca-hweseung.jpeg` | 회승 포카 샘플 이미지 |
| `design_files/assets/poca-dongsung.jpeg` | 동성 포카 샘플 이미지 |

> 실제 프로덕션에서는 Supabase Storage 또는 CDN URL로 대체하세요.

---

## Files

| 파일 | 설명 |
|---|---|
| `design_files/NF ALBUM POCA.html` | 전체 디자인 캔버스 (브라우저에서 열기) |
| `design_files/core.jsx` | 디자인 토큰, 공유 컴포넌트 (PocaCard, BottomTab, Pill 등) |
| `design_files/screens-mobile.jsx` | 모바일 스크린 (앨범선택, 포카목록, 필터, 바텀시트) |
| `design_files/screens-photobook-dash.jsx` | 포토북 편집/내보내기, 대시보드 |
| `design_files/screens-admin.jsx` | 관리자 로그인, 앨범/포카 관리 |

---

## Tech Stack Recommendation

### 모바일 앱
- **React Native + Expo** (TypeScript)
- 상태관리: Zustand 또는 Redux Toolkit
- 네비게이션: React Navigation (Stack + Tab)
- 리스트: FlashList
- 드래그정렬: `react-native-draggable-flatlist`
- 이미지 캡처(포토북 내보내기): `react-native-view-shot`
- 백엔드: Supabase (DB + Storage + Auth)

### 관리자 웹
- **Next.js + TypeScript**
- 스타일: Tailwind CSS (토큰은 위 색상 참조)
- 드래그정렬: `@dnd-kit/sortable`
- 테이블: TanStack Table
- 백엔드: Supabase (모바일과 동일 프로젝트)
