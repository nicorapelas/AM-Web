import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import LoaderFullScreen from '../../common/loaders/fullScreenLoader/LoaderFullScreen'
import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as FinancialContext } from '../../../context/FinancialsContext'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as StaffContext } from '../../../context/StaffContext'
import { Context as GamesContext } from '../../../context/GamesContext'
import './staffDashboard.css'

const StaffDashboard = () => {
  const navigate = useNavigate()
  const [showLoansModal, setShowLoansModal] = useState(false)
  const [pin, setPin] = useState('')
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [pinError, setPinError] = useState('')

  const {
    state: { user },
    signout,
  } = useContext(AuthContext)

  const {
    state: { loading, storeFinancials },
    setFinancialSelected,
    fetchStoreFinancials,
  } = useContext(FinancialContext)

  const {
    state: { userStores },
    fetchStore,
    setStoreSelected,
  } = useContext(StoresContext)

  const {
    state: { storeStaff },
    fetchStoreStaff,
  } = useContext(StaffContext)

  const { fetchStoreGames } = useContext(GamesContext)

  useEffect(() => {
    if (user) {
      const { staffCreds, staffStore } = user
      if (staffCreds) {
        fetchStore({ storeId: staffStore })
        fetchStoreFinancials({ storeId: staffStore })
        fetchStoreStaff({ storeId: staffStore })
        fetchStoreGames({ storeId: staffStore })
      }
    }
  }, [user])

  useEffect(() => {
    if (userStores) {
      setStoreSelected(userStores)
    }
  }, [userStores])

  const currentDate = format(new Date(), 'MMMM d, yyyy')
  const storeName = userStores.storeName || 'Store Name'

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const handleSignOut = async () => {
    await signout()
    navigate('/login')
  }

  const handleAddFinancial = () => {
    if (storeStaff && storeStaff.length > 0) {
      navigate('/add-financial')
    } else {
      console.warn('Staff data not yet loaded')
    }
  }

  const handleFinancialSelected = (financial) => {
    setFinancialSelected(financial)
    navigate(`/financial-detail`)
  }

  const handleLoansClick = () => {
    setShowLoansModal(true)
    setPin('')
    setPinError('')
    setSelectedStaff(null)
  }

  const handlePinSubmit = (e) => {
    e.preventDefault()
    const staff = storeStaff.find((s) => s.pin === pin)
    if (staff) {
      setSelectedStaff(staff)
      setPinError('')
    } else {
      setPinError('Invalid PIN')
    }
  }

  const handleCloseLoansModal = () => {
    setShowLoansModal(false)
    setPin('')
    setPinError('')
    setSelectedStaff(null)
  }

  const hasActiveLoans = () => {
    if (!storeStaff) return false
    return storeStaff.some(
      (staff) => staff.loan && staff.loan.status === 'active',
    )
  }

  const renderLoansModal = () => {
    if (!showLoansModal) return null

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Check Loans</h3>
          {!selectedStaff ? (
            <form onSubmit={handlePinSubmit} className="pin-form">
              <div className="form-group">
                <label htmlFor="pin">Enter PIN:</label>
                <input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength="4"
                  required
                />
                {pinError && <div className="error-message">{pinError}</div>}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseLoansModal}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Check
                </button>
              </div>
            </form>
          ) : (
            <div className="loan-details">
              {selectedStaff.loan && selectedStaff.loan.status === 'active' ? (
                <>
                  <div className="loan-info">
                    <div className="loan-info-item">
                      <span className="label">Staff:</span>
                      <span className="value">
                        {selectedStaff.firstName} {selectedStaff.lastName}
                      </span>
                    </div>
                    <div className="loan-info-item">
                      <span className="label">Amount:</span>
                      <span className="value">
                        {formatCurrency(selectedStaff.loan.amount)}
                      </span>
                    </div>
                    <div className="loan-info-item">
                      <span className="label">Outstanding:</span>
                      <span className="value outstanding">
                        {formatCurrency(
                          selectedStaff.loan.amount -
                            selectedStaff.loan.payments.reduce(
                              (sum, payment) => sum + payment.amount,
                              0,
                            ),
                        )}
                      </span>
                    </div>
                    <div className="loan-info-item">
                      <span className="label">Due Date:</span>
                      <span className="value">
                        {format(
                          new Date(selectedStaff.loan.dueDate),
                          'MMMM d, yyyy',
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button
                      className="close-btn"
                      onClick={handleCloseLoansModal}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="no-loan-message">
                    No active loans found for {selectedStaff.firstName}{' '}
                    {selectedStaff.lastName}
                  </p>
                  <div className="modal-actions">
                    <button
                      className="close-btn"
                      onClick={handleCloseLoansModal}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading || !storeStaff) {
    return <LoaderFullScreen />
  }

  return (
    <div className="staff-dashboard-container">
      <div className="staff-dashboard-stars-background" />
      <div className="staff-dashboard-header">
        <div className="staff-dashboard-header-content">
          <div className="staff-dashboard-date">{currentDate}</div>
          <h1 className="staff-dashboard-store-name">{storeName}</h1>
          <button className="nav-signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="staff-dashboard-actions">
        <button
          className="staff-dashboard-nav-button staff-dashboard-add-financial-btn"
          onClick={handleAddFinancial}
        >
          Add Financial Entry
        </button>
        <button
          className="staff-dashboard-nav-button staff-dashboard-loans-btn"
          onClick={handleLoansClick}
        >
          Check Loans
          {hasActiveLoans() && <div className="loan-notification" />}
        </button>
      </div>

      <div className="staff-dashboard-financials-container">
        <div className="staff-dashboard-financials-title">
          Recent Financial Entries
        </div>
        <div className="staff-dashboard-financials-list">
          {storeFinancials.map((financial, index) => {
            return (
              <div key={index} className="staff-dashboard-financial-item">
                <div className="staff-dashboard-financial-date">
                  {format(new Date(financial.date), 'MMMM d, yyyy')}
                </div>
                <div className="staff-dashboard-financial-details">
                  <span data-label="Daily Profit:">
                    Profit: {formatCurrency(financial.dailyProfit)}
                  </span>
                  -
                  <span data-label="Created By:">
                    Created By: {financial.createdBy}
                  </span>
                </div>
                <button
                  className="staff-dashboard-details-btn"
                  onClick={() => handleFinancialSelected(financial)}
                >
                  Details
                </button>
              </div>
            )
          })}
        </div>
      </div>
      {renderLoansModal()}
    </div>
  )
}

export default StaffDashboard
