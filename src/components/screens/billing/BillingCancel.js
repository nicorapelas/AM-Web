import React from 'react'
import { useNavigate } from 'react-router-dom'
import './billing.css'

const BillingCancel = () => {
  const navigate = useNavigate()

  return (
    <div className="billing-page">
      <div className="billing-container">
        <div className="stars-background" />
        <div className="billing-content">
          <div className="billing-sections">
            <div className="billing-section">
              <div className="billing-section-header">
                <h2>Payment Cancelled</h2>
              </div>

              <div className="plan-info">
                <div className="plan-item">
                  <span className="plan-label">Status:</span>
                  <span className="plan-value" style={{ color: '#dc3545' }}>
                    Cancelled
                  </span>
                </div>

                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.6rem',
                    marginBottom: '1rem',
                    color: '#666',
                  }}
                >
                  Your subscription payment was cancelled. No charges were made
                  to your account.
                </p>

                <button
                  className="billing-btn primary"
                  onClick={() => navigate('/billing')}
                >
                  Try Again
                </button>

                <button
                  className="billing-btn secondary"
                  onClick={() => navigate('/stores')}
                  style={{
                    marginTop: '1rem',
                    backgroundColor: '#6c757d',
                    color: '#ffffff',
                  }}
                >
                  Back to Stores
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingCancel
