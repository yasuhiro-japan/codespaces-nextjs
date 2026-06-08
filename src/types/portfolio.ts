export type CurrencyCode = string

export type FundType = 'etf' | 'mutualFund' | 'indexFund' | 'other'

export type HoldingConfidence = 'high' | 'medium' | 'low'

export type AccountType =
  | 'taxable'
  | 'nisa'
  | 'ideco'
  | 'retirement'
  | 'other'

export interface Fund {
  id: string
  name: string
  ticker: string
  type: FundType
  provider: string
  currency: CurrencyCode
  expenseRatio: number
  benchmark: string
}

export interface Security {
  id: string
  name: string
  ticker: string
  country: string
  sector: string
  currency: CurrencyCode
  exchange: string
}

export interface FundHolding {
  fundId: Fund['id']
  securityId: Security['id']
  weight: number
  asOfDate: string
  source: string
  confidence: HoldingConfidence
}

export interface UserPosition {
  fundId: Fund['id']
  amount: number
  accountType: AccountType
}

export interface SecurityPositionFundBreakdown {
  fundId: Fund['id']
  fundName: Fund['name']
  fundTicker: Fund['ticker']
  holdingWeight: FundHolding['weight']
  userAmount: UserPosition['amount']
  amount: number
  portfolioWeight: number
}

export interface AnalyzedSecurityPosition {
  securityId: Security['id']
  securityName: Security['name']
  securityTicker: Security['ticker']
  country: Security['country']
  sector: Security['sector']
  currency: Security['currency']
  amount: number
  portfolioWeight: number
  fundBreakdown: SecurityPositionFundBreakdown[]
}
