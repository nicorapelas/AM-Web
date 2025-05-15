import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as GamesContext } from '../../../context/GamesContext'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import BackButton from '../../common/backButton/BackButton'
import Header from '../../common/header/Header'
import ReRoutes from '../../common/functions/ReRoutes'
import './games.css'

const Games = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [gameToDelete, setGameToDelete] = useState(null)
  const navigate = useNavigate()

  const {
    state: { loading, storeGames },
    setGameToEdit,
    deleteGame,
  } = useContext(GamesContext)

  const handleEditGame = (game) => {
    setGameToEdit(game)
    navigate(`/edit-game`)
  }

  const handleDeleteGame = (game) => {
    setGameToDelete(game)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (gameToDelete) {
      await deleteGame({ _id: gameToDelete._id, storeId: gameToDelete.storeId })
      setShowDeleteConfirm(false)
      setGameToDelete(null)
    }
  }

  const renderDeleteConfirm = (gameId) => {
    return (
      <div className="card-delete-confirm">
        <div className="card-modal-content">
          <p>Delete "{gameToDelete?.gameName}"?</p>
          <div className="card-modal-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                setShowDeleteConfirm(false)
                setGameToDelete(null)
              }}
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

    if (!storeGames || storeGames.length === 0) {
      return (
        <div className="no-games-container">
          <div className="stars-background"></div>
          <div className="no-games-content">
            <BackButton to="/store-details" />
            <div className="message-box">
              <div className="card-star"></div>
              <h1>No Games Found</h1>
              <p>Get started by adding your first game!</p>
              <button
                className="add-game-btn"
                onClick={() => navigate('/add-game')}
              >
                + Add Game
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="games-container">
        <ReRoutes />
        <div className="stars-background"></div>
        <Header />
        <div className="games-grid">
          {storeGames.map((game) => (
            <div key={game._id} className="game-card">
              <div className="card-star"></div>
              {showDeleteConfirm && gameToDelete?._id === game._id ? (
                renderDeleteConfirm(game._id)
              ) : (
                <>
                  <h2 className="game-name">{game.gameName}</h2>
                  <div className="game-details">
                    <div className="detail-row">
                      <span className="detail-label">🎮 Quantity:</span>
                      <span className="detail-value">{game.quantity || 0}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">💰 Commission:</span>
                      <span className="detail-value">
                        {game.commission ? `${game.commission}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">👤 Rep Name:</span>
                      <span className="detail-value">
                        {game.repName || 'N/A'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📞 Rep Phone:</span>
                      <span className="detail-value">
                        {game.repPhone || 'N/A'}
                      </span>
                    </div>
                    <div
                      className={`status-badge ${game.isActive ? 'active' : 'inactive'}`}
                    >
                      {game.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditGame(game)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteGame(game)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return renderContent()
}

export default Games
