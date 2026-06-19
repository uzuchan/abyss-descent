// 数値ユーティリティ（純関数）

export const clamp = (v: number, min = 0, max = 1) =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 区間 [edge0, edge1] を 0..1 に滑らかに写像（Hermite） */
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/** progress(0..1) に対する区間内の正規化位置 0..1 を返す */
export const rangeProgress = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start));

/** フレームレート非依存の指数補間（damp）。lambda が大きいほど速い */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));
