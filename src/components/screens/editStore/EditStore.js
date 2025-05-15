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
    state: { loading, storeToEdit },
    editStore,
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

  const handleSubmit = (e) => {
    e.preventDefault()
    editStore(formData)
    navigate('/stores')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="add-store-container">
      <ReRoutes />
      <div className="stars-background"></div>
      <Header />
      <form className="store-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="storeName">Store Name</label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="add-store-notes"
            />
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditStore
