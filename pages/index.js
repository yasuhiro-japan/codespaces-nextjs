import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button'
import {
  clearPortfolioPositions,
  readPortfolioPositions,
  savePortfolioPositions,
} from '../src/lib/storage'
import styles from '../styles/home.module.css'

const initialFormState = {
  symbol: '',
  quantity: '',
  averagePrice: '',
}

function createPositionFromForm(form) {
  return {
    symbol: form.symbol.trim().toUpperCase(),
    quantity: Number(form.quantity),
    averagePrice: Number(form.averagePrice),
  }
}

function Home() {
  const [positions, setPositions] = useState([])
  const [form, setForm] = useState(initialFormState)
  useEffect(() => {
    setPositions(readPortfolioPositions())
  }, [])

  const totalCost = useMemo(
    () =>
      positions.reduce(
        (sum, position) => sum + position.quantity * position.averagePrice,
        0
      ),
    [positions]
  )

  function handleFormChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleAddPosition(event) {
    event.preventDefault()

    const nextPosition = createPositionFromForm(form)

    if (
      !nextPosition.symbol ||
      !Number.isFinite(nextPosition.quantity) ||
      nextPosition.quantity < 0 ||
      !Number.isFinite(nextPosition.averagePrice) ||
      nextPosition.averagePrice < 0
    ) {
      return
    }

    setPositions((currentPositions) => {
      const nextPositions = [...currentPositions, nextPosition]

      savePortfolioPositions(nextPositions)

      return nextPositions
    })
    setForm(initialFormState)
  }

  function handleResetInputs() {
    setForm(initialFormState)
    setPositions([])
    clearPortfolioPositions()
  }

  return (
    <main className={styles.main}>
      <h1>Portfolio Positions</h1>
      <p>
        Enter your holdings and they will be restored from LocalStorage on the
        next page load. Invalid saved data is ignored automatically.
      </p>

      <form className={styles.form} onSubmit={handleAddPosition}>
        <label className={styles.field}>
          Ticker symbol
          <input
            name="symbol"
            placeholder="AAPL"
            value={form.symbol}
            onChange={handleFormChange}
            required
          />
        </label>
        <label className={styles.field}>
          Quantity
          <input
            name="quantity"
            min="0"
            placeholder="10"
            step="any"
            type="number"
            value={form.quantity}
            onChange={handleFormChange}
            required
          />
        </label>
        <label className={styles.field}>
          Average price
          <input
            name="averagePrice"
            min="0"
            placeholder="180.50"
            step="any"
            type="number"
            value={form.averagePrice}
            onChange={handleFormChange}
            required
          />
        </label>
        <div className={styles.actions}>
          <Button type="submit">Add position</Button>
          <Button onClick={handleResetInputs}>入力をリセット</Button>
        </div>
      </form>

      <section className={styles.positions} aria-live="polite">
        <div className={styles.sectionHeader}>
          <h2>Saved positions</h2>
          <p>Total cost: ${totalCost.toLocaleString()}</p>
        </div>

        {positions.length === 0 ? (
          <p className={styles.emptyState}>No positions saved yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Average price</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={`${position.symbol}-${index}`}>
                  <td>{position.symbol}</td>
                  <td>{position.quantity.toLocaleString()}</td>
                  <td>${position.averagePrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default Home
