export type FundBreakdown = {
  fundName: string
  amount: number
  ratio: number
}

export type SecurityAllocation = {
  id: string
  name: string
  country: string
  sector: string
  currency: string
  amount: number
  ratio: number
  fundBreakdown: FundBreakdown[]
}

export type ChartDatum = {
  name: string
  value: number
  ratio: number
}
