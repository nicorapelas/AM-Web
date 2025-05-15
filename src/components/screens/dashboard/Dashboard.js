import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../common/header/Header'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as GamesContext } from '../../../context/GamesContext'
import { Context as FinancialsContext } from '../../../context/FinancialsContext'
import { Context as AuthContext } from '../../../context/AuthContext'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import './dashboard.css'

const Dashboard = () => {
  const {
    state: { loading, userStores },
  } = useContext(StoresContext)

  const {
    state: { userGames },
  } = useContext(GamesContext)

  const {
    state: { userFinancials },
  } = useContext(FinancialsContext)

  const {
    state: { user },
  } = useContext(AuthContext)

  const navigate = useNavigate()

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return (
    <div className="dashboard-container">
      <div className="stars-background"></div>
      <Header />
      <div className="grid-container">
        <div
          className="dashboard-card clickable"
          onClick={() => navigate('/stores')}
        >
          <div className="card-star"></div>
          <h2 className="card-title">Stores</h2>
          <p className="stat">{userStores.length}</p>
        </div>

        <div className="dashboard-card">
          <div className="card-star"></div>
          <h2 className="card-title">Daily Revenue</h2>
          <p className="stat">$1,458</p>
        </div>

        <div className="dashboard-card">
          <div className="card-star"></div>
          <h2 className="card-title">Popular Game</h2>
          <p className="stat">Pac-Man</p>
        </div>

        <div className="dashboard-card">
          <div className="card-star"></div>
          <h2 className="card-title">Maintenance</h2>
          <p className="stat">3</p>
        </div>

        <div className="dashboard-card">
          <div className="card-star"></div>
          <h2 className="card-title">Players Today</h2>
          <p className="stat">187</p>
        </div>

        <div className="dashboard-card">
          <div className="card-star"></div>
          <h2 className="card-title">Tickets</h2>
          <p className="stat">5,642</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
