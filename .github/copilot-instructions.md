# Copilot Instructions

## プロジェクト概要

TripPlan は旅行の日程・訪問スポット・費用を管理し、URLで共有できる Web アプリケーション。

- **フレームワーク**: Next.js 16 (Pages Router) + React 18 + TypeScript
- **スタイリング**: CSS Modules

詳細な仕様: `docs/product/requirements.md`

---

## ディレクトリ構成

```
pages/          # Next.js ルーティング（index, trips/[id], share/[id]）
src/
  components/   # UI コンポーネント（.tsx）
  lib/          # ビジネスロジック（recalcTimes など）
  types/        # TypeScript 型定義（trip.ts）
styles/         # CSS Modules
docs/           # プロジェクトドキュメント
```

---

## データモデル

型定義は `src/types/trip.ts` を参照。主な型:
- `Trip` / `Day` / `Spot` / `Cost` / `SpotCategory`

詳細: `docs/architecture/data-model.md`

---

## 重要な実装ルール

### recalcTimes の呼び出し

スポットの**追加・削除・D&D 並び替え**のたびに `src/lib/recalcTimes.ts` の `recalcTimes()` を呼び出して全スポットの `startTime` を更新する。この呼び出しを忘れると開始時刻がずれる。

```typescript
// 正しい使い方
const updated = recalcTimes(newSpotsArray);
setSpots(updated);
```

詳細: `docs/architecture/time-recalc.md`

### 費用（Cost）の制限

1スポットにつき費用項目は最大3件。`costs.length >= 3` の場合は「+ 追加」ボタンを非表示にする。

### startTime の扱い

先頭スポット（index 0）の `startTime` のみユーザーが入力する。2番目以降は `recalcTimes` が自動計算するため、直接変更しない。

---

## コーディング規約

- コンポーネントは TypeScript (`.tsx`) で記述する
- Props には必ず型定義を付ける
- スタイルは CSS Modules を使用する（インラインスタイルは避ける）
- `recalcTimes` はピュアな関数として保つ（副作用なし・入力配列を変更しない）
- コンポーネントはできるだけ小さく分割し、`src/components/` に配置する

---

## コードを生成する際の注意

- ドラッグ&ドロップ実装時は `recalcTimes` の呼び出しを必ず含める
- 費用入力は `amount` を `string` 型で保持し、表示時に `parseFloat` で変換する
- モーダルの背景クリックでの閉じる動作を必ず実装する
- 日付計算には `Date` を使用し、タイムゾーンに注意して `toISOString().slice(0, 10)` で文字列化する
