import React, { useState, useContext, useEffect } from 'react'
import { Context as StoresContext } from '../../../context/StoresContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import Header from '../../common/header/Header'
import './addStore.css'

const AddStore = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    manager: '',
    phone: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    state: { loading, userStores, error },
    createStore,
    setNewStoreToAdd,
    setError,
  } = useContext(StoresContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, setError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) {
      return // Prevent multiple submissions
    }

    setIsSubmitting(true)

    try {
      if (userStores.length === 0) {
        // First store - create directly
        const staffCredentials = await createStore(formData)
        if (staffCredentials) {
          // Wait a bit for state to settle before navigation
          setTimeout(() => {
            navigate('/stores')
          }, 100)
        }
        return
      }

      // Check if the store name is unique
      const existingStore = userStores.find(
        (store) => store.storeName === formData.storeName,
      )
      if (existingStore) {
        setError(
          'A store with this name already exists. Please choose a different name.',
        )
        return
      }

      // Multiple stores - redirect to billing
      if (userStores.length > 0) {
        setNewStoreToAdd(formData)
        navigate('/billing')
      }
    } catch (error) {
      console.error('Error creating store:', error)
      setError('An error occurred while creating the store. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="add-store-container">
      <div className="add-store-stars"></div>
      <Header />

      <form className="add-store-form" onSubmit={handleSubmit}>
        <div className="add-store-form-group">
          <label className="add-store-label" htmlFor="storeName">
            Store Name
          </label>
          <input
            className="add-store-input"
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="add-store-form-group">
          <label className="add-store-label" htmlFor="address">
            Address
          </label>
          <input
            className="add-store-input"
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="add-store-form-row">
          <div className="add-store-form-group">
            <label className="add-store-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              className="add-store-textarea"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="add-store-button-container">
          <button
            type="submit"
            className="add-store-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Store...' : 'Add Store'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStore
