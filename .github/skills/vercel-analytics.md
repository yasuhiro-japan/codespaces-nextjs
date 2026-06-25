# Vercel Analytics 導入手順（全ページで解析を有効にする）

目的: この手順は、プロジェクト全体で Vercel Analytics を有効化し、すべてのページに解析イベントを送信す
手順をまとめたものです。

前提
- Node.js / npm が使えること。
- Next.js（Pages Router）プロジェクトであること（本リポジトリは Pages Router を使用しています）。

手順

1. パッケージをインストール

```bash
npm install @vercel/analytics
```

2. `pages/_app.js` に `Analytics` コンポーネントを追加

- 編集対象ファイル: [pages/_app.js](pages/_app.js#L1-L5)
- 変更例（ページ全体に Analytics を挿入する最も簡単な方法）:

```js
import '../global.css'
import { Analytics } from '@vercel/analytics/react'

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<Component {...pageProps} />
			<Analytics />
		</>
	)
}
```

この配置により、アプリケーション内のすべてのページで Vercel のクライアント解析が動作します。

3. ローカルで動作確認

```bash
npm run dev
```

- ブラウザでアプリを開き、ネットワークリクエストに `v1/analytics` に対する送信が発生しているか確認するか、Vercel の Analytics ダッシュボードでイベントが到達しているか確認してください。

4. 本番で有効化（Vercel へデプロイ）

- Git を push して Vercel にデプロイします。解析は本番ドメインで集計されるため、Vercel にデプロイしてダッシュボードで確認してください。

5. 補足: App Router（Next.js の新しいルーティング）を使っている場合

- App Router（`app/` ディレクトリ）を使うプロジェクトでは、ルートレイアウト（例: `app/layout.tsx`）に `Analytics` を追加してください。

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				{children}
				<Analytics />
			</body>
		</html>
	)
}
```

補足メモ
- 開発環境（localhost）でも解析イベントは送られますが、本番ドメインでの集計やサンプル率は Vercel 側のダッシュボードで確認してください。
- 追加のカスタムイベント送信やユーザID紐付けなどが必要な場合は、`@vercel/analytics` の API を参照してカスタム実装を行ってください。

以上。必要なら変更をコミットしてデプロイまで代行します。

