import { clamp, lerp } from './math';

// ── 深度・ワールド座標の写像 ──────────────────────────────
export const MAX_DEPTH = 9999; // m
export const SCROLL_VH = 700; // スクロールトラックの高さ（vh）

// 縦穴のワールド Y 範囲。progress 0→1 でカメラが TOP_Y→BOTTOM_Y を降下する。
export const TOP_Y = 8;
export const BOTTOM_Y = -148;

/** progress(0..1) → ワールド Y */
export const yForProgress = (p: number) => lerp(TOP_Y, BOTTOM_Y, clamp(p));

// ── 層定義 ────────────────────────────────────────────────
export interface Layer {
  id: string;
  name: string; // 表示名（日本語）
  index: number;
  start: number; // progress 開始
  end: number; // progress 終了
  background: string; // 背景色（シーンの clear color）
  fog: string; // フォグ色
  fogDensity: number; // 指数フォグ密度
  ambient: string; // 環境光色
  ambientIntensity: number;
  accent: string; // アクセント点光源 / 発光色
  spore: string; // 粒子色
}

export const LAYERS: Layer[] = [
  {
    id: 'surface',
    name: '地上の探窟都市',
    index: 0,
    start: 0.0,
    end: 0.1,
    background: '#dfe6ea',
    fog: '#e7edf0',
    fogDensity: 0.02,
    ambient: '#f3f6f8',
    ambientIntensity: 0.9,
    accent: '#bcd2dc',
    spore: '#ffffff',
  },
  {
    id: 'forest',
    name: '光の森林層',
    index: 1,
    start: 0.1,
    end: 0.3,
    background: '#9fc6b4',
    fog: '#8fb9a6',
    fogDensity: 0.03,
    ambient: '#cfeede',
    ambientIntensity: 0.7,
    accent: '#a8f0c8',
    spore: '#d6ffe8',
  },
  {
    id: 'creatures',
    name: '奇妙な生物の層',
    index: 2,
    start: 0.3,
    end: 0.52,
    background: '#6b6790',
    fog: '#5c5982',
    fogDensity: 0.04,
    ambient: '#8d86b8',
    ambientIntensity: 0.55,
    accent: '#c9b8ff',
    spore: '#d8c9ff',
  },
  {
    id: 'ruins',
    name: '古代遺跡層',
    index: 3,
    start: 0.52,
    end: 0.72,
    background: '#4a4636',
    fog: '#403c2f',
    fogDensity: 0.05,
    ambient: '#6b6450',
    ambientIntensity: 0.45,
    accent: '#ffd49a',
    spore: '#ffe7c2',
  },
  {
    id: 'deep',
    name: '深層',
    index: 4,
    start: 0.72,
    end: 0.9,
    background: '#1b2233',
    fog: '#141a28',
    fogDensity: 0.07,
    ambient: '#33405c',
    ambientIntensity: 0.35,
    accent: '#6fd6ff',
    spore: '#9fe6ff',
  },
  {
    id: 'unknown',
    name: '名称不明領域',
    index: 5,
    start: 0.9,
    end: 1.0,
    background: '#08080c',
    fog: '#050507',
    fogDensity: 0.1,
    ambient: '#141019',
    ambientIntensity: 0.25,
    accent: '#ff5fa2',
    spore: '#ff9ccb',
  },
];

/** progress に対応する層 index */
export const layerIndexForProgress = (p: number): number => {
  const c = clamp(p);
  for (const l of LAYERS) {
    if (c < l.end) return l.index;
  }
  return LAYERS.length - 1;
};

/** progress に対応する層 */
export const layerForProgress = (p: number): Layer =>
  LAYERS[layerIndexForProgress(p)];
