export type CurrencyCode = string

export type ISODateString = string

export type FundType =
  | 'etf'
  | 'mutualFund'
  | 'indexFund'
  | 'listedInvestmentTrust'
  | 'other'

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
  /** Annual expense ratio as a decimal. For example, 0.0009 means 0.09%. */
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
  /** Holding weight as a decimal. For example, 0.125 means 12.5%. */
  weight: number
  asOfDate: ISODateString
  source: string
  confidence: HoldingConfidence
}

export interface UserPosition {
  fundId: Fund['id']
  amount: number
  accountType: AccountType
}

export interface AnalyzedSecurityPositionFundBreakdown {
  fundId: Fund['id']
  fundName: Fund['name']
  fundTicker: Fund['ticker']
  accountType: UserPosition['accountType']
  holdingWeight: FundHolding['weight']
  userPositionAmount: UserPosition['amount']
  securityAmount: number
  /** Contribution to the total portfolio as a decimal. */
  portfolioWeight: number
}

export interface AnalyzedSecurityPosition {
  securityId: Security['id']
  securityName: Security['name']
  securityTicker: Security['ticker']
  country: Security['country']
  sector: Security['sector']
  currency: Security['currency']
  /** Aggregated look-through amount across all user fund positions. */
  amount: number
  /** Aggregated look-through portfolio ratio as a decimal. */
  portfolioWeight: number
  fundBreakdown: AnalyzedSecurityPositionFundBreakdown[]
}
