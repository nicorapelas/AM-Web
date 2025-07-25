import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as FinancialsContext } from '../../../context/FinancialsContext'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as StaffContext } from '../../../context/StaffContext'
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

  const {
    state: { storeStaff },
  } = useContext(StaffContext)

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
      <div className="financial-detail-modal-overlay">
        <div className="financial-detail-modal-content">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this financial record?</p>
          <p className="financial-detail-modal-date">
            {formatDate(financialSelected.date)}
          </p>
          <div className="financial-detail-modal-actions">
            <button
              className="financial-detail-cancel-btn"
              onClick={handleCancelDelete}
            >
              Cancel
            </button>
            <button
              className="financial-detail-delete-btn"
              onClick={handleConfirmDelete}
            >
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
          <div className="financial-detail-card-star" />
          <section className="financial-detail-card-section">
            <h2>Daily Summary - {formatDate(financialSelected.date)}</h2>
            <div className="financial-detail-summary-grid">
              <div className="financial-detail-summary-item">
                <label>Total Money In</label>
                <span className="financial-detail-money-in">
                  {formatCurrency(financialSelected.totalMoneyIn)}
                </span>
              </div>
              <div className="financial-detail-summary-item">
                <label>Expenses</label>
                <span className="financial-detail-money-out">
                  {formatCurrency(financialSelected.totalMoneyOut)}
                </span>
              </div>
              <div className="financial-detail-summary-item">
                <label>Daily Profit</label>
                <span className="financial-detail-profit">
                  {formatCurrency(financialSelected.dailyProfit)}
                </span>
              </div>
              <div className="financial-detail-summary-item">
                <label>Actual Cash Count</label>
                <span className="financial-detail-balance">
                  {formatCurrency(financialSelected.actualCashCount)}
                </span>
              </div>
              <div className="financial-detail-summary-item">
                <label>Cash Status</label>
                <span
                  className={`${Math.abs(financialSelected.actualCashCount - financialSelected.dailyProfit) > 1 ? (financialSelected.actualCashCount - financialSelected.dailyProfit >= 0 ? 'financial-detail-money-in' : 'financial-detail-money-out') : ''} ${Math.abs(financialSelected.actualCashCount - financialSelected.dailyProfit) > 1 ? 'financial-detail-flash-animation' : ''}`}
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

          <section className="financial-detail-card-section">
            <h2>Game Finances</h2>
            <div className="financial-detail-finance-grid">
              {financialSelected.gameFinances.map((game) => (
                <div
                  key={game._id}
                  className="financial-detail-game-finance-item"
                >
                  <h3>{game.gameName}</h3>
                  <div className="financial-detail-game-finance-details">
                    <div className="financial-detail-game-finance-row">
                      <label>Sum:</label>
                      <span
                        className={
                          game.sum >= 0
                            ? 'financial-detail-money-in'
                            : 'financial-detail-money-out'
                        }
                      >
                        {formatCurrency(game.sum)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="financial-detail-card-section">
            <h2>Expenses</h2>
            <div className="financial-detail-expenses-grid">
              {financialSelected.expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="financial-detail-expense-item"
                >
                  <div className="financial-detail-expense-header">
                    <h3>{expense.description}</h3>
                    <span className="financial-detail-expense-category">
                      {expense.category}
                    </span>
                  </div>
                  <div className="financial-detail-expense-amount financial-detail-money-out">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
              <div className="financial-detail-expense-total">
                <label>Total Expenses:</label>
                <span className="financial-detail-money-out">
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
            <section className="financial-detail-card-section">
              <h2>Notes</h2>
              <p className="financial-detail-notes-content">
                {financialSelected.notes}
              </p>
            </section>
          )}
          {(user?.bossCreds ||
            (storeStaff &&
              storeStaff.find((staff) => staff.username === user?.username)
                ?.editFinancialEnabled)) && (
            <div className="financial-detail-actions">
              {(user?.bossCreds ||
                (storeStaff &&
                  storeStaff.find((staff) => staff.username === user?.username)
                    ?.deleteFinancialEnabled)) && (
                <button
                  className="financial-detail-delete-btn"
                  onClick={handleDeleteClick}
                >
                  Delete Record
                </button>
              )}
              <button
                className="financial-detail-edit-btn"
                onClick={handleEditFinancial}
              >
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
