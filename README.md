# 深淵探窟 — Abyss

縦スクロールで巨大な未知の縦穴を降下する没入型 Web サイトの**最小実装**。
童話的で不穏な深淵を、地上の探窟都市から名称不明領域まで、簡易 3D とプレースホルダで一通り体験できる。

> 設計（要件定義 / ページ構成 / コンポーネント設計 / ディレクトリ構成）は **[DESIGN.md](./DESIGN.md)** を参照。

## Demo
![深淵探窟 — スクロール降下デモ](demo_mp4/abyss-demo.gif)

## 技術スタック
Next.js (App Router) ・ TypeScript ・ React Three Fiber / Three.js ・ GSAP ・ Lenis ・ zustand

## セットアップ
```bash
npm install
npm run dev      # http://localhost:3000
```
本番ビルド: `npm run build && npm run start` ／ 型チェック: `npm run typecheck`

## 操作
- **縦スクロール**：深淵を降下。スクロール量がそのまま深度になる。
- **発光体をクリック**：生物・植物・遺物の標本カード（図鑑）が開く。`Esc` か背景クリックで閉じる。
- **環境音 ON/OFF**（左下）：深度でピッチ・フィルタが変化する合成ドローン。既定 OFF。

## 実装の要点
- **スクロール同期**：`Lenis`（＋GSAP ticker）で進捗 0..1 を算出 → `zustand` ストアへ。3D は描画ループで `getState()` 直読みし、React 再描画を起こさない（`src/lib/useScrollProgress.ts`, `src/lib/store.ts`）。
- **深度演出**：`FogRig` が背景・フォグ・ライトを層間で連続補間。`Spores` の色、`GrainOverlay` の濃度も深度連動。
- **図鑑データ**：`src/lib/catalog.ts`（名称・分類・観察記・配置）。3D の `Specimen` と モーダル `CodexModal` が共有。
- **層定義**：`src/lib/layers.ts`（深度域・色・フォグ・名称・ワールド座標の写像）。
- **prefers-reduced-motion**：滑らかスクロール・カメラ揺れ・粒子ドリフト・動くグレイン・GSAP 演出を停止。
- **スマホ軽量化**：`useDeviceTier` が DPR・粒子数・巨大シルエット数を抑制。Canvas は `touch-action: pan-y` でスクロール透過。

## 調整ポイント
- 層の色・深度域・霧の濃さ → `src/lib/layers.ts`
- 図鑑の標本（追加・配置・文章） → `src/lib/catalog.ts`
- 降下速度・揺れ → `src/three/CameraRig.tsx`
- 光量・フォグ感 → `src/three/FogRig.tsx`（`ambientLight` / `pointLight` の値）

## 次の拡張余地（最小実装の外）
本物の植物・生物アセット、`@react-three/postprocessing` による深層の歪み（色収差・グリッチ）、音響の作り込み、図鑑のキーボード完全フォーカストラップ、各層の固有 BGM、被写界深度など。