import { create } from 'zustand';
import { clamp } from './math';
import { MAX_DEPTH, layerIndexForProgress } from './layers';
import type { CatalogEntry } from './catalog';

interface AbyssState {
  // 高頻度（描画ループは getState() で直読みし、購読しないこと）
  progress: number;
  // UI 向け（変化時のみ更新 → セレクタ購読側のみ再描画）
  depth: number;
  layerIndex: number;
  // インタラクション / 設定
  activeEntry: CatalogEntry | null;
  reducedMotion: boolean;
  soundOn: boolean;

  setScroll: (p: number) => void;
  open: (e: CatalogEntry) => void;
  close: () => void;
  setReducedMotion: (v: boolean) => void;
  toggleSound: () => void;
}

export const useAbyss = create<AbyssState>((set, get) => ({
  progress: 0,
  depth: 0,
  layerIndex: 0,
  activeEntry: null,
  reducedMotion: false,
  soundOn: false,

  setScroll: (p) => {
    const progress = clamp(p);
    const depth = Math.round(progress * MAX_DEPTH);
    const layerIndex = layerIndexForProgress(progress);
    const prev = get();
    if (depth !== prev.depth || layerIndex !== prev.layerIndex) {
      // 整数深度 or 層が変わったときだけ UI 向けフィールドも更新
      set({ progress, depth, layerIndex });
    } else {
      // progress のみ更新（描画ループが読む。purpose-built セレクタは再評価されるが値不変なら再描画されない）
      set({ progress });
    }
  },

  open: (e) => set({ activeEntry: e }),
  close: () => set({ activeEntry: null }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
}));
