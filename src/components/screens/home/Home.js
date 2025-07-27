import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import RunningBanner from '../../common/runningBanner/RunningBanner'
import usaFlag from '../../../assets/images/general/USA_Flag-pixed.png'
import arcadeLogo from '../../../assets/images/logo/arcadeManagerLogo.png'
import gameLogo01 from '../../../assets/images/arcade-companies/game-logo01.png'
import gameLogo02 from '../../../assets/images/arcade-companies/game-logo02.png'
import gameLogo03 from '../../../assets/images/arcade-companies/game-logo03.png'
import gameLogo04 from '../../../assets/images/arcade-companies/game-logo04.png'
import gameLogo05 from '../../../assets/images/arcade-companies/game-logo05.png'
import gameLogo06 from '../../../assets/images/arcade-companies/game-logo06.png'
import gameLogo07 from '../../../assets/images/arcade-companies/game-logo07.png'
import gameLogo08 from '../../../assets/images/arcade-companies/game-logo08.png'
import gameLogo09 from '../../../assets/images/arcade-companies/game-logo09.png'
import gameLogo10 from '../../../assets/images/arcade-companies/game-logo10.png'
import gameLogo11 from '../../../assets/images/arcade-companies/game-logo11.png'
import gameLogo12 from '../../../assets/images/arcade-companies/game-logo12.png'
import gameLogo13 from '../../../assets/images/arcade-companies/game-logo13.png'
import gameLogo14 from '../../../assets/images/arcade-companies/game-logo14.png'
import gameLogo15 from '../../../assets/images/arcade-companies/game-logo15.png'
import './home.css'

import { Context as AuthContext } from '../../../context/AuthContext'

const Home = () => {
  const navigate = useNavigate()

  const gameLogos = [
    gameLogo01,
    gameLogo02,
    gameLogo05,
    gameLogo06,
    gameLogo07,
    gameLogo08,
    gameLogo09,
    gameLogo10,
    gameLogo11,
    gameLogo12,
    gameLogo13,
    gameLogo14,
    gameLogo15,
  ]

  const {
    state: { apiMessage, user, token },
    signout,
  } = useContext(AuthContext)

  useEffect(() => {
    if (apiMessage) {
      const { success } = apiMessage
      if (success === 'Account deleted successfully') {
        let timer = setTimeout(() => {
          signout()
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [apiMessage])

  useEffect(() => {
    if (user && token) {
      navigate('/dashboard')
    }
  }, [user, token])

  return (
    <div className="home-container">
      <div className="stars-background" />
      <div className="home-content">
        <div className="banner-row">
          <img src={usaFlag} alt="USA Flag" className="usa-flag" />
          <RunningBanner />
          <img src={usaFlag} alt="USA Flag" className="usa-flag" />
        </div>

        <div className="promo-banner">
          <div className="promo-content">
            <span className="promo-text">
              Sign Up Free – Manage Your First Arcade On Us!
            </span>
            <Link to="/signup" className="promo-btn">
              Get Started
            </Link>
          </div>
        </div>

        <div className="home-card">
          <div className="card-star" onClick={() => signout()} />
          <div className="home-description">
            <img
              src={arcadeLogo}
              alt="Arcade Manager Logo"
              className="arcade-logo"
            />
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
            <Link to="/pricing" className="home-btn pricing-btn-home">
              Pricing
            </Link>
          </div>
        </div>
      </div>
      <div className="logo-carousel">
        <div className="logo-track">
          {gameLogos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Game Company Logo ${index + 1}`}
              className="company-logo"
            />
          ))}
          {/* Duplicate logos for seamless loop */}
          {gameLogos.map((logo, index) => (
            <img
              key={`dup-${index}`}
              src={logo}
              alt={`Game Company Logo ${index + 1}`}
              className="company-logo"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
