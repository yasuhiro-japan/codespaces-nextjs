import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button'
import ClickCount from '../components/ClickCount'
import Disclaimer from '../src/components/Disclaimer'
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
      <hr className={styles.hr} />
      <div>
        <p>
          Auto incrementing value. The counter won't reset after edits or if
          there are errors.
        </p>
        <p>Current value: {count}</p>
      </div>
      <hr className={styles.hr} />
      <div>
        <p>Component with state.</p>
        <ClickCount />
      </div>
      <hr className={styles.hr} />
      <div>
        <p>
          The button below will throw 2 errors. You'll see the error overlay to
          let you know about the errors but it won't break the page or reset
          your state.
        </p>
        <Button
          onClick={(e) => {
            setTimeout(() => document.parentNode(), 0)
            throwError()
          }}
        >
          Throw an Error
        </Button>
      </div>
      <hr className={styles.hr} />
      <Disclaimer />
    </main>
  )
}

export default Home
