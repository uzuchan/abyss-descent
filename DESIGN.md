# 深淵探窟 — 設計ドキュメント

> コンセプト：**「可憐さと異質さが共存する，童話的で不穏な深淵世界」**
> 無垢で可憐，しかし妖しい。子どもの純粋さ・儚さ・神秘性・不穏さが同時にあること。
> 官能ではなく，絵本のような優しさと，説明できない異質さが常に同居する空気を保つ。

---

## 1. 要件定義

### 1.1 体験の核
- ユーザーは**縦スクロール**で巨大な未知の縦穴を**降下**する。
- スクロール量とカメラの降下・演出が**完全同期**する（スクロールが「深さ」になる）。
- 上から下へ，地続きに世界が変質していく。戻る（上スクロール）と浅層へ戻れる。

### 1.2 深度レイヤー（上→下）
| # | 層 | 深度の目安 | 雰囲気 |
|---|---|---|---|
| 0 | 地上の探窟都市 | 0m | 淡い夜明け。静謐で清潔，余白が広い |
| 1 | 光の森林層 | 〜2,000m | 発光する植物・胞子。優しいが妖しい |
| 2 | 奇妙な生物の層 | 〜4,500m | 紫煙。遠景に巨大な影。可憐だが異質 |
| 3 | 古代遺跡層 | 〜6,500m | 琥珀色の残光。沈黙した構造物 |
| 4 | 深層 | 〜8,500m | 藍黒。光がまばら。圧と静寂 |
| 5 | 名称不明領域 | 〜9,999m | ほぼ無。軽いノイズと歪み。意味の欠落 |

### 1.3 機能要件
- **深度表示UI**：現在深度（m）・層名・降下ゲージ。探窟手帳風。
- **深度連動の演出変化**：背景色 / フォグ濃度・色 / 粒子の量と挙動 / 環境音 / ノイズ・歪みが深さで連続変化。
- **発光植物・胞子**：浅〜中層に漂う粒子と発光体。
- **遠景の巨大生物の影**：中〜深層に，遠くをゆっくり横切る巨大シルエット（非干渉・畏怖の演出）。
- **図鑑（クリックインタラクション）**：生物・遺物をクリックすると，探窟手帳に標本カード（名称・分類・観察記）が開く。
- **探窟手帳風UI**：細い罫・隅のトンボ・層インデックス。高級感のある余白。

### 1.4 非機能要件
- **prefers-reduced-motion 対応**：滑らかスクロール / カメラ揺れ / 粒子ドリフト / 動くノイズを停止し，静的に等価な体験を提供。
- **スマホ軽量化**：DPR クランプ，粒子数の削減，巨大シルエットの簡略化，重い演出の抑制。
- **アクセシビリティ**：図鑑はキーボード操作・フォーカストラップ・Esc で閉じる。音はデフォルト OFF（ユーザー操作で開始）。
- **SSR 安全**：Three.js / WebGL はクライアント専用（`ssr: false`）で描画。
- **パフォーマンス**：スクロール値は描画ループ内で `getState()` 直読みし，React 再描画を起こさない。

### 1.5 トーン指針（実装の判断基準）
- 色は**彩度を抑えた淡色**から始め，深いほど**暗く・冷たく・少し濁る**。
- 動きは**ゆっくり・不規則**（規則的すぎると安心に倒れる）。
- 可憐な要素（発光花・胞子）と異質な要素（巨大影・歪み）を**常に同居**させる。

---

## 2. ページ構成

単一ページ（縦長スクロール）。スクロール長 = 深度。固定背景に 3D，前面に手帳 UI を重ねる。

```
┌─ <body> (height = 約 700vh のスクロールトラック) ───────────┐
│  position:fixed 背景レイヤー                                  │
│   └ <AbyssCanvas/>  … R3F Canvas（縦穴・粒子・生物・遺物）     │
│  position:fixed 前面 UI レイヤー（pointer-events 部分透過）   │
│   ├ <Intro/>        … 地上のタイトル（降下で退場）            │
│   ├ <Fieldbook/>    … 手帳の枠・層インデックス・トンボ        │
│   ├ <DepthHUD/>     … 現在深度・層名・降下ゲージ              │
│   ├ <GrainOverlay/> … 深度連動のノイズ・周辺減光             │
│   ├ <SoundToggle/>  … 環境音の ON/OFF                         │
│   └ <CodexModal/>   … 図鑑（標本クリックで開く）              │
│  <ScrollTrack/>     … 透明な縦長要素。スクロール量を生む      │
└──────────────────────────────────────────────────────────────┘
```

スクロール進捗 `progress (0..1)` を Lenis から取得 →
- カメラ Y を補間して降下
- フォグ色・濃度，環境光，粒子色を層に応じて補間
- HUD の深度・層名，グレイン強度を更新

---

## 3. コンポーネント設計

### 3.1 状態（`src/lib/store.ts`, zustand）
| フィールド | 用途 |
|---|---|
| `progress` | スクロール進捗 0..1（高頻度更新。描画ループは `getState()` で直読み） |
| `depth` | 深度（m，整数に丸め）。HUD 用 |
| `layerIndex` | 現在の層 index。HUD / 演出用 |
| `activeEntry` | 開いている図鑑標本（null で閉） |
| `reducedMotion` | 低モーション設定 |
| `soundOn` | 環境音状態 |

セレクタ購読により，`progress` のみ変化した場合は HUD は再描画しない。

### 3.2 3D（`src/three/`）
- `AbyssExperience`：`'use client'`。Lenis＋GSAP ticker でスクロール駆動，UI とキャンバスを束ねる。
- `AbyssCanvas`：`next/dynamic({ ssr:false })` で読み込む R3F `<Canvas>`。DPR クランプ。
- `Scene`：フォグ / ライト / 各要素を配置。`FogRig` が深度でフォグ・背景色を補間。
- `CameraRig`：`useFrame` で `progress` を読み，カメラ Y を補間降下。微小な揺れ（低モーションで停止）。
- `Shaft`：縦穴の壁（内向きシリンダ）。微かな縦縞で奥行き。
- `Spores`：発光粒子フィールド（`Points`＋加算合成）。上方へ漂う。数はデバイスで可変。
- `Specimen`：図鑑に対応する**クリック可能**な発光体（植物 / 生物 / 遺物 / 不明）。hover で発光・拡大，click で `open(entry)`。
- `GiantSilhouette`：遠景の巨大生物の影。低不透明・低速横断・非干渉。
- `Decor`：図鑑に無い装飾発光体（密度演出）。

### 3.3 UI（`src/components/`）
- `ScrollTrack`：スクロール量を生む透明縦長要素。
- `Intro`：地上タイトル。`progress` 上昇でフェード退場。
- `Fieldbook`：手帳の枠・隅トンボ・層インデックス（現在層を強調）。
- `DepthHUD`：深度（大字）・層名・降下ゲージ。
- `GrainOverlay`：SVG/CSS ノイズ＋ヴィネット。深いほど濃く・歪む。低モーションで静止。
- `SoundToggle`：環境音 ON/OFF。
- `CodexModal`：標本カード（図版プレースホルダ・名称・分類・観察記）。フォーカストラップ・Esc。

### 3.4 ロジック / データ（`src/lib/`）
- `layers.ts`：層定義（深度域・色・フォグ・名称）と `yForProgress` 等の写像。
- `catalog.ts`：図鑑データ（標本の名称・分類・観察記・配置・色）。
- `useScrollProgress.ts`：Lenis（＋GSAP ticker）/ 低モーション時はネイティブ scroll。
- `useReducedMotion.ts` / `useDeviceTier.ts`：環境検出。
- `useAmbientDrone.ts`：WebAudio の環境ドローン（深度でピッチ/フィルタ変化，操作で開始）。
- `math.ts`：`clamp` / `lerp` / `smoothstep` / 色補間。

### 3.5 データフロー
```
scroll(Lenis) → setScroll(progress)
                   ├─(getState)→ CameraRig / FogRig / Spores    … 再描画なしで毎フレーム反映
                   └─(selector)→ DepthHUD / Fieldbook / Grain   … depth・layerIndex 変化時のみ再描画
click(Specimen) → open(entry) → CodexModal
```

---

## 4. ディレクトリ構成

```
260619_abyss/
├─ package.json / tsconfig.json / next.config.mjs / .nvmrc
├─ DESIGN.md                 ← 本書（1〜4）
├─ README.md
├─ public/                   ← 静的アセット（最小実装ではプレースホルダのみ）
└─ src/
   ├─ app/
   │  ├─ layout.tsx          ← フォント・メタ・globals
   │  ├─ page.tsx            ← AbyssExperience を描画
   │  └─ globals.css         ← 手帳トーンのデザイントークン
   ├─ lib/
   │  ├─ store.ts            ← zustand ストア
   │  ├─ layers.ts           ← 層定義・写像
   │  ├─ catalog.ts          ← 図鑑データ
   │  ├─ math.ts             ← clamp/lerp/smoothstep/色
   │  ├─ useScrollProgress.ts
   │  ├─ useReducedMotion.ts
   │  ├─ useDeviceTier.ts
   │  └─ useAmbientDrone.ts
   ├─ three/
   │  ├─ AbyssExperience.tsx ← 'use client' 統合
   │  ├─ AbyssCanvas.tsx     ← Canvas（ssr:false）
   │  ├─ Scene.tsx
   │  ├─ CameraRig.tsx
   │  ├─ FogRig.tsx
   │  ├─ Shaft.tsx
   │  ├─ Spores.tsx
   │  ├─ Specimen.tsx
   │  ├─ GiantSilhouette.tsx
   │  └─ Decor.tsx
   └─ components/
      ├─ ScrollTrack.tsx
      ├─ Intro.tsx
      ├─ Fieldbook.tsx
      ├─ DepthHUD.tsx
      ├─ GrainOverlay.tsx
      ├─ SoundToggle.tsx
      └─ CodexModal.tsx
```

---

## 5. 最小実装

プレースホルダと簡易 3D で，**地上から深層・名称不明領域までスクロールで降りる体験**を一通り完成させる。
実コードは本リポジトリ `src/` 以下に格納。`npm install && npm run dev` で起動。
詳細は [README.md](./README.md) を参照。
