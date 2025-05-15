import React, { useState, useContext } from 'react'
import { Context as StoresContext } from '../../../context/StoresContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import BackButton from '../../common/backButton/BackButton'
import Header from '../../common/header/Header'
import './addStore.css'

const AddStore = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    manager: '',
    phone: '',
  })

  const {
    state: { loading },
    createStore,
  } = useContext(StoresContext)

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
    await createStore(formData)
    navigate('/stores')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="add-store-container">
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
            Add Store
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStore
