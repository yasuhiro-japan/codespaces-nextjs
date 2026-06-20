# TripPlan — Claude Code プロジェクトガイド

## アプリ概要

旅行の日程・訪問スポット・費用を管理し、URLで仲間に共有できる Web アプリ。
- **テックスタック**: Next.js 16 (Pages Router) / React 18 / TypeScript / CSS Modules
- **対象**: 個人旅行者向け

---

## 起動

```bash
npm run dev   # http://localhost:3000
npm run build
npm run start
```

---

## 主要ディレクトリ

```
pages/           # ルーティング（index, trips/[id], share/[id]）
src/
  components/    # UI コンポーネント (.tsx)
  lib/           # ロジック（recalcTimes.ts など）
  types/         # 型定義（trip.ts: Trip / Day / Spot / Cost）
styles/          # CSS Modules
docs/            # 仕様・設計ドキュメント
```

---

## 重要な実装ルール

### recalcTimes — 必ず呼ぶ
スポットの追加・削除・D&D 並び替え後は `src/lib/recalcTimes.ts` の `recalcTimes(spots)` を呼び出し、返り値で state を更新する。  
→ 詳細: [docs/architecture/time-recalc.md](docs/architecture/time-recalc.md)

### 費用（Cost）は最大3件
`costs.length >= 3` のとき「+ 追加」ボタンを非表示にする。

### startTime は先頭スポットのみ直接保持
2番目以降の `startTime` は `recalcTimes` が算出する。ユーザー入力で上書きしない。

---

## ドキュメント一覧

| ファイル | 内容 |
|---|---|
| [docs/product/requirements.md](docs/product/requirements.md) | 機能要件・画面構成・制約・カテゴリ定義 |
| [docs/architecture/system-overview.md](docs/architecture/system-overview.md) | ページ構成・状態管理・共有 URL の仕組み |
| [docs/architecture/data-model.md](docs/architecture/data-model.md) | Trip/Day/Spot/Cost の型定義と制約 |
| [docs/architecture/time-recalc.md](docs/architecture/time-recalc.md) | recalcTimes の仕様・計算例・呼び出しパターン |
| [docs/uiux/design-principles.md](docs/uiux/design-principles.md) | デザインテイスト・カラー定義・インタラクション |
