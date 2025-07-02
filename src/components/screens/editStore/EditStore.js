import React, { useState, useContext, useEffect } from 'react'
import { Context as StoresContext } from '../../../context/StoresContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import Header from '../../common/header/Header'
import ReRoutes from '../../common/functions/ReRoutes'
import '../addStore/addStore.css'

const EditStore = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    notes: '',
  })

  const {
    state: { loading, storeToEdit, error, userStores },
    editStore,
    setError,
  } = useContext(StoresContext)

  useEffect(() => {
    if (storeToEdit) {
      setFormData(storeToEdit)
    }
  }, [storeToEdit])

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Check if the store name is unique
    const existingStore = userStores.find(
      (store) => store.storeName === formData.storeName,
    )
    if (existingStore) {
      setError(
        'A store with this name already exists. Please choose a different name.',
      )
      return
    } else {
      editStore(formData)
      navigate('/stores')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="add-store-container">
      <ReRoutes />
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
          <button type="submit" className="add-store-submit-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditStore
