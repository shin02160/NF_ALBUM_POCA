import { create } from 'zustand';
import type { Album, PocaCard, ViewMode, PocaStatusMap, Filters } from '../types';
import type { StatusKey } from '../theme/tokens';
import { SAMPLE_ALBUMS, SAMPLE_CARDS } from '../data/sampleData';
import {
  isSupabaseConfigured, fetchAlbums, fetchCards,
  signInAdmin, signOutAdmin, hasAdminSession,
  upsertAlbumDb, deleteAlbumDb, upsertCardDb, deleteCardDb, reorderCardsDb,
} from '../lib/supabase';

// ── LocalStorage helpers (PRD 3-3) ─────────────────────────────────────
const LS_STATUS = 'poca_status';
const LS_PHOTOBOOK = 'poca_photobook';
const LS_ALBUM = 'poca_album';

function loadStatus(): PocaStatusMap {
  try { return JSON.parse(localStorage.getItem(LS_STATUS) || '{}'); }
  catch { return {}; }
}
function saveStatus(m: PocaStatusMap) {
  localStorage.setItem(LS_STATUS, JSON.stringify(m));
}
function loadPhotobook(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_PHOTOBOOK) || '[]'); }
  catch { return []; }
}
function savePhotobook(ids: string[]) {
  localStorage.setItem(LS_PHOTOBOOK, JSON.stringify(ids));
}
function loadAlbumId(): string | null {
  try { return localStorage.getItem(LS_ALBUM); }
  catch { return null; }
}
function saveAlbumId(id: string | null) {
  try { id ? localStorage.setItem(LS_ALBUM, id) : localStorage.removeItem(LS_ALBUM); }
  catch {}
}

// 첫 실행 데모용 시드 (localStorage 비어있을 때만)
const DEMO_STATUS: PocaStatusMap = {
  'ev-0-0': '소장', 'ev-0-1': '소장', 'ev-0-2': '구해요',
  'ev-0-3': '교환 가능', 'ev-0-5': '소장',
  'ev-1-0': '소장', 'ev-1-2': '소장', 'ev-1-4': '구해요',
};

const emptyFilters = (): Filters => ({ version: [], member: [], source: [] });

interface State {
  // 데이터
  albums: Album[];
  cards: PocaCard[]; // 전체 카드
  loading: boolean;
  usingSupabase: boolean;

  // 모바일 앱 상태
  selectedAlbumId: string | null;
  filters: Filters;
  viewMode: ViewMode;
  search: string;
  statusMap: PocaStatusMap;
  photobook: string[];
  statusSheet: { open: boolean; cardId: string | null };
  filterModal: { open: boolean; tab: 0 | 1 | 2 };

  // 관리자
  isAuthenticated: boolean;

  // ── actions ──
  loadData: () => Promise<void>;
  selectAlbum: (id: string | null) => Promise<void>;
  setFilters: (f: Filters) => void;
  resetFilters: () => void;
  setView: (v: ViewMode) => void;
  setSearch: (s: string) => void;
  openStatusSheet: (cardId: string) => void;
  closeStatusSheet: () => void;
  openFilterModal: (tab?: 0 | 1 | 2) => void;
  closeFilterModal: () => void;
  setStatus: (cardId: string, status: StatusKey | null) => void;
  toggleStatus: (cardId: string, status: StatusKey) => void;
  addToPhotobook: (cardId: string) => void;
  removeFromPhotobook: (cardId: string) => void;
  reorderPhotobook: (ids: string[]) => void;

  // 관리자 (Supabase Auth)
  authenticate: (email: string, password: string) => Promise<boolean>;
  hydrateAuth: () => Promise<void>;
  logout: () => void;
  saveAlbum: (a: Album) => void;
  deleteAlbum: (id: string) => void;
  saveCard: (c: PocaCard) => void;
  deleteCard: (id: string) => void;
  reorderCards: (albumId: string, orderedIds: string[]) => void;
}

export const useStore = create<State>((set, get) => ({
  albums: [],
  cards: [],
  loading: true,
  usingSupabase: isSupabaseConfigured,
  selectedAlbumId: null,
  filters: emptyFilters(),
  viewMode: 'list',
  search: '',
  statusMap: {},
  photobook: [],
  statusSheet: { open: false, cardId: null },
  filterModal: { open: false, tab: 0 },
  isAuthenticated: false,

  async loadData() {
    set({ loading: true });
    let statusMap = loadStatus();
    if (Object.keys(statusMap).length === 0 && !localStorage.getItem(LS_STATUS)) {
      statusMap = { ...DEMO_STATUS };
      saveStatus(statusMap);
    }
    const photobook = loadPhotobook();
    const savedAlbumId = loadAlbumId();

    if (isSupabaseConfigured) {
      try {
        const albums = await fetchAlbums();
        const selectedAlbumId = albums.some((a) => a.id === savedAlbumId) ? savedAlbumId : null;
        set({ albums, cards: [], statusMap, photobook, selectedAlbumId, loading: false });
        return;
      } catch (e) {
        console.warn('Supabase fetch 실패 → 샘플 데이터 폴백', e);
      }
    }
    const albums = SAMPLE_ALBUMS;
    const selectedAlbumId = albums.some((a) => a.id === savedAlbumId) ? savedAlbumId : null;
    set({
      albums,
      cards: SAMPLE_CARDS,
      statusMap,
      photobook,
      selectedAlbumId,
      loading: false,
      usingSupabase: false,
    });
  },

  async selectAlbum(id) {
    saveAlbumId(id);
    set({ selectedAlbumId: id, filters: emptyFilters(), search: '' });
    if (id && get().usingSupabase) {
      const existing = get().cards.some((c) => c.albumId === id);
      if (!existing) {
        try {
          const cards = await fetchCards(id);
          set((s) => ({ cards: [...s.cards, ...cards] }));
        } catch (e) {
          console.warn('카드 로드 실패', e);
        }
      }
    }
  },

  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: emptyFilters() }),
  setView: (viewMode) => set({ viewMode }),
  setSearch: (search) => set({ search }),

  openStatusSheet: (cardId) => set({ statusSheet: { open: true, cardId } }),
  closeStatusSheet: () => set({ statusSheet: { open: false, cardId: null } }),
  openFilterModal: (tab = 0) => set({ filterModal: { open: true, tab } }),
  closeFilterModal: () => set((s) => ({ filterModal: { ...s.filterModal, open: false } })),

  setStatus: (cardId, status) =>
    set((s) => {
      const statusMap = { ...s.statusMap, [cardId]: status };
      if (status === null) delete statusMap[cardId];
      saveStatus(statusMap);
      return { statusMap };
    }),

  toggleStatus: (cardId, status) =>
    set((s) => {
      const current = s.statusMap[cardId] ?? null;
      const next = current === status ? null : status;
      const statusMap = { ...s.statusMap };
      if (next === null) delete statusMap[cardId];
      else statusMap[cardId] = next;
      saveStatus(statusMap);
      return { statusMap };
    }),

  addToPhotobook: (cardId) =>
    set((s) => {
      if (s.photobook.includes(cardId)) return {};
      const photobook = [...s.photobook, cardId];
      savePhotobook(photobook);
      return { photobook };
    }),
  removeFromPhotobook: (cardId) =>
    set((s) => {
      const photobook = s.photobook.filter((id) => id !== cardId);
      savePhotobook(photobook);
      return { photobook };
    }),
  reorderPhotobook: (ids) => {
    savePhotobook(ids);
    set({ photobook: ids });
  },

  // ── 관리자 (Supabase Auth) ── 세션 JWT로 쓰기 → RLS is_admin() 허용
  authenticate: async (email, password) => {
    const ok = await signInAdmin(email, password);
    if (ok) set({ isAuthenticated: true });
    return ok;
  },
  hydrateAuth: async () => {
    if (await hasAdminSession()) set({ isAuthenticated: true });
  },
  logout: () => { void signOutAdmin(); set({ isAuthenticated: false }); },

  saveAlbum: (a) => {
    set((s) => {
      const exists = s.albums.some((x) => x.id === a.id);
      const albums = exists
        ? s.albums.map((x) => (x.id === a.id ? a : x))
        : [...s.albums, a];
      albums.sort((x, y) => x.sortOrder - y.sortOrder);
      return { albums };
    });
    if (get().usingSupabase) upsertAlbumDb(a).catch((e) => console.error('앨범 저장 실패', e));
  },
  deleteAlbum: (id) => {
    set((s) => ({
      albums: s.albums.filter((x) => x.id !== id),
      cards: s.cards.filter((c) => c.albumId !== id),
      selectedAlbumId: s.selectedAlbumId === id ? null : s.selectedAlbumId,
    }));
    if (get().usingSupabase) deleteAlbumDb(id).catch((e) => console.error('앨범 삭제 실패', e));
  },

  saveCard: (c) => {
    set((s) => {
      const exists = s.cards.some((x) => x.id === c.id);
      const cards = exists
        ? s.cards.map((x) => (x.id === c.id ? c : x))
        : [...s.cards, c];
      const albums = s.albums.map((al) =>
        al.id === c.albumId
          ? { ...al, count: cards.filter((cc) => cc.albumId === al.id).length }
          : al,
      );
      return { cards, albums };
    });
    if (get().usingSupabase) upsertCardDb(c).catch((e) => console.error('포카 저장 실패', e));
  },
  deleteCard: (id) => {
    set((s) => {
      const removed = s.cards.find((c) => c.id === id);
      const cards = s.cards.filter((c) => c.id !== id);
      const albums = removed
        ? s.albums.map((al) =>
            al.id === removed.albumId
              ? { ...al, count: cards.filter((cc) => cc.albumId === al.id).length }
              : al,
          )
        : s.albums;
      return { cards, albums };
    });
    if (get().usingSupabase) deleteCardDb(id).catch((e) => console.error('포카 삭제 실패', e));
  },
  reorderCards: (albumId, orderedIds) => {
    set((s) => {
      const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
      const cards = s.cards.map((c) =>
        c.albumId === albumId && orderMap.has(c.id)
          ? { ...c, sortOrder: orderMap.get(c.id)! }
          : c,
      );
      return { cards };
    });
    if (get().usingSupabase) reorderCardsDb(orderedIds).catch((e) => console.error('정렬 저장 실패', e));
  },
}));
