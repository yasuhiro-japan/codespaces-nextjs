import type { ChartDatum, SecurityAllocation } from './AnalysisTypes'
import styles from './AnalysisComponents.module.css'
import {
  formatCurrency,
  formatPercent,
  groupAllocationsBy,
  summarizeTopAllocations,
} from './analysisUtils'

const COLORS = [
  '#2563eb',
  '#14b8a6',
  '#f97316',
  '#8b5cf6',
  '#ec4899',
  '#22c55e',
  '#eab308',
  '#06b6d4',
  '#ef4444',
  '#64748b',
  '#94a3b8',
]

type AllocationChartsProps = {
  securities: SecurityAllocation[]
  totalAssets: number
}

type PieChartCardProps = {
  title: string
  data: ChartDatum[]
}

function describeArc(cx: number, cy: number, radius: number, startRatio: number, endRatio: number) {
  const startAngle = startRatio * 2 * Math.PI
  const endAngle = endRatio * 2 * Math.PI
  const x1 = cx + radius * Math.cos(startAngle)
  const y1 = cy + radius * Math.sin(startAngle)
  const x2 = cx + radius * Math.cos(endAngle)
  const y2 = cy + radius * Math.sin(endAngle)
  const largeArcFlag = endRatio - startRatio > 0.5 ? 1 : 0

  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

function PieChartCard({ title, data }: PieChartCardProps) {
  let cumulativeRatio = 0

  return (
    <article className={styles.chartCard}>
      <h3>{title}</h3>
      <div className={styles.pieLayout}>
        <svg
          aria-label={`${title}の円グラフ`}
          className={styles.pieSvg}
          role="img"
          viewBox="0 0 120 120"
        >
          {data.map((item, index) => {
            const startRatio = cumulativeRatio
            const endRatio = cumulativeRatio + item.ratio
            cumulativeRatio = endRatio

            if (item.ratio >= 0.999) {
              return <circle cx="60" cy="60" fill={COLORS[index % COLORS.length]} key={item.name} r="54" />
            }

            return (
              <path
                d={describeArc(60, 60, 54, startRatio, endRatio)}
                fill={COLORS[index % COLORS.length]}
                key={item.name}
              />
            )
          })}
          <circle cx="60" cy="60" fill="#fff" r="28" />
        </svg>
        <ul className={styles.legend}>
          {data.map((item, index) => (
            <li className={styles.legendItem} key={item.name}>
              <span
                aria-hidden="true"
                className={styles.legendSwatch}
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
              <span title={formatCurrency(item.value)}>{formatPercent(item.ratio)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function AllocationCharts({ securities, totalAssets }: AllocationChartsProps) {
  const securityData = summarizeTopAllocations(
    securities.map((security) => ({ name: security.name, value: security.amount })),
    totalAssets
  )
  const countryData = groupAllocationsBy(securities, 'country', totalAssets)
  const sectorData = groupAllocationsBy(securities, 'sector', totalAssets)
  const currencyData = groupAllocationsBy(securities, 'currency', totalAssets)

  return (
    <section className={styles.section} aria-labelledby="allocation-charts-title">
      <h2 className={styles.sectionTitle} id="allocation-charts-title">
        配分チャート
      </h2>
      <div className={styles.chartGrid}>
        <PieChartCard data={securityData} title="銘柄別" />
        <PieChartCard data={countryData} title="国別" />
        <PieChartCard data={sectorData} title="業種別" />
        <PieChartCard data={currencyData} title="通貨別" />
      </div>
    </section>
  )
}
