import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as FinancialsContext } from '../../../context/FinancialsContext'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as AuthContext } from '../../../context/AuthContext'
import Header from '../../common/header/Header'
import './financialDetail.css'

const FinancialDetail = () => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const {
    state: { financialSelected },
    setFinancialToEdit,
    deleteFinancial,
  } = useContext(FinancialsContext)

  const {
    state: { userStores },
  } = useContext(StoresContext)

  const {
    state: { user },
  } = useContext(AuthContext)

  useEffect(() => {
    if (!userStores || userStores.length === 0) {
      navigate('/dashboard')
    }
  }, [userStores])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleEditFinancial = () => {
    setFinancialToEdit(financialSelected)
    navigate(`/edit-financial`)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteFinancial({ _id: financialSelected._id })
      navigate('/financials')
    } catch (error) {
      console.error('Error deleting financial record:', error)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  if (!financialSelected) {
    return <div>Loading...</div>
  }

  const renderDeleteModal = () => {
    if (!showDeleteModal) return null

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this financial record?</p>
          <p className="modal-date">{formatDate(financialSelected.date)}</p>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={handleCancelDelete}>
              Cancel
            </button>
            <button className="delete-btn" onClick={handleConfirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className="financial-detail-container">
        <div className="financial-detail-stars-bg" />
        <Header />
        <div className="financial-detail-card">
          <div className="card-star" />
          <section className="card-section">
            <h2>Daily Summary - {formatDate(financialSelected.date)}</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <label>Total Money In</label>
                <span className="money-in">
                  {formatCurrency(financialSelected.totalMoneyIn)}
                </span>
              </div>
              <div className="summary-item">
                <label>Total Money Out</label>
                <span className="money-out">
                  {formatCurrency(financialSelected.totalMoneyOut)}
                </span>
              </div>
              <div className="summary-item">
                <label>Daily Profit</label>
                <span className="profit">
                  {formatCurrency(financialSelected.dailyProfit)}
                </span>
              </div>
              <div className="summary-item">
                <label>Actual Cash Count</label>
                <span className="balance">
                  {formatCurrency(financialSelected.actualCashCount)}
                </span>
              </div>
              <div className="summary-item">
                <label>Cash Status</label>
                <span
                  className={`${Math.abs(financialSelected.actualCashCount - financialSelected.dailyProfit) > 1 ? (financialSelected.actualCashCount - financialSelected.dailyProfit >= 0 ? 'money-in' : 'money-out') : ''} ${Math.abs(financialSelected.actualCashCount - financialSelected.dailyProfit) > 1 ? 'flash-animation' : ''}`}
                >
                  {Math.abs(
                    financialSelected.actualCashCount -
                      financialSelected.dailyProfit,
                  ) > 1 ? (
                    <>
                      {financialSelected.actualCashCount -
                        financialSelected.dailyProfit >=
                      0
                        ? 'Over'
                        : 'Short'}{' '}
                      by{' '}
                      {formatCurrency(
                        Math.abs(
                          financialSelected.actualCashCount -
                            financialSelected.dailyProfit,
                        ),
                      )}
                    </>
                  ) : (
                    'Balanced'
                  )}
                </span>
              </div>
            </div>
          </section>

          <section className="card-section">
            <h2>Game Finances</h2>
            <div className="finance-grid">
              {financialSelected.gameFinances.map((game) => (
                <div key={game._id} className="game-finance-item">
                  <h3>{game.gameName}</h3>
                  <div className="game-finance-details">
                    <div className="game-finance-row">
                      <label>Sum:</label>
                      <span
                        className={game.sum >= 0 ? 'money-in' : 'money-out'}
                      >
                        {formatCurrency(game.sum)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card-section">
            <h2>Expenses</h2>
            <div className="expenses-grid">
              {financialSelected.expenses.map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-header">
                    <h3>{expense.description}</h3>
                    <span className="expense-category">{expense.category}</span>
                  </div>
                  <div className="expense-amount money-out">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
              <div className="expense-total">
                <label>Total Expenses:</label>
                <span className="money-out">
                  {formatCurrency(
                    financialSelected.expenses.reduce(
                      (sum, exp) => sum + exp.amount,
                      0,
                    ),
                  )}
                </span>
              </div>
            </div>
          </section>

          {financialSelected.notes && (
            <section className="card-section">
              <h2>Notes</h2>
              <p className="notes-content">{financialSelected.notes}</p>
            </section>
          )}
          {user?.bossCreds && (
            <div className="detail-actions">
              <button className="delete-btn" onClick={handleDeleteClick}>
                Delete Record
              </button>
              <button className="edit-btn" onClick={handleEditFinancial}>
                Edit Record
              </button>
            </div>
          )}
        </div>
        {renderDeleteModal()}
      </div>
    )
  }

  return renderContent()
}

export default FinancialDetail
