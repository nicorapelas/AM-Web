import React from 'react'
import { Link } from 'react-router-dom'

import RunningBanner from '../../common/runningBanner/RunningBanner'
import './home.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="stars-background" />
      {/* <div className="grid-overlay" />
      <div className="scanline" /> */}
      <div className="home-content">
        <RunningBanner />
        <div className="home-card">
          <div className="card-star" />
          <div className="home-description">
            <p>
              Welcome to Arcade Manager - Your Ultimate Arcade Management
              Solution!
            </p>
            <p>
              Manage your arcade business with ease. Track games, finances,
              staff, and more.
            </p>
            <p>
              All your data is securely encrypted to protect your business
              information.
            </p>
          </div>

          <div className="home-buttons">
            <Link to="/signup" className="home-btn signup-btn">
              Sign Up
            </Link>
            <Link to="/login" className="home-btn login-btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
