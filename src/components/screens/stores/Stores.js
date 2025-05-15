import React, { useContext } from 'react'
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
  } = useContext(StoresContext)

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
