// 各深度層のスクリーンショットを自動撮影する開発用ツール。
// 使い方: アプリを起動して `BASE=http://localhost:3211 node tools/capture.mjs`
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:3211';
const OUT = path.resolve('tools/screenshots');
mkdirSync(OUT, { recursive: true });

// 撮影ポイント [progress(0..1), ラベル]
const SHOTS = [
  [0.0, '00-intro'],
  [0.05, '01-surface'],
  [0.2, '02-forest'],
  [0.41, '03-creatures'],
  [0.62, '04-ruins'],
  [0.81, '05-deep'],
  [0.95, '06-unknown'],
];

const browser = await chromium.launch({
  args: [
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
  ],
});
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce', // ネイティブスクロール経路 → 進捗を決定論的に制御
});
const page = await ctx.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') console.log('PAGE ERROR:', m.text());
});
page.on('pageerror', (e) => console.log('PAGE EXCEPTION:', e.message));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('canvas', { timeout: 20000 });

// WebGL 診断
const webgl = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  if (!c) return 'no canvas element';
  const g = c.getContext('webgl2') || c.getContext('webgl');
  if (!g) return 'NO WEBGL CONTEXT';
  const dbg = g.getExtension('WEBGL_debug_renderer_info');
  const renderer = dbg ? g.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER);
  return `${g.getParameter(g.VERSION)} | ${renderer}`;
});
console.log('WEBGL:', webgl);

await page.waitForTimeout(1500); // 初期描画の安定待ち

for (const [p, label] of SHOTS) {
  await page.evaluate((pr) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, pr * max);
    window.dispatchEvent(new Event('scroll'));
  }, p);
  await page.waitForTimeout(1400); // カメラ damp 収束待ち
  await page.screenshot({ path: `${OUT}/${label}.png` });
  console.log('shot', label);
}

await browser.close();
console.log('done →', OUT);
