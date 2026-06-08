import { useMemo, useState } from 'react'
import AllocationCharts from '../src/components/AllocationCharts'
import AnalysisSummary from '../src/components/AnalysisSummary'
import SecurityDetail from '../src/components/SecurityDetail'
import SecurityTable from '../src/components/SecurityTable'
import styles from '../styles/home.module.css'

const securities = [
  {
    id: 'apple',
    name: 'Apple Inc.',
    country: '米国',
    sector: '情報技術',
    currency: 'USD',
    amount: 1800000,
    ratio: 0.12,
    fundBreakdown: [
      { fundName: '全世界株式インデックスファンド', amount: 990000, ratio: 0.55 },
      { fundName: '米国大型株ETF', amount: 630000, ratio: 0.35 },
      { fundName: 'テクノロジー株ファンド', amount: 180000, ratio: 0.1 },
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft Corp.',
    country: '米国',
    sector: '情報技術',
    currency: 'USD',
    amount: 1650000,
    ratio: 0.11,
    fundBreakdown: [
      { fundName: '全世界株式インデックスファンド', amount: 825000, ratio: 0.5 },
      { fundName: '米国大型株ETF', amount: 660000, ratio: 0.4 },
      { fundName: 'テクノロジー株ファンド', amount: 165000, ratio: 0.1 },
    ],
  },
  {
    id: 'nvidia',
    name: 'NVIDIA Corp.',
    country: '米国',
    sector: '半導体',
    currency: 'USD',
    amount: 1350000,
    ratio: 0.09,
    fundBreakdown: [
      { fundName: '米国大型株ETF', amount: 675000, ratio: 0.5 },
      { fundName: 'テクノロジー株ファンド', amount: 540000, ratio: 0.4 },
      { fundName: '全世界株式インデックスファンド', amount: 135000, ratio: 0.1 },
    ],
  },
  {
    id: 'toyota',
    name: 'トヨタ自動車',
    country: '日本',
    sector: '一般消費財',
    currency: 'JPY',
    amount: 1200000,
    ratio: 0.08,
    fundBreakdown: [
      { fundName: '日本株インデックスファンド', amount: 840000, ratio: 0.7 },
      { fundName: '全世界株式インデックスファンド', amount: 360000, ratio: 0.3 },
    ],
  },
  {
    id: 'novo',
    name: 'Novo Nordisk A/S',
    country: 'デンマーク',
    sector: 'ヘルスケア',
    currency: 'DKK',
    amount: 1050000,
    ratio: 0.07,
    fundBreakdown: [
      { fundName: '欧州株式ファンド', amount: 735000, ratio: 0.7 },
      { fundName: '全世界株式インデックスファンド', amount: 315000, ratio: 0.3 },
    ],
  },
  {
    id: 'asml',
    name: 'ASML Holding',
    country: 'オランダ',
    sector: '半導体',
    currency: 'EUR',
    amount: 900000,
    ratio: 0.06,
    fundBreakdown: [
      { fundName: '欧州株式ファンド', amount: 540000, ratio: 0.6 },
      { fundName: 'テクノロジー株ファンド', amount: 360000, ratio: 0.4 },
    ],
  },
  {
    id: 'sony',
    name: 'ソニーグループ',
    country: '日本',
    sector: 'コミュニケーション',
    currency: 'JPY',
    amount: 825000,
    ratio: 0.055,
    fundBreakdown: [
      { fundName: '日本株インデックスファンド', amount: 577500, ratio: 0.7 },
      { fundName: '全世界株式インデックスファンド', amount: 247500, ratio: 0.3 },
    ],
  },
  {
    id: 'nestle',
    name: 'Nestlé S.A.',
    country: 'スイス',
    sector: '生活必需品',
    currency: 'CHF',
    amount: 750000,
    ratio: 0.05,
    fundBreakdown: [
      { fundName: '欧州株式ファンド', amount: 450000, ratio: 0.6 },
      { fundName: '全世界株式インデックスファンド', amount: 300000, ratio: 0.4 },
    ],
  },
  {
    id: 'lvmh',
    name: 'LVMH',
    country: 'フランス',
    sector: '一般消費財',
    currency: 'EUR',
    amount: 675000,
    ratio: 0.045,
    fundBreakdown: [
      { fundName: '欧州株式ファンド', amount: 472500, ratio: 0.7 },
      { fundName: '全世界株式インデックスファンド', amount: 202500, ratio: 0.3 },
    ],
  },
  {
    id: 'tsmc',
    name: 'Taiwan Semiconductor',
    country: '台湾',
    sector: '半導体',
    currency: 'TWD',
    amount: 600000,
    ratio: 0.04,
    fundBreakdown: [
      { fundName: '新興国株式ファンド', amount: 420000, ratio: 0.7 },
      { fundName: '全世界株式インデックスファンド', amount: 180000, ratio: 0.3 },
    ],
  },
  {
    id: 'samsung',
    name: 'Samsung Electronics',
    country: '韓国',
    sector: '情報技術',
    currency: 'KRW',
    amount: 525000,
    ratio: 0.035,
    fundBreakdown: [
      { fundName: '新興国株式ファンド', amount: 367500, ratio: 0.7 },
      { fundName: '全世界株式インデックスファンド', amount: 157500, ratio: 0.3 },
    ],
  },
  {
    id: 'reliance',
    name: 'Reliance Industries',
    country: 'インド',
    sector: 'エネルギー',
    currency: 'INR',
    amount: 450000,
    ratio: 0.03,
    fundBreakdown: [
      { fundName: '新興国株式ファンド', amount: 315000, ratio: 0.7 },
      { fundName: '全世界株式インデックスファンド', amount: 135000, ratio: 0.3 },
    ],
  },
]

const totalAssets = 15000000

function Home() {
  const [selectedSecurityId, setSelectedSecurityId] = useState(securities[0].id)
  const selectedSecurity = useMemo(
    () => securities.find((security) => security.id === selectedSecurityId),
    [selectedSecurityId]
  )

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portfolio Look-through Analysis</p>
        <h1>投資信託の実質保有銘柄を可視化</h1>
        <p>
          複数ファンドを横断して、銘柄・国・業種・通貨ごとの配分と、選択した銘柄がどのファンド経由で保有されているかを確認できます。
        </p>
      </section>

      <AnalysisSummary asOfDate="2026-05-31" coverageRate={0.935} totalAssets={totalAssets} />
      <AllocationCharts securities={securities} totalAssets={totalAssets} />
      <SecurityTable
        onSelectSecurity={(security) => setSelectedSecurityId(security.id)}
        securities={securities}
        selectedSecurityId={selectedSecurityId}
      />
      <SecurityDetail security={selectedSecurity} />
    </main>
  )
}

export default Home
