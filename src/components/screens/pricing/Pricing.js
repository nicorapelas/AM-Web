import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/logo/arcadeManagerLogo.png'
import './pricing.css'

const Pricing = () => {
  const navigate = useNavigate()

  const features = {
    free: [
      'Track up to 1 store location',
      'Detailed game performance metrics',
      'Staff management',
      'Game performance tracking',
      'Daily revenue monitoring',
    ],
    premium: ['All Free features', 'Data backup', 'Email support'],
  }

  return (
    <div className="pricing-container">
      <div className="pricing-stars-background" />
      <div className="pricing-content">
        <div className="pricing-header">
          <img
            src={logo}
            alt="Arcade Manager Logo"
            className="pricing-logo"
            onClick={() => navigate('/')}
          />
          <h1>Choose Your Plan</h1>
          <p>Select the perfect plan for your arcade business</p>
        </div>

        <div className="pricing-cards">
          {/* Free Tier */}
          <div className="pricing-card pricing-free">
            <div className="pricing-card-star" />
            <div className="pricing-card-header">
              <h2>Free</h2>
              <div className="pricing-price">
                <span className="pricing-currency">$</span>
                <span className="pricing-amount">0</span>
                <span className="pricing-period">/month</span>
              </div>
            </div>
            <div className="pricing-card-features">
              <ul>
                {features.free.map((feature, index) => (
                  <li key={index}>
                    <span className="pricing-feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pricing-free-btn-container">
              <Link to="/signup" className="pricing-btn pricing-free-btn">
                Get Started
              </Link>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="pricing-card pricing-premium">
            <div className="pricing-card-star" />
            <div className="pricing-card-header">
              <h2>Premium</h2>
              <div className="pricing-price">
                <span className="pricing-currency">$</span>
                <span className="pricing-amount">7</span>
                <span className="pricing-period">/store/month</span>
              </div>
              <p className="pricing-price-note">First store is free!</p>
            </div>
            <div className="pricing-card-features">
              <ul>
                {features.premium.map((feature, index) => (
                  <li key={index}>
                    <span className="pricing-feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pricing-premium-btn-container">
              <Link to="/signup" className="pricing-btn pricing-premium-btn">
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="pricing-footer">
          <p>No credit card required for free tier</p>
          <Link to="/" className="pricing-back-home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Pricing
