import type { SecurityAllocation } from './AnalysisTypes'
import styles from './AnalysisComponents.module.css'
import { formatCurrency, formatPercent } from './analysisUtils'

type SecurityDetailProps = {
  security?: SecurityAllocation
}

export default function SecurityDetail({ security }: SecurityDetailProps) {
  if (!security) {
    return (
      <section className={styles.section} aria-labelledby="security-detail-title">
        <h2 className={styles.sectionTitle} id="security-detail-title">
          銘柄詳細
        </h2>
        <div className={styles.detailEmpty}>銘柄を選択すると、経由ファンド内訳を表示します。</div>
      </section>
    )
  }

  return (
    <section className={styles.section} aria-labelledby="security-detail-title">
      <div className={styles.detailHeader}>
        <div>
          <h2 className={styles.sectionTitle} id="security-detail-title">
            {security.name} の経由ファンド内訳
          </h2>
          <p className={styles.cardMeta}>
            {security.country} / {security.sector} / 実質投資額 {formatCurrency(security.amount)}
          </p>
        </div>
        <span className={styles.badge}>{formatPercent(security.ratio)}</span>
      </div>
      <dl className={styles.breakdownList}>
        {security.fundBreakdown.map((fund) => (
          <div className={styles.breakdownItem} key={fund.fundName}>
            <dt className={styles.breakdownName}>{fund.fundName}</dt>
            <dd className={styles.numberCell}>
              {formatCurrency(fund.amount)}（{formatPercent(fund.ratio)}）
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
