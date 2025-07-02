import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as StoresContext } from '../../../context/StoresContext'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import BackButton from '../../common/backButton/BackButton'
import Header from '../../common/header/Header'
import './stores.css'

const Stores = () => {
  const navigate = useNavigate()

  const {
    state: { loading, userStores },
    setStoreToEdit,
    setStoreSelected,
    deleteStore,
  } = useContext(StoresContext)

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState(null)

  const handleDeleteStore = (store) => {
    setStoreToDelete(store)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirmation = (e) => {
    e.preventDefault()
    deleteStore({ storeId: storeToDelete._id })
    setShowDeleteConfirmation(false)
    setStoreToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
    setStoreToDelete(null)
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />
    }

    const handleStoreDetails = (store) => {
      setStoreSelected(store)
      navigate('/store-details')
    }

    if (!userStores || userStores.length === 0) {
      return (
        <div className="no-stores-container">
          <div className="stars-background"></div>
          <div className="no-stores-content">
            <BackButton to="/dashboard" />
            <div className="message-box">
              <div className="card-star"></div>
              <h1>No Arcade Locations Found</h1>
              <p>Get started by adding your first arcade location!</p>
              <button
                className="add-store-btn"
                onClick={() => navigate('/add-store')}
              >
                + Add New Store
              </button>
            </div>
          </div>
        </div>
      )
    }

    const handleEditStore = (store) => {
      setStoreToEdit(store)
      navigate('/edit-store')
    }

    return (
      <div className="stores-container">
        <div className="stars-background"></div>
        <Header />
        <div className="stores-grid">
          {userStores.map((store) => (
            <div key={store._id} className="store-card">
              <div className="card-star"></div>
              {showDeleteConfirmation && storeToDelete?._id === store._id && (
                <div className="delete-confirmation">
                  <p className="delete-warning">
                    Are you sure you want to delete "{store.storeName}"?
                  </p>
                  {store.subscriptionId && (
                    <div className="paypal-warning">
                      <p>
                        ⚠️ This store has an active PayPal subscription that
                        will be cancelled.
                      </p>
                      <p>Subscription ID: {store.subscriptionId}</p>
                    </div>
                  )}
                  <div className="delete-buttons">
                    <button
                      onClick={handleDeleteConfirmation}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                    <button onClick={handleCancelDelete} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <h2 className="store-name">{store.storeName}</h2>
              <div className="store-details">
                <p>
                  <span>📍</span> {store.address}
                </p>
                <p>
                  <span>👤</span> {store.username}
                </p>
                <p>
                  <span>🔑</span> {store.password}
                </p>
                <p className="store-notes">
                  <span className="note-icon">📝</span>
                  <span className="note-text">{store.notes}</span>
                </p>
                <div
                  className={`status-badge ${store.isActive ? 'active' : 'inactive'}`}
                >
                  {store.isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="action-btn edit"
                  onClick={() => handleEditStore(store)}
                >
                  Edit
                </button>
                <button
                  className="action-btn view"
                  onClick={() => handleStoreDetails(store)}
                >
                  View Details
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteStore(store)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return renderContent()
}

export default Stores
