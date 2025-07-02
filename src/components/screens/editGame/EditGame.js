import React, { useState, useContext, useEffect } from 'react'
import { Context as GamesContext } from '../../../context/GamesContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import Header from '../../common/header/Header'
import ReRoutes from '../../common/functions/ReRoutes'
import '../addGame/addGame.css'

const EditGame = () => {
  const [formData, setFormData] = useState({
    gameName: '',
    quantity: '',
    commission: '',
    repName: '',
    repPhone: '',
  })

  const {
    state: { loading, gameToEdit },
    editGame,
  } = useContext(GamesContext)

  useEffect(() => {
    if (gameToEdit) {
      setFormData(gameToEdit)
    }
  }, [gameToEdit])

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
    editGame(formData)
    navigate('/games')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="add-game-container">
      <ReRoutes />
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
            type="text"
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
              type="text"
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
              type="tel"
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditGame
