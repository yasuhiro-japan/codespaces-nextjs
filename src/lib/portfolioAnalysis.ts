export interface UserPosition {
  fundId: string
  amount: number
}

export interface Fund {
  id: string
  name: string
}

export interface Security {
  id: string
  name: string
  country: string
  industry: string
  currency: string
}

export interface FundHolding {
  fundId: string
  securityId: string
  weight: number
}

export interface FundExposureBreakdown {
  fundId: string
  fundName?: string
  amount: number
  ratio: number
}

export interface SecurityExposure {
  securityId: string
  securityName?: string
  country?: string
  industry?: string
  currency?: string
  amount: number
  ratio: number
  funds: FundExposureBreakdown[]
}

export interface PortfolioAnalysis {
  totalAssets: number
  exposures: SecurityExposure[]
}

export interface CategoryExposure {
  category: string
  amount: number
  ratio: number
}

const DEFAULT_UNKNOWN_CATEGORY = 'Unknown'

/**
 * Calculates look-through security exposures for a portfolio of fund positions.
 *
 * Each fund position is multiplied by each holding weight in the fund. Results
 * for the same security are then summed, with per-fund contribution breakdowns
 * retained for downstream UI or tests.
 */
export function analyzePortfolio(
  positions: UserPosition[],
  funds: Fund[],
  securities: Security[],
  holdings: FundHolding[]
): PortfolioAnalysis {
  const totalAssets = positions.reduce((sum, position) => sum + position.amount, 0)
  const fundById = createRecordById(funds)
  const securityById = createRecordById(securities)
  const holdingsByFundId = groupHoldingsByFundId(holdings)
  const exposureBySecurityId = new Map<string, SecurityExposure>()

  positions.forEach((position) => {
    const fundHoldings = holdingsByFundId.get(position.fundId) ?? []

    fundHoldings.forEach((holding) => {
      const holdingAmount = position.amount * holding.weight
      const security = securityById[holding.securityId]
      const exposure = getOrCreateSecurityExposure(
        exposureBySecurityId,
        holding.securityId,
        security
      )

      exposure.amount += holdingAmount
      addFundBreakdown(exposure, position.fundId, fundById[position.fundId]?.name, holdingAmount)
    })
  })

  const exposures = Array.from(exposureBySecurityId.values()).map((exposure) => ({
    ...exposure,
    ratio: calculateRatio(exposure.amount, totalAssets),
    funds: exposure.funds
      .map((fund) => ({
        ...fund,
        ratio: calculateRatio(fund.amount, totalAssets),
      }))
      .sort(compareByAmountDescending),
  }))

  return {
    totalAssets,
    exposures: exposures.sort(compareByAmountDescending),
  }
}

export function aggregateByCountry(
  exposures: SecurityExposure[],
  totalAssets: number,
  unknownCategory = DEFAULT_UNKNOWN_CATEGORY
): CategoryExposure[] {
  return aggregateByCategory(exposures, totalAssets, (exposure) => exposure.country, unknownCategory)
}

export function aggregateByIndustry(
  exposures: SecurityExposure[],
  totalAssets: number,
  unknownCategory = DEFAULT_UNKNOWN_CATEGORY
): CategoryExposure[] {
  return aggregateByCategory(exposures, totalAssets, (exposure) => exposure.industry, unknownCategory)
}

export function aggregateByCurrency(
  exposures: SecurityExposure[],
  totalAssets: number,
  unknownCategory = DEFAULT_UNKNOWN_CATEGORY
): CategoryExposure[] {
  return aggregateByCategory(exposures, totalAssets, (exposure) => exposure.currency, unknownCategory)
}

function aggregateByCategory(
  exposures: SecurityExposure[],
  totalAssets: number,
  getCategory: (exposure: SecurityExposure) => string | undefined,
  unknownCategory: string
): CategoryExposure[] {
  const amountByCategory = new Map<string, number>()

  exposures.forEach((exposure) => {
    const category = getCategory(exposure) || unknownCategory
    amountByCategory.set(category, (amountByCategory.get(category) ?? 0) + exposure.amount)
  })

  return Array.from(amountByCategory.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      ratio: calculateRatio(amount, totalAssets),
    }))
    .sort(compareByAmountDescending)
}

function createRecordById<T extends { id: string }>(items: T[]): Record<string, T> {
  return items.reduce<Record<string, T>>((record, item) => {
    record[item.id] = item
    return record
  }, {})
}

function groupHoldingsByFundId(holdings: FundHolding[]): Map<string, FundHolding[]> {
  return holdings.reduce<Map<string, FundHolding[]>>((groupedHoldings, holding) => {
    const existingHoldings = groupedHoldings.get(holding.fundId) ?? []
    existingHoldings.push(holding)
    groupedHoldings.set(holding.fundId, existingHoldings)
    return groupedHoldings
  }, new Map())
}

function getOrCreateSecurityExposure(
  exposureBySecurityId: Map<string, SecurityExposure>,
  securityId: string,
  security?: Security
): SecurityExposure {
  const existingExposure = exposureBySecurityId.get(securityId)

  if (existingExposure) {
    return existingExposure
  }

  const exposure: SecurityExposure = {
    securityId,
    securityName: security?.name,
    country: security?.country,
    industry: security?.industry,
    currency: security?.currency,
    amount: 0,
    ratio: 0,
    funds: [],
  }

  exposureBySecurityId.set(securityId, exposure)
  return exposure
}

function addFundBreakdown(
  exposure: SecurityExposure,
  fundId: string,
  fundName: string | undefined,
  amount: number
): void {
  const existingBreakdown = exposure.funds.find((fund) => fund.fundId === fundId)

  if (existingBreakdown) {
    existingBreakdown.amount += amount
    return
  }

  exposure.funds.push({
    fundId,
    fundName,
    amount,
    ratio: 0,
  })
}

function calculateRatio(amount: number, totalAssets: number): number {
  if (totalAssets === 0) {
    return 0
  }

  return amount / totalAssets
}

function compareByAmountDescending<T extends { amount: number }>(left: T, right: T): number {
  return right.amount - left.amount
}
