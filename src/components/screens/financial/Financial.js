import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as FinancialContext } from '../../../context/FinancialsContext'
import { Context as GameContext } from '../../../context/GamesContext'
import { Context as StaffContext } from '../../../context/StaffContext'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import BackButton from '../../common/backButton/BackButton'
import Header from '../../common/header/Header'
import ReRoutes from '../../common/functions/ReRoutes'
import './financial.css'

const Financial = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const {
    state: { loading, storeFinancials },
  } = useContext(FinancialContext)

  const {
    state: { storeStaff },
  } = useContext(StaffContext)

  const {
    state: { storeGames },
  } = useContext(GameContext)

  console.log('storeFinancials', storeFinancials)

  const { setFinancialSelected } = useContext(FinancialContext)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleFinancialSelected = (financial) => {
    setFinancialSelected(financial)
    navigate(`/financial-detail`)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab !== 'custom') {
      setDateRange({ start: '', end: '' })
    }
  }

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const filterFinancials = (financials) => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    startOfMonth.setHours(0, 0, 0, 0)

    switch (activeTab) {
      case 'week':
        return financials.filter((f) => {
          const recordDate = new Date(f.date)
          recordDate.setHours(0, 0, 0, 0)
          return recordDate >= startOfWeek
        })
      case 'month':
        return financials.filter((f) => {
          const recordDate = new Date(f.date)
          recordDate.setHours(0, 0, 0, 0)
          return recordDate >= startOfMonth
        })
      case 'custom':
        if (!dateRange.start || !dateRange.end) return financials
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        return financials.filter((f) => {
          const recordDate = new Date(f.date)
          recordDate.setHours(0, 0, 0, 0)
          return recordDate >= startDate && recordDate <= endDate
        })
      default:
        return financials
    }
  }

  const renderTabs = () => {
    return (
      <div className="financial-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All
        </button>
        <button
          className={`tab-btn ${activeTab === 'month' ? 'active' : ''}`}
          onClick={() => handleTabChange('month')}
        >
          Current Month
        </button>
        <button
          className={`tab-btn ${activeTab === 'week' ? 'active' : ''}`}
          onClick={() => handleTabChange('week')}
        >
          Current Week
        </button>
        <button
          className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => handleTabChange('custom')}
        >
          Select Dates
        </button>
      </div>
    )
  }

  const renderDateRangeSelector = () => {
    if (activeTab !== 'custom') return null

    return (
      <div className="date-range-selector">
        <div className="date-input-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="date-input-group">
          <label>End Date:</label>
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />
    }
    if (!storeFinancials || storeFinancials.length === 0) {
      return (
        <div className="no-financials-container">
          <ReRoutes />
          <div className="stars-background"></div>
          <div className="no-financials-content">
            <BackButton to="/store-details" />
            <div className="message-box">
              <div className="card-star"></div>
              <h1>No Financial Records Found</h1>
              <p>Get started by adding your first financial record!</p>
              <button
                className="add-financial-btn"
                onClick={() => navigate('/add-financial')}
              >
                + Add Financial Record
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Calculate outstanding loans
    const outstandingLoans = storeStaff
      .filter((staff) => staff.loan && staff.loan.status === 'active')
      .map((staff) => {
        const totalPayments = staff.loan.payments.reduce(
          (sum, payment) => sum + payment.amount,
          0,
        )
        return {
          staffName: `${staff.firstName} ${staff.lastName}`,
          amount: staff.loan.amount,
          outstanding: staff.loan.amount - totalPayments,
          dueDate: staff.loan.dueDate,
        }
      })

    // Sort financials by date, most recent first
    const sortedFinancials = [...storeFinancials].sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    // Filter financials based on active tab
    const filteredFinancials = filterFinancials(sortedFinancials)
    // Calculate totals for filtered records
    const totalProfit = filteredFinancials.reduce(
      (sum, financial) => sum + financial.dailyProfit,
      0,
    )
    const totalMoneyIn = filteredFinancials.reduce(
      (sum, financial) => sum + financial.totalMoneyIn,
      0,
    )
    const totalMoneyOut = filteredFinancials.reduce(
      (sum, financial) => sum + financial.totalMoneyOut,
      0,
    )

    // Calculate commissions
    const calculateCommissions = () => {
      const repCommissions = {}

      filteredFinancials.forEach((financial) => {
        financial.gameFinances.forEach((gameFinance) => {
          const game = storeGames.find((g) => g._id === gameFinance.gameId)
          if (game) {
            const commission = (gameFinance.sum * game.commission) / 100
            if (!repCommissions[game.repName]) {
              repCommissions[game.repName] = {
                total: 0,
                games: {},
              }
            }
            if (!repCommissions[game.repName].games[game.gameName]) {
              repCommissions[game.repName].games[game.gameName] = {
                total: 0,
                commission: game.commission,
              }
            }
            repCommissions[game.repName].games[game.gameName].total +=
              commission
            repCommissions[game.repName].total += commission
          }
        })
      })

      return repCommissions
    }

    const repCommissions = calculateCommissions()

    const totalCommission = Object.values(repCommissions).reduce(
      (sum, data) => sum + data.total,
      0,
    )

    return (
      <div className="financials-container">
        <div className="stars-background"></div>
        <Header />
        {renderTabs()}
        {renderDateRangeSelector()}
        <div className="financial-summary">
          <div className="summary-item">
            <span className="summary-label">Total Money In:</span>
            <span className="summary-value money-in">
              {formatCurrency(totalMoneyIn)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Expenses:</span>
            <span className="summary-value money-out">
              {formatCurrency(totalMoneyOut)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Profit:</span>
            <span
              className={`summary-value ${totalProfit >= 0 ? 'positive' : 'negative'}`}
            >
              {formatCurrency(totalProfit)}
            </span>
          </div>
        </div>

        {/* Commission Section */}
        <div className="commission-section">
          <h3>Commission Summary</h3>
          {Object.entries(repCommissions).map(([repName, data]) => (
            <div key={repName} className="rep-commission-card">
              <h4>{repName}</h4>
              <div className="rep-commission-games">
                {Object.entries(data.games).map(([gameName, gameData]) => (
                  <div key={gameName} className="game-commission">
                    <span>
                      {gameName} ({gameData.commission}%)
                    </span>
                    <span>{formatCurrency(gameData.total)}</span>
                  </div>
                ))}
              </div>
              <div className="rep-commission-total">
                <span>Total Commission:</span>
                <span>{formatCurrency(data.total)}</span>
              </div>
            </div>
          ))}
          <div className="commission-total-section">
            <div className="commission-total-row">
              <span>Total Commission Owed</span>
              <span>{formatCurrency(totalCommission)}</span>
            </div>
          </div>
        </div>

        {outstandingLoans.length > 0 && (
          <div className="outstanding-loans-section">
            <h3>Outstanding Loans</h3>
            <div className="outstanding-loans-list">
              {outstandingLoans.map((loan, index) => (
                <div key={index} className="outstanding-loan-item">
                  <span>{loan.staffName}</span>
                  <span className="outstanding-amount">
                    {formatCurrency(loan.outstanding)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="financials-table">
          <div className="table-header">
            <div className="financial-table-header">Date</div>
            <div className="financial-table-header">Created By</div>
            <div className="financial-table-header">Updated By</div>
            <div className="financial-table-header">Money In</div>
            <div className="financial-table-header">Balance</div>
            <div className="financial-table-header">Info</div>
          </div>

          {filteredFinancials.map((financial) => {
            const difference = financial.actualCashCount - financial.dailyProfit
            return (
              <div key={financial._id} className="table-row">
                <div className="financial-table-cell">
                  <span className="cell-label">Date:</span>
                  {formatDate(financial.date)}
                </div>
                <div className="financial-table-cell money-out">
                  <span className="cell-label">Created By:</span>
                  {financial.createdBy}
                </div>
                <div className="financial-table-cell money-out">
                  <span className="cell-label">Updated By:</span>
                  {financial.updatedBy || 'N/A'}
                </div>
                <div className="financial-table-cell money-in">
                  <span className="cell-label">Money In:</span>
                  {formatCurrency(financial.totalMoneyIn)}
                </div>
                <div className="financial-table-cell balance">
                  <span className="cell-label">Profit:</span>
                  {formatCurrency(financial.dailyProfit)}
                </div>
                <div className="financial-table-cell actions">
                  <button
                    className={`info-btn ${Math.abs(difference) > 1 ? 'flash' : ''} ${
                      Math.abs(difference) > 1 && difference >= 0 ? 'over' : ''
                    }`}
                    onClick={() => handleFinancialSelected(financial)}
                    title={`${
                      Math.abs(difference) > 1
                        ? (difference >= 0 ? 'Over' : 'Short') +
                          ' by ' +
                          formatCurrency(Math.abs(difference))
                        : 'View Details'
                    }`}
                  >
                    i
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return renderContent()
}

export default Financial
