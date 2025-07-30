import React, { useState, useContext, useEffect } from 'react'
import { Context as GamesContext } from '../../../context/GamesContext'
import { Context as StoresContext } from '../../../context/StoresContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import Header from '../../common/header/Header'
import './addGame.css'

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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

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
    <div className="add-game-container">
      <div className="add-game-stars"></div>
      <Header />
      <form className="add-game-form" onSubmit={handleSubmit}>
        <div className="add-game-form-group">
          <label className="add-game-label" htmlFor="gameName">
            Game Name
          </label>
          <input
            className="add-game-input"
            type="text"
            id="gameName"
            name="gameName"
            value={formData.gameName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="add-game-form-group">
          <label className="add-game-label" htmlFor="quantity">
            Quantity
          </label>
          <input
            className="add-game-input"
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="add-game-form-row">
          <div className="add-game-form-group">
            <label className="add-game-label" htmlFor="commission">
              Commission
            </label>
            <input
              className="add-game-input"
              type="number"
              id="commission"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-game-form-group">
            <label className="add-game-label" htmlFor="repName">
              Representative Name
            </label>
            <input
              className="add-game-input"
              type="text"
              id="repName"
              name="repName"
              value={formData.repName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-game-form-group">
            <label className="add-game-label" htmlFor="repPhone">
              Representative Phone
            </label>
            <input
              className="add-game-input"
              type="number"
              id="repPhone"
              name="repPhone"
              value={formData.repPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="add-game-button-container">
          <button type="submit" className="add-game-submit-btn">
            Add Game
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddGame
