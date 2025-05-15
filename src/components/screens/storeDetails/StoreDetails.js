import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as FinancialsContext } from '../../../context/FinancialsContext'
import { Context as GamesContext } from '../../../context/GamesContext'
import { Context as StaffContext } from '../../../context/StaffContext'
import Header from '../../common/header/Header'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import BackButton from '../../common/backButton/BackButton'
import ReRoutes from '../../common/functions/ReRoutes'
import './storeDetails.css'

const StoreDetails = () => {
  const navigate = useNavigate()
  const {
    state: { loading, storeSelected },
    setStoreToEdit,
    deleteStore,
  } = useContext(StoresContext)

  const {
    state: { storeFinancials },
    fetchStoreFinancials,
  } = useContext(FinancialsContext)

  const {
    state: { storeGames },
    fetchStoreGames,
  } = useContext(GamesContext)

  const {
    state: { storeStaff },
    fetchStoreStaff,
  } = useContext(StaffContext)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (storeSelected) {
      fetchStoreFinancials({ storeId: storeSelected._id })
      fetchStoreGames({ storeId: storeSelected._id })
      fetchStoreStaff({ storeId: storeSelected._id })
    }
  }, [storeSelected])

  const handleEditStore = (store) => {
    setStoreToEdit(store)
    navigate('/edit-store')
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    await deleteStore({ _id: storeSelected._id })
    setShowDeleteConfirm(false)
    navigate('/stores')
  }

  const renderRecentDaily = () => {
    if (!storeFinancials || storeFinancials.length === 0) {
      return {
        totalMoneyIn: 0,
        totalMoneyOut: 0,
        dailyProfit: 0,
        moneyBalance: 0,
      }
    }

    // Sort financials by date in descending order and get the most recent
    const mostRecent = storeFinancials.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    )[0]

    return {
      totalMoneyIn: mostRecent.totalMoneyIn,
      totalMoneyOut: mostRecent.totalMoneyOut,
      dailyProfit: mostRecent.dailyProfit,
      moneyBalance: mostRecent.moneyBalance,
    }
  }

  const renderDeleteConfirm = () => {
    return (
      <div className="delete-confirm-modal">
        <div className="modal-content">
          <div className="card-star"></div>
          <h2>Delete Store</h2>
          <p>Are you sure you want to delete "{storeSelected?.storeName}"?</p>
          <p className="warning-text">This action cannot be undone.</p>
          <div className="modal-actions">
            <button
              className="cancel-btn"
              onClick={() => setShowDeleteConfirm(false)}
            >
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
    if (loading) {
      return <LoadingSpinner />
    }

    if (!storeSelected) {
      return (
        <div className="no-store-container">
          <ReRoutes />
          <div className="stars-background"></div>
          <BackButton to="/stores" />
          <h1>Store not found</h1>
        </div>
      )
    }

    const recentFinancials = renderRecentDaily()

    return (
      <div className="store-details-container">
        {showDeleteConfirm && renderDeleteConfirm()}
        <div className="stars-background"></div>
        <Header />
        <div className="store-details-grid">
          <div className="details-card info-section">
            <div className="card-star"></div>
            <h2 className="section-title">Store Information</h2>
            <div className="info-content">
              <p>
                <span className="label">📍 Address:</span>
                {storeSelected.address}
              </p>
              <p>
                <span className="label">👤 Username:</span>
                {storeSelected.username}
              </p>
              <p>
                <span className="label">🔑 Password:</span>
                {storeSelected.password}
              </p>
              <p className="store-notes">
                <span className="label">📝 Notes:</span>
                <span className="note-text">{storeSelected.notes}</span>
              </p>
            </div>
          </div>

          <div className="details-card financials-section">
            <div className="card-star"></div>
            <h2 className="section-title">Financials</h2>
            <span className="stat-label">Most recent</span>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Money In</span>
                <span className="stat-value">
                  $
                  {recentFinancials.totalMoneyIn.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Money Out</span>
                <span className="stat-value">
                  $
                  {recentFinancials.totalMoneyOut.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Daily Profit</span>
                <span className="stat-value">
                  $
                  {recentFinancials.dailyProfit.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="financials-actions">
              <button
                className="action-btn view-financials"
                onClick={() => navigate(`/financials`)}
              >
                View Financial Records
              </button>
            </div>
          </div>

          <div className="details-card games-section">
            <div className="card-star"></div>
            <h2 className="section-title">Games</h2>
            <div className="games-preview">
              <div className="games-stats">
                <div className="game-stat">
                  <span className="stat-label">Total Games</span>
                  <span className="stat-value">{storeGames.length || 0}</span>
                </div>
                <div className="game-stat">
                  <span className="stat-label">Active Games</span>
                  <span className="stat-value">
                    {storeGames.filter((game) => game.isActive).length || 0}
                  </span>
                </div>
              </div>
              <div className="games-actions">
                <button
                  className="action-btn view-games"
                  onClick={() => navigate(`/games`)}
                >
                  View All Games
                </button>
              </div>
            </div>
          </div>

          {/* <div className="details-card staff-section">
            <div className="card-star"></div>
            <h2 className="section-title">Staff</h2>
            <div className="staff-preview">
              <div className="staff-stats">
                <div className="staff-stat">
                  <span className="stat-label">Total Staff</span>
                  <span className="stat-value">0</span>
                </div>
                <div className="staff-stat">
                  <span className="stat-label">Active Staff</span>
                  <span className="stat-value">0</span>
                </div>
                <div className="staff-stat">
                  <span className="stat-label">On Shift</span>
                  <span className="stat-value">0</span>
                </div>
              </div>
              <div className="staff-actions">
                <button
                  className="action-btn view-staff"
                  onClick={() => navigate(`/staff`)}
                >
                  View All Staff
                </button>
              </div>
            </div>
          </div> */}

          <div className="details-card staff-section">
            <div className="card-star"></div>
            <h2 className="section-title">Staff</h2>
            <div className="staff-preview">
              <div className="staff-stats">
                <div className="staff-stat">
                  <span className="stat-label">Total Staff</span>
                  <span className="stat-value">{storeStaff.length || 0}</span>
                </div>
                <div className="staff-stat">
                  <span className="stat-label">Active Staff</span>
                  <span className="stat-value">
                    {storeStaff.filter((staff) => staff.isActive).length || 0}
                  </span>
                </div>
                <div className="staff-stat">
                  <span className="stat-label">Managers</span>
                  <span className="stat-value">
                    {storeStaff.filter((staff) => staff.position === 'Manager')
                      .length || 0}
                  </span>
                </div>
              </div>
              <div className="staff-actions">
                <button
                  className="action-btn view-staff"
                  onClick={() => navigate(`/staff`)}
                >
                  View All Staff
                </button>
              </div>
            </div>
          </div>

          <div className="details-card actions-section">
            <div className="card-star"></div>
            <h2 className="section-title">Actions</h2>
            <div className="action-buttons">
              <button
                className="action-btn edit"
                onClick={() => handleEditStore(storeSelected)}
              >
                Edit Store
              </button>
              <button className="action-btn delete" onClick={handleDeleteClick}>
                Delete Store
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return renderContent()
}

export default StoreDetails
