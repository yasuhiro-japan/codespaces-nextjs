import type { ChartDatum, SecurityAllocation } from './AnalysisTypes'

export const TOP_ALLOCATION_LIMIT = 10

export function formatCurrency(amount: number, currency = 'JPY') {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export function summarizeTopAllocations<T extends { name: string; value: number }>(
  items: T[],
  total: number,
  limit = TOP_ALLOCATION_LIMIT
): ChartDatum[] {
  const sortedItems = [...items].sort((a, b) => b.value - a.value)
  const topItems = sortedItems.slice(0, limit).map((item) => ({
    name: item.name,
    value: item.value,
    ratio: total > 0 ? item.value / total : 0,
  }))
  const otherValue = sortedItems.slice(limit).reduce((sum, item) => sum + item.value, 0)

  if (otherValue > 0) {
    topItems.push({
      name: 'その他',
      value: otherValue,
      ratio: total > 0 ? otherValue / total : 0,
    })
  }

  return topItems
}

export function groupAllocationsBy(
  securities: SecurityAllocation[],
  key: keyof Pick<SecurityAllocation, 'country' | 'sector' | 'currency'>,
  total: number,
  limit = TOP_ALLOCATION_LIMIT
): ChartDatum[] {
  const grouped = securities.reduce<Record<string, number>>((acc, security) => {
    const groupName = security[key] || '未分類'
    acc[groupName] = (acc[groupName] || 0) + security.amount
    return acc
  }, {})

  return summarizeTopAllocations(
    Object.entries(grouped).map(([name, value]) => ({ name, value })),
    total,
    limit
  )
}
