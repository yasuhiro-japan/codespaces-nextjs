import { useState } from 'react'
import Button from '../components/Button'
import styles from '../styles/home.module.css'

const sampleHoldings = [
  { symbol: 'AAPL', name: 'Apple', weight: '32%', trend: '+4.8%' },
  { symbol: 'MSFT', name: 'Microsoft', weight: '28%', trend: '+3.1%' },
  { symbol: 'NVDA', name: 'NVIDIA', weight: '24%', trend: '+8.6%' },
  { symbol: 'CASH', name: 'Cash', weight: '16%', trend: '0.0%' },
]

function Home() {
  const [activePanel, setActivePanel] = useState('input')

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Portfolio Insight Starter</p>
          <h1>投資ポートフォリオを、すばやく見える化。</h1>
          <p className={styles.description}>
            保有銘柄や比率を入力すると、資産配分・リスク傾向・改善のヒントを
            ひとつのダッシュボードで確認できます。
          </p>
          <div className={styles.ctaGroup} aria-label="主要アクション">
            <Button onClick={() => setActivePanel('input')}>
              ポートフォリオを入力する
            </Button>
            <Button onClick={() => setActivePanel('sample')}>
              サンプル分析を見る
            </Button>
            <Button onClick={() => setActivePanel('csv')}>CSVアップロード</Button>
          </div>
        </div>
        <aside className={styles.heroCard} aria-label="分析サマリー">
          <span className={styles.cardLabel}>Sample score</span>
          <strong>82</strong>
          <p>分散度・成長性・現金比率をもとにした初期スコアです。</p>
        </aside>
      </section>

      <section className={styles.workspace}>
        <div className={styles.panelSwitcher} role="tablist" aria-label="表示切り替え">
          <button
            className={activePanel === 'input' ? styles.activeTab : styles.tab}
            onClick={() => setActivePanel('input')}
            type="button"
          >
            入力フォーム
          </button>
          <button
            className={activePanel === 'sample' ? styles.activeTab : styles.tab}
            onClick={() => setActivePanel('sample')}
            type="button"
          >
            分析結果
          </button>
          <button
            className={activePanel === 'csv' ? styles.activeTab : styles.tab}
            onClick={() => setActivePanel('csv')}
            type="button"
          >
            CSV
          </button>
        </div>

        {activePanel === 'input' && (
          <section className={styles.panel} aria-labelledby="input-heading">
            <div>
              <p className={styles.sectionLabel}>Step 1</p>
              <h2 id="input-heading">保有銘柄を入力</h2>
              <p>
                初期段階ではページ内状態で画面を切り替えます。銘柄名・評価額・
                メモを入力して、後続の分析機能につなげられる構成です。
              </p>
            </div>
            <form className={styles.form}>
              <label>
                銘柄・資産名
                <input placeholder="例: AAPL / 全世界株式インデックス" />
              </label>
              <label>
                評価額
                <input inputMode="numeric" placeholder="例: 500000" />
              </label>
              <label>
                投資メモ
                <textarea placeholder="投資目的や気になるリスクを記入" rows="4" />
              </label>
            </form>
          </section>
        )}

        {activePanel === 'sample' && (
          <section className={styles.panel} aria-labelledby="sample-heading">
            <div>
              <p className={styles.sectionLabel}>Sample analysis</p>
              <h2 id="sample-heading">サンプル分析結果</h2>
              <p>
                入力後に表示する想定の分析カードです。主要銘柄の比率と直近の
                パフォーマンスを確認できます。
              </p>
            </div>
            <div className={styles.analysisGrid}>
              {sampleHoldings.map((holding) => (
                <article className={styles.analysisCard} key={holding.symbol}>
                  <span>{holding.symbol}</span>
                  <h3>{holding.name}</h3>
                  <dl>
                    <div>
                      <dt>構成比</dt>
                      <dd>{holding.weight}</dd>
                    </div>
                    <div>
                      <dt>変化率</dt>
                      <dd>{holding.trend}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePanel === 'csv' && (
          <section className={styles.panel} aria-labelledby="csv-heading">
            <div>
              <p className={styles.sectionLabel}>Bulk import</p>
              <h2 id="csv-heading">CSVアップロード</h2>
              <p>
                証券口座から出力したCSVを取り込む導線です。現在はUIのみを用意し、
                実際の解析処理は次の実装ステップで追加できます。
              </p>
            </div>
            <label className={styles.uploadBox}>
              <span>CSVファイルを選択</span>
              <input accept=".csv,text/csv" type="file" />
            </label>
          </section>
        )}
      </section>
    </main>
  )
}

export default Home
