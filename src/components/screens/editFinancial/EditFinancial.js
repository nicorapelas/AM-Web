import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Context as FinancialContext } from '../../../context/FinancialsContext'
import { Context as GamesContext } from '../../../context/GamesContext'
import { Context as StoreContext } from '../../../context/StoresContext'
import { Context as StaffContext } from '../../../context/StaffContext'
import { Context as AuthContext } from '../../../context/AuthContext'
import LoaderFullScreen from '../../common/loaders/fullScreenLoader/LoaderFullScreen'
import Header from '../../common/header/Header'
import './editFinancial.css'

const EditFinancial = () => {
  const {
    state: { loading, financialToEdit },
    editFinancial,
  } = useContext(FinancialContext)

  const {
    state: { storeGames },
  } = useContext(GamesContext)

  const {
    state: { storeSelected, userStores },
  } = useContext(StoreContext)

  const {
    state: { staffCredentials },
  } = useContext(AuthContext)

  const {
    state: { storeStaff },
  } = useContext(StaffContext)

  const navigate = useNavigate()

  const [staffName, setStaffName] = useState('')

  const [financialData, setFinancialData] = useState({
    _id: '', // or null if you prefer
    _user: '',
    storeId: '',
    date: '', // will be formatted as 'YYYY-MM-DD' for input fields
    gameFinances: [],
    expenses: [],
    totalMoneyIn: 0,
    totalMoneyOut: 0,
    dailyProfit: 0,
    cash: 0, // Add cash field
    actualCashCount: 0,
    notes: '',
    createdBy: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
    updatedBy: '',
  })

  // Calculate totals - move this into a useMemo to prevent recalculations
  const gameFinancesTotal = React.useMemo(
    () =>
      financialData.gameFinances.reduce(
        (sum, game) => sum + (game.sum === '' ? 0 : Number(game.sum)),
        0,
      ),
    [financialData.gameFinances],
  )

  const totalExpenses = React.useMemo(
    () =>
      financialData.expenses.reduce(
        (sum, expense) =>
          sum + (expense.amount === '' ? 0 : Number(expense.amount)),
        0,
      ),
    [financialData.expenses],
  )

  const moneyBalance = React.useMemo(
    () => gameFinancesTotal - totalExpenses,
    [gameFinancesTotal, totalExpenses],
  )

  useEffect(() => {
    if (financialToEdit) {
      const totalGameSum = financialToEdit.gameFinances.reduce(
        (sum, game) => sum + (Number(game.sum) || 0),
        0,
      )
      const totalExpenses = financialToEdit.expenses.reduce(
        (sum, expense) => sum + (Number(expense.amount) || 0),
        0,
      )

      setFinancialData({
        ...financialToEdit,
        date: new Date(financialToEdit.date).toISOString().split('T')[0],
        expenses: financialToEdit.expenses.map((expense) => ({
          ...expense,
          amount: expense.amount.toString(),
        })),
        gameFinances: financialToEdit.gameFinances.map((game) => ({
          ...game,
          sum: game.sum.toString(),
        })),
        totalMoneyIn:
          financialToEdit.actualCashCount < 0
            ? financialToEdit.actualCashCount
            : totalGameSum,
        totalMoneyOut: totalExpenses,
        dailyProfit: totalGameSum - totalExpenses,
        cash: financialToEdit.actualCashCount || 0,
      })
    } else if (storeGames.length > 0) {
      // Only set the current date if we're creating a new record
      const today = new Date().toISOString().split('T')[0]
      setFinancialData((prev) => ({
        ...prev,
        date: today,
        gameFinances: storeGames.map((game) => ({
          gameId: game._id,
          sum: '',
          gameName: game.gameName,
        })),
        totalMoneyIn: 0,
        totalMoneyOut: 0,
        dailyProfit: 0,
      }))
    }
  }, [financialToEdit, storeGames])

  // Update totals when game finances change
  useEffect(() => {
    const totalGameSum = financialData.gameFinances.reduce(
      (sum, game) => sum + (Number(game.sum) || 0),
      0,
    )
    const totalExpenses = financialData.expenses.reduce(
      (sum, expense) => sum + (Number(expense.amount) || 0),
      0,
    )

    setFinancialData((prev) => ({
      ...prev,
      totalMoneyIn: prev.cash < 0 ? prev.cash : totalGameSum,
      totalMoneyOut: totalExpenses,
      dailyProfit: totalGameSum - totalExpenses,
    }))
  }, [financialData.gameFinances, financialData.expenses, financialData.cash])

  useEffect(() => {
    if (staffCredentials && storeStaff && storeStaff.length > 0) {
      // Try matching by any available identifier
      const currentStaff = storeStaff.find((staff) => {
        return (
          staff._id === staffCredentials.staffId ||
          staff._id === staffCredentials._id ||
          staff.id === staffCredentials.staffId
        )
      })

      if (currentStaff) {
        const fullName = `${currentStaff.firstName} ${currentStaff.lastName}`
        setStaffName(fullName)
        setFinancialData((prev) => ({
          ...prev,
          createdBy: fullName,
        }))
      }
    }
  }, [staffCredentials, storeStaff])

  // Add effect to update createdBy when staffName changes
  useEffect(() => {
    if (staffName) {
      setFinancialData((prev) => ({
        ...prev,
        createdBy: staffName,
      }))
    }
  }, [staffName])

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Other',
  })

  const [validationErrors, setValidationErrors] = useState({
    description: '',
    amount: '',
  })

  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  useEffect(() => {
    if (!userStores || userStores.length === 0) {
      navigate('/dashboard')
    }
  }, [userStores])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'cash') {
      const cashValue = Number(value)
      setFinancialData((prevState) => {
        // Only update if the value is actually different
        if (
          prevState[name] === value &&
          prevState.totalMoneyIn ===
            (cashValue < 0 ? cashValue : gameFinancesTotal)
        ) {
          return prevState
        }
        return {
          ...prevState,
          [name]: value,
          totalMoneyIn: cashValue < 0 ? cashValue : gameFinancesTotal,
        }
      })
    } else {
      setFinancialData((prevState) => {
        // Only update if the value is actually different
        if (prevState[name] === value) {
          return prevState
        }
        return {
          ...prevState,
          [name]: value,
        }
      })
    }

    // Update newExpense.gameId when a game is selected
    if (name === 'gameId') {
      setNewExpense((prevState) => ({
        ...prevState,
      }))
    }
  }

  const handleExpenseChange = (e) => {
    const { name, value } = e.target
    setNewExpense((prevState) => ({
      ...prevState,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
    }))
    // Clear validation error when user starts typing
    setValidationErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const addExpense = (e) => {
    e.preventDefault()

    // Validate inputs
    const errors = {}
    if (!newExpense.description.trim()) {
      errors.description = 'Description is required'
    }
    if (!newExpense.amount) {
      errors.amount = 'Amount is required'
    }

    // If there are errors, set them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    // If validation passes, add the expense
    setFinancialData((prevState) => ({
      ...prevState,
      expenses: [...prevState.expenses, newExpense],
    }))
    setNewExpense({
      description: '',
      amount: '',
      category: 'Other',
    })
    // Clear any existing validation errors
    setValidationErrors({
      description: '',
      amount: '',
    })
  }

  const removeExpense = (indexToRemove) => {
    const expenseToRemove = financialData.expenses[indexToRemove]
    setFinancialData((prevState) => ({
      ...prevState,
      expenses: prevState.expenses.filter(
        (_, index) => index !== indexToRemove,
      ),
    }))
  }

  const handleGameFinanceChange = (gameId, field, value) => {
    setFinancialData((prev) => {
      // First update the game finances
      const updatedGameFinances = prev.gameFinances.map((game) =>
        game.gameId === gameId
          ? { ...game, [field]: value === '' ? '' : Number(value) }
          : game,
      )

      // Otherwise just update the game finances
      return {
        ...prev,
        gameFinances: updatedGameFinances,
      }
    })
  }

  const verifyPin = () => {
    if (!storeStaff || !Array.isArray(storeStaff)) {
      setPinError('Staff data not available')
      return false
    }

    const staffMember = storeStaff.find((staff) => staff.pin === pin)
    if (!staffMember) {
      setPinError('Invalid PIN')
      return false
    }

    // Only update createdBy if it hasn't been set already
    if (!financialData.createdBy) {
      setFinancialData((prev) => ({
        ...prev,
        createdBy: `${staffMember.firstName} ${staffMember.lastName}`,
      }))
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (staffCredentials) {
      setShowPinModal(true)
      return
    }

    await submitForm()
  }

  const submitForm = async () => {
    // Format game finances to ensure all values are numbers
    const formattedGameFinances = financialData.gameFinances.map((game) => ({
      gameId: game.gameId,
      gameName: game.gameName,
      sum: game.sum === '' ? 0 : Number(game.sum),
    }))

    // Format expenses to ensure all amounts are numbers
    const formattedExpenses = financialData.expenses.map((expense) => ({
      ...expense,
      amount: expense.amount === '' ? 0 : Number(expense.amount),
    }))

    // Ensure we have a valid storeId
    if (!storeSelected?._id) {
      alert('Store ID is missing. Please ensure a store is selected.')
      return
    }

    // Get the current staff member's name
    let updatedBy = ''
    if (staffCredentials && storeStaff) {
      const currentStaff = storeStaff.find((staff) => {
        return (
          staff._id === staffCredentials.staffId ||
          staff._id === staffCredentials._id ||
          staff.id === staffCredentials.staffId
        )
      })
      if (currentStaff) {
        updatedBy = `${currentStaff.firstName} ${currentStaff.lastName}`
      }
    }

    const finalData = {
      _id: financialData._id,
      date: financialData.date,
      storeId: storeSelected._id,
      gameFinances: formattedGameFinances,
      expenses: formattedExpenses,
      gameFinancesTotal,
      totalExpenses,
      moneyBalance,
      actualCashCount: financialData.cash,
      totalMoneyIn:
        financialData.cash < 0 ? financialData.cash : gameFinancesTotal,
      notes: financialData.notes || '',
      createdBy: financialData.createdBy,
      updatedBy: updatedBy || financialData.createdBy,
    }
    await editFinancial(finalData)
    navigate('/financials')
  }

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    if (verifyPin()) {
      const staffMember = storeStaff.find((staff) => staff.pin === pin)
      if (staffMember) {
        setFinancialData((prev) => ({
          ...prev,
          updatedBy: `${staffMember.firstName} ${staffMember.lastName}`,
        }))
      }
      setShowPinModal(false)
      setPinError('')
      await submitForm()
    }
  }

  if (loading) {
    return <LoaderFullScreen />
  }

  if (!storeGames || storeGames.length === 0) {
    return (
      <div className="add-financial-page-container">
        <Header />
        <div className="add-financial-stars-bg" />
        <div
          className="add-financial-card"
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            maxWidth: '600px',
            padding: '2rem',
          }}
        >
          <h2
            style={{
              color: '#041e42',
              marginBottom: '2rem',
              fontSize: '1.2rem',
              lineHeight: '1.8',
            }}
          >
            No Games Available
          </h2>
          <p
            style={{
              color: '#041e42',
              fontSize: '1rem',
              lineHeight: '2',
            }}
          >
            There are no games in this arcade, so no financial document can be
            created.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-financial-container">
      <div className="edit-financial-stars"></div>
      <Header />
      <form onSubmit={handleSubmit} className="add-financial-grid">
        <div className="add-financial-cards-container">
          <div className="add-financial-card">
            <div className="add-financial-card-star" />

            {/* Date input */}
            <div className="add-financial-form-group">
              <label className="add-financial-label" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={financialData.date}
                onChange={handleInputChange}
                required
                className="add-financial-input"
              />
            </div>

            {/* Game finances */}
            {financialData.gameFinances.map((game) => (
              <div key={game.gameId} className="add-financial-game-finance">
                <h3>{game.gameName}</h3>
                <div className="add-financial-form-group">
                  <label className="add-financial-label">Sum</label>
                  <input
                    type="number"
                    value={game.sum}
                    onChange={(e) => {
                      handleGameFinanceChange(
                        game.gameId,
                        'sum',
                        e.target.value,
                      )
                    }}
                    className="add-financial-input"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Expenses Section */}
          <div className="add-financial-card">
            <div className="add-financial-card-star" />
            <div className="add-financial-expenses-title-container">
              <h3 className="add-financial-title">Add Expenses</h3>
            </div>
            <div className="add-financial-form-group">
              <label className="add-financial-label" htmlFor="description">
                Description
              </label>
              <input
                className={`add-financial-input ${validationErrors.description ? 'add-financial-input-error' : ''}`}
                type="text"
                id="description"
                name="description"
                value={newExpense.description}
                onChange={handleExpenseChange}
              />
              {validationErrors.description && (
                <div className="add-financial-error-message">
                  {validationErrors.description}
                </div>
              )}
            </div>

            <div className="add-financial-form-group">
              <label className="add-financial-label" htmlFor="amount">
                Amount
              </label>
              <input
                className={`add-financial-input ${validationErrors.amount ? 'add-financial-input-error' : ''}`}
                type="number"
                id="amount"
                name="amount"
                value={newExpense.amount}
                onChange={handleExpenseChange}
                min="0"
                step="0.01"
              />
              {validationErrors.amount && (
                <div className="add-financial-error-message">
                  {validationErrors.amount}
                </div>
              )}
            </div>

            <div className="add-financial-form-group">
              <label className="add-financial-label" htmlFor="category">
                Category
              </label>
              <select
                className="add-financial-select"
                id="category"
                name="category"
                value={newExpense.category}
                onChange={handleExpenseChange}
              >
                <option value="Utilities">Utilities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Supplies">Supplies</option>
                <option value="Payroll">Payroll</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="button"
              onClick={addExpense}
              className="add-financial-btn add-financial-btn-expense"
            >
              Add Expense
            </button>

            {/* Display added expenses */}
            <div className="add-financial-expenses-list">
              {financialData.expenses.map((expense, index) => (
                <div key={index} className="add-financial-expense-item">
                  <span>{expense.description}</span>
                  <span>{expense.category}</span>
                  <span>${Number(expense.amount).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => removeExpense(index)}
                    className="add-financial-delete-btn"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add expenses total */}
              {financialData.expenses.length > 0 && (
                <div className="add-financial-expenses-total">
                  <span>Total Expenses:</span>
                  <span>
                    $
                    {financialData.expenses
                      .reduce(
                        (total, expense) => total + Number(expense.amount),
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div style={{ height: '30px' }} />
            {/* Totals */}
            <div className="add-financial-totals">
              <div>
                Game Finances Total: $
                {financialData.gameFinances
                  .reduce((sum, game) => sum + (Number(game.sum) || 0), 0)
                  .toFixed(2)}
              </div>
              <div>
                Total Expenses: $
                {financialData.expenses
                  .reduce(
                    (sum, expense) => sum + (Number(expense.amount) || 0),
                    0,
                  )
                  .toFixed(2)}
              </div>
              <div>Expected Cash: ${moneyBalance.toFixed(2)}</div>
            </div>

            <div className="add-financial-form-group">
              <label className="add-financial-label" htmlFor="cash">
                Actual Cash Count
              </label>
              <input
                type="number"
                id="cash"
                name="cash"
                value={financialData.cash}
                onChange={handleInputChange}
                className="add-financial-input"
                step="0.01"
                required
              />
              {financialData.cash > 0 && (
                <div
                  className={`add-financial-cash-difference ${financialData.cash < moneyBalance ? 'short' : financialData.cash > moneyBalance ? 'over' : 'balanced'}`}
                >
                  {financialData.cash < moneyBalance ? (
                    <span>
                      Short: ${(moneyBalance - financialData.cash).toFixed(2)}
                    </span>
                  ) : financialData.cash > moneyBalance ? (
                    <span>
                      Over: ${(financialData.cash - moneyBalance).toFixed(2)}
                    </span>
                  ) : (
                    <span>Balanced</span>
                  )}
                </div>
              )}
            </div>

            <div className="add-financial-form-group">
              <label className="add-financial-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                className="add-financial-textarea"
                id="notes"
                name="notes"
                value={financialData.notes}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="add-financial-btn add-financial-btn-submit"
        >
          Save Financial Record
        </button>
      </form>

      {/* Add PIN Modal */}
      {showPinModal && (
        <div className="add-financial-modal-overlay">
          <div className="add-financial-modal">
            <h3>Enter Staff PIN</h3>
            <form onSubmit={handlePinSubmit}>
              <div className="add-financial-form-group">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="add-financial-input"
                  placeholder="Enter your PIN"
                  maxLength="4"
                />
                {pinError && (
                  <div className="add-financial-error-message">{pinError}</div>
                )}
              </div>
              <div className="add-financial-modal-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false)
                    setPin('')
                    setPinError('')
                  }}
                  className="add-financial-btn add-financial-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="add-financial-btn add-financial-btn-submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditFinancial
