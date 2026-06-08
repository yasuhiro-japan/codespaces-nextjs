import styles from './AnalysisComponents.module.css'
import { formatCurrency, formatPercent } from './analysisUtils'

type AnalysisSummaryProps = {
  totalAssets: number
  asOfDate: string
  coverageRate: number
}

export default function AnalysisSummary({
  totalAssets,
  asOfDate,
  coverageRate,
}: AnalysisSummaryProps) {
  const formattedDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(asOfDate))

  return (
    <section className={styles.section} aria-labelledby="analysis-summary-title">
      <h2 className={styles.sectionTitle} id="analysis-summary-title">
        分析サマリー
      </h2>
      <div className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <p className={styles.summaryLabel}>総資産額</p>
          <p className={styles.summaryValue}>{formatCurrency(totalAssets)}</p>
          <p className={styles.summaryHelp}>集計対象ポートフォリオの時価総額</p>
        </article>
        <article className={styles.summaryCard}>
          <p className={styles.summaryLabel}>データ基準日</p>
          <p className={styles.summaryValue}>{formattedDate}</p>
          <p className={styles.summaryHelp}>保有明細を評価した日付</p>
        </article>
        <article className={styles.summaryCard}>
          <p className={styles.summaryLabel}>カバレッジ率</p>
          <p className={styles.summaryValue}>{formatPercent(coverageRate)}</p>
          <p className={styles.summaryHelp}>分析済み資産が総資産に占める割合</p>
        </article>
      </div>
    </section>
  )
}
