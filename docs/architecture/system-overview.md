# システム概要

## テックスタック

| レイヤー | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js (Pages Router) | ^16.2.3 |
| UI ライブラリ | React | ^18.2.0 |
| 言語 | TypeScript | 5.9.3 |
| スタイリング | CSS Modules | — |
| ランタイム | Node.js | Codespaces 環境 |

---

## ディレクトリ構成（予定）

```
/
├── pages/                  # Next.js ページ（ルーティング）
│   ├── index.tsx           # ホーム画面（旅行一覧）
│   ├── trips/
│   │   └── [id].tsx        # 旅行詳細画面
│   ├── share/
│   │   └── [id].tsx        # 共有閲覧ページ（読み取り専用）
│   └── _app.tsx            # アプリ全体のラッパー
│
├── src/
│   ├── components/         # UI コンポーネント
│   │   ├── TripCard.tsx        # 旅行カード（ホーム一覧用）
│   │   ├── DayTab.tsx          # 日付タブ
│   │   ├── SpotList.tsx        # スポットリスト（D&D 対応）
│   │   ├── SpotRow.tsx         # スポット1行
│   │   ├── SpotAddForm.tsx     # スポット追加インラインフォーム
│   │   ├── SpotDetailModal.tsx # スポット詳細モーダル
│   │   └── ShareModal.tsx      # 共有モーダル
│   ├── lib/
│   │   └── recalcTimes.ts      # 時刻再計算ロジック
│   └── types/
│       └── trip.ts             # Trip / Day / Spot / Cost 型定義
│
├── styles/                 # CSS Modules
│   └── globals.css
│
└── docs/                   # プロジェクトドキュメント
```

---

## データ永続化方針

- **MVPはクライアントサイドのみ**で状態を保持する
- ブラウザリロードでデータはリセットされる（仕様）
- 状態管理は React の `useState` を使用し、`pages/index.tsx` でトップレベルの旅行リストを保持する
- 将来的に localStorage や外部 API へ移行する場合、`src/lib/` 以下に永続化アダプターを追加する

---

## 状態管理方針

```
pages/index.tsx (trips: Trip[])
  └── TripCard × n
pages/trips/[id].tsx (trip: Trip, activeDay: number)
  ├── DayTab × n
  └── SpotList (spots: Spot[])
       ├── SpotRow × n  ─── [click] → SpotDetailModal
       └── SpotAddForm  ─── [submit] → spots に追加 → recalcTimes()
```

- トップの状態は `pages/` レベルのコンポーネントに置く
- `recalcTimes` はスポットの追加・削除・並び替えのたびに呼び出す
- 詳細は [time-recalc.md](./time-recalc.md) を参照

---

## URL 共有の仕組み

- 共有用 URL: `https://tripplan.app/share/{tripId}`
- `pages/share/[id].tsx` が該当ルートを処理する
- MVP では旅行データをクエリパラメータまたは URL エンコードで渡す（読み取り専用）
- 将来的にはサーバー側で Trip データを永続化し ID で引き当てる想定

---

## ページ一覧

| URL パターン | ページ | 説明 |
|---|---|---|
| `/` | ホーム | 旅行一覧 |
| `/trips/new` | 旅行作成 | 新規旅行作成フォーム |
| `/trips/[id]` | 旅行詳細 | スケジュール・スポット管理 |
| `/share/[id]` | 共有閲覧 | 読み取り専用の共有ページ |
