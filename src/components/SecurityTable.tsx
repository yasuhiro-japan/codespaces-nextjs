import type { SecurityAllocation } from './AnalysisTypes'
import styles from './AnalysisComponents.module.css'
import { formatCurrency, formatPercent } from './analysisUtils'

type SecurityTableProps = {
  securities: SecurityAllocation[]
  selectedSecurityId?: string
  onSelectSecurity: (security: SecurityAllocation) => void
}

export default function SecurityTable({
  securities,
  selectedSecurityId,
  onSelectSecurity,
}: SecurityTableProps) {
  return (
    <section className={styles.section} aria-labelledby="security-table-title">
      <h2 className={styles.sectionTitle} id="security-table-title">
        銘柄別ランキング
      </h2>
      <div className={`${styles.tableWrap} ${styles.desktopTable}`}>
        <table className={styles.securityTable}>
          <thead>
            <tr>
              <th scope="col">順位</th>
              <th scope="col">銘柄名</th>
              <th scope="col">国</th>
              <th scope="col">業種</th>
              <th scope="col">実質投資額</th>
              <th scope="col">比率</th>
            </tr>
          </thead>
          <tbody>
            {securities.map((security, index) => (
              <tr
                className={`${styles.securityRow} ${
                  selectedSecurityId === security.id ? styles.selectedRow : ''
                }`}
                key={security.id}
                onClick={() => onSelectSecurity(security)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelectSecurity(security)
                  }
                }}
                tabIndex={0}
              >
                <td className={styles.rankCell}>{index + 1}</td>
                <td className={styles.securityName}>{security.name}</td>
                <td>{security.country}</td>
                <td>{security.sector}</td>
                <td className={styles.numberCell}>{formatCurrency(security.amount)}</td>
                <td>
                  <div className={styles.ratioBar} aria-label={formatPercent(security.ratio)}>
                    <span className={styles.ratioTrack} aria-hidden="true">
                      <span
                        className={styles.ratioFill}
                        style={{ width: `${Math.min(security.ratio * 100, 100)}%` }}
                      />
                    </span>
                    <span className={styles.numberCell}>{formatPercent(security.ratio)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileCards} aria-label="銘柄別ランキング（カード表示）">
        {securities.map((security, index) => (
          <button
            className={`${styles.securityCard} ${
              selectedSecurityId === security.id ? styles.selectedRow : ''
            }`}
            key={security.id}
            onClick={() => onSelectSecurity(security)}
            type="button"
          >
            <span className={styles.securityCardHeader}>
              <span>
                <span className={styles.rankCell}>#{index + 1}</span>
                <span className={styles.securityName}>{security.name}</span>
              </span>
              <span className={styles.badge}>{formatPercent(security.ratio)}</span>
            </span>
            <span className={styles.cardMeta}>
              {security.country} / {security.sector} / {security.currency}
            </span>
            <span className={styles.ratioBar}>
              <span className={styles.ratioTrack} aria-hidden="true">
                <span
                  className={styles.ratioFill}
                  style={{ width: `${Math.min(security.ratio * 100, 100)}%` }}
                />
              </span>
              <span className={styles.numberCell}>{formatCurrency(security.amount)}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
