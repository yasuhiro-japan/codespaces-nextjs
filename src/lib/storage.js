/**
 * @typedef {Object} UserPosition
 * @property {string} symbol
 * @property {number} quantity
 * @property {number} averagePrice
 */

export const PORTFOLIO_POSITIONS_KEY = 'portfolioPositions'

function isBrowserStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isValidUserPosition(position) {
  return (
    position &&
    typeof position === 'object' &&
    typeof position.symbol === 'string' &&
    position.symbol.trim().length > 0 &&
    Number.isFinite(position.quantity) &&
    position.quantity >= 0 &&
    Number.isFinite(position.averagePrice) &&
    position.averagePrice >= 0
  )
}

/**
 * @returns {UserPosition[]}
 */
export function readPortfolioPositions() {
  if (!isBrowserStorageAvailable()) {
    return []
  }

  const rawValue = window.localStorage.getItem(PORTFOLIO_POSITIONS_KEY)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue) || !parsedValue.every(isValidUserPosition)) {
      return []
    }

    return parsedValue.map((position) => ({
      symbol: position.symbol.trim().toUpperCase(),
      quantity: position.quantity,
      averagePrice: position.averagePrice,
    }))
  } catch {
    return []
  }
}

/**
 * @param {UserPosition[]} positions
 */
export function savePortfolioPositions(positions) {
  if (!isBrowserStorageAvailable()) {
    return
  }

  window.localStorage.setItem(PORTFOLIO_POSITIONS_KEY, JSON.stringify(positions))
}

export function clearPortfolioPositions() {
  if (!isBrowserStorageAvailable()) {
    return
  }

  window.localStorage.removeItem(PORTFOLIO_POSITIONS_KEY)
}
