import React, { useState, useContext } from 'react'
import { Context as GamesContext } from '../../../context/GamesContext'
import { Context as StoresContext } from '../../../context/StoresContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import Header from '../../common/header/Header'
import '../addStore/addStore.css'

const AddGame = () => {
  const {
    state: { loading },
    createGame,
  } = useContext(GamesContext)

  const {
    state: { storeSelected },
  } = useContext(StoresContext)

  const [formData, setFormData] = useState({
    storeId: storeSelected._id,
    gameName: '',
    quantity: '',
    commission: '',
    repName: '',
    repPhone: '',
  })

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
    // Handle form submission here
    createGame(formData)
    navigate('/games')
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
          <label htmlFor="gameName">Game Name</label>
          <input
            type="text"
            id="gameName"
            name="gameName"
            value={formData.gameName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="commission">Commission</label>
            <input
              type="number"
              id="commission"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="repName">Representative Name</label>
            <input
              type="text"
              id="repName"
              name="repName"
              value={formData.repName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="repPhone">Representative Phone</label>
            <input
              type="number"
              id="repPhone"
              name="repPhone"
              value={formData.repPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="submit-btn">
            Add Game
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddGame
