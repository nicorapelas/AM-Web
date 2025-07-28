import React, { useContext, useState, useCallback } from 'react'
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

  const handlePrint = useCallback(() => {
    // Sort financials by date, most recent first
    const sortedFinancials = [...storeFinancials].sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    // Filter financials based on active tab
    const filteredFinancials = filterFinancials(sortedFinancials)

    if (filteredFinancials.length === 0) {
      alert('No data to print')
      return
    }

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

    // Create print-friendly content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report</title>
          <style>
            @media print {
              body { margin: 0; padding: 10px; font-family: Arial, sans-serif; font-size: 10px; }
              .header { text-align: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px; }
              .header h1 { color: #333; margin: 0; font-size: 18px; }
              .header p { color: #666; margin: 5px 0 0 0; font-size: 11px; }
              .filter-info { margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 3px; }
              .filter-info h3 { margin: 0 0 5px 0; color: #333; font-size: 12px; }
              .filter-info p { margin: 2px 0; color: #666; font-size: 10px; }
              .summary-section { margin-bottom: 15px; }
              .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px; }
              .summary-item { padding: 8px; background: #f9f9f9; border-radius: 3px; text-align: center; }
              .summary-label { font-weight: bold; color: #666; font-size: 9px; display: block; margin-bottom: 3px; }
              .summary-value { font-size: 12px; font-weight: bold; }
              .money-in { color: #28a745; }
              .money-out { color: #dc3545; }
              .positive { color: #28a745; }
              .negative { color: #dc3545; }
              .commission-section { margin-bottom: 15px; }
              .commission-section h3 { color: #333; margin-bottom: 8px; font-size: 12px; }
              .rep-commission-card { border: 1px solid #ddd; margin-bottom: 8px; padding: 8px; border-radius: 3px; }
              .rep-commission-card h4 { margin: 0 0 5px 0; color: #333; font-size: 11px; }
              .rep-commission-games { margin-bottom: 5px; }
              .game-commission { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 9px; }
              .rep-commission-total { display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #eee; padding-top: 5px; font-size: 10px; }
              .commission-total-section { background: #f0f0f0; padding: 8px; border-radius: 3px; }
              .commission-total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; }
              .outstanding-loans-section { margin-bottom: 15px; }
              .outstanding-loans-section h3 { color: #333; margin-bottom: 8px; font-size: 12px; }
              .outstanding-loan-item { display: flex; justify-content: space-between; padding: 5px; border-bottom: 1px solid #eee; font-size: 9px; }
              .outstanding-amount { color: #dc3545; font-weight: bold; }
              .financials-table { margin-top: 15px; }
              .financials-table h3 { color: #333; margin-bottom: 8px; font-size: 12px; }
              .financial-record { border: 1px solid #ddd; margin-bottom: 8px; padding: 8px; border-radius: 3px; page-break-inside: avoid; }
              .financial-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #eee; }
              .financial-date { font-weight: bold; color: #333; font-size: 10px; }
              .financial-profit { font-weight: bold; font-size: 11px; }
              .financial-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 5px; }
              .financial-info { margin-bottom: 3px; }
              .info-label { font-weight: bold; color: #666; font-size: 8px; }
              .info-value { color: #333; font-size: 9px; }
              .game-finances { margin-top: 5px; }
              .game-finance-item { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid #f0f0f0; font-size: 8px; }
              .expenses-section { margin-top: 5px; }
              .expense-item { display: flex; justify-content: space-between; padding: 2px 0; font-size: 8px; }
              .cash-status { font-weight: bold; font-size: 9px; }
              .cash-status.over { color: #28a745; }
              .cash-status.short { color: #dc3545; }
              .cash-status.balanced { color: #17a2b8; }
              @page { margin: 0.5in; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Financial Report</h1>
              <p>Generated on ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
            </div>
            
            <div class="filter-info">
              <h3>Filter Information</h3>
              <p><strong>Filter Type:</strong> ${activeTab === 'week' ? 'Current Week' : activeTab === 'month' ? 'Current Month' : activeTab === 'custom' ? 'Selected Dates' : 'All Records'}</p>
              ${activeTab === 'custom' ? `<p><strong>Date Range:</strong> ${dateRange.start} to ${dateRange.end}</p>` : ''}
              <p><strong>Total Records:</strong> ${filteredFinancials.length}</p>
            </div>
            
            <div class="summary-section">
              <h3>Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Total Money In:</span>
                  <span class="summary-value money-in">${formatCurrency(totalMoneyIn)}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Expenses:</span>
                  <span class="summary-value money-out">${formatCurrency(totalMoneyOut)}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Total Profit:</span>
                  <span class="summary-value ${totalProfit >= 0 ? 'positive' : 'negative'}">${formatCurrency(totalProfit)}</span>
                </div>
              </div>
            </div>
            
            ${
              Object.keys(repCommissions).length > 0
                ? `
            <div class="commission-section">
              <h3>Commission Summary</h3>
              ${Object.entries(repCommissions)
                .map(
                  ([repName, data]) => `
                <div class="rep-commission-card">
                  <h4>${repName}</h4>
                  <div class="rep-commission-games">
                    ${Object.entries(data.games)
                      .map(
                        ([gameName, gameData]) => `
                      <div class="game-commission">
                        <span>${gameName} (${gameData.commission}%)</span>
                        <span>${formatCurrency(gameData.total)}</span>
                      </div>
                    `,
                      )
                      .join('')}
                  </div>
                  <div class="rep-commission-total">
                    <span>Total Commission:</span>
                    <span>${formatCurrency(data.total)}</span>
                  </div>
                </div>
              `,
                )
                .join('')}
              <div class="commission-total-section">
                <div class="commission-total-row">
                  <span>Total Commission Owed</span>
                  <span>${formatCurrency(totalCommission)}</span>
                </div>
              </div>
            </div>
            `
                : ''
            }
            
            ${
              outstandingLoans.length > 0
                ? `
            <div class="outstanding-loans-section">
              <h3>Outstanding Loans</h3>
              ${outstandingLoans
                .map(
                  (loan) => `
                <div class="outstanding-loan-item">
                  <span>${loan.staffName}</span>
                  <span class="outstanding-amount">${formatCurrency(loan.outstanding)}</span>
                </div>
              `,
                )
                .join('')}
            </div>
            `
                : ''
            }
            
            <div class="financials-table">
              <h3>Financial Records</h3>
              ${filteredFinancials
                .map((financial) => {
                  const difference =
                    financial.actualCashCount - financial.dailyProfit
                  const cashStatus =
                    Math.abs(difference) > 1
                      ? difference >= 0
                        ? 'over'
                        : 'short'
                      : 'balanced'
                  const cashStatusText =
                    Math.abs(difference) > 1
                      ? (difference >= 0 ? 'Over' : 'Short') +
                        ' by ' +
                        formatCurrency(Math.abs(difference))
                      : 'Balanced'

                  return `
                <div class="financial-record">
                  <div class="financial-header">
                    <div class="financial-date">${formatDate(financial.date)}</div>
                    <div class="financial-profit ${financial.dailyProfit >= 0 ? 'positive' : 'negative'}">${formatCurrency(financial.dailyProfit)}</div>
                  </div>
                  <div class="financial-details">
                    <div class="financial-info">
                      <div class="info-label">Created By:</div>
                      <div class="info-value">${financial.createdBy}</div>
                    </div>
                    <div class="financial-info">
                      <div class="info-label">Updated By:</div>
                      <div class="info-value">${financial.updatedBy || 'N/A'}</div>
                    </div>
                    <div class="financial-info">
                      <div class="info-label">Money In:</div>
                      <div class="info-value money-in">${formatCurrency(financial.totalMoneyIn)}</div>
                    </div>
                    <div class="financial-info">
                      <div class="info-label">Cash Count:</div>
                      <div class="info-value">${formatCurrency(financial.actualCashCount)}</div>
                    </div>
                    <div class="financial-info">
                      <div class="info-label">Cash Status:</div>
                      <div class="cash-status ${cashStatus}">${cashStatusText}</div>
                    </div>
                  </div>
                  ${
                    financial.gameFinances.length > 0
                      ? `
                  <div class="game-finances">
                    <div class="info-label">Game Finances:</div>
                    ${financial.gameFinances
                      .map(
                        (game) => `
                      <div class="game-finance-item">
                        <span>${game.gameName}</span>
                        <span class="${game.sum >= 0 ? 'money-in' : 'money-out'}">${formatCurrency(game.sum)}</span>
                      </div>
                    `,
                      )
                      .join('')}
                  </div>
                  `
                      : ''
                  }
                  ${
                    financial.expenses.length > 0
                      ? `
                  <div class="expenses-section">
                    <div class="info-label">Expenses:</div>
                    ${financial.expenses
                      .map(
                        (expense) => `
                      <div class="expense-item">
                        <span>${expense.description} (${expense.category})</span>
                        <span class="money-out">${formatCurrency(expense.amount)}</span>
                      </div>
                    `,
                      )
                      .join('')}
                  </div>
                  `
                      : ''
                  }
                  ${
                    financial.notes
                      ? `
                  <div class="financial-info">
                    <div class="info-label">Notes:</div>
                    <div class="info-value">${financial.notes}</div>
                  </div>
                  `
                      : ''
                  }
                </div>
              `
                })
                .join('')}
            </div>
          </body>
        </html>
      `

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
    }
  }, [
    storeFinancials,
    activeTab,
    dateRange,
    storeGames,
    storeStaff,
    filterFinancials,
    formatDate,
    formatCurrency,
  ])

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

        {/* Print Button */}
        {filteredFinancials.length > 0 && (
          <div className="financial-print-section">
            <button className="financial-print-btn" onClick={handlePrint}>
              🖨️ Print Report ({filteredFinancials.length} records)
            </button>
          </div>
        )}

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
