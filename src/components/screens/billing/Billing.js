import React, { useContext, useState } from 'react'
import { Context as StoresContext } from '../../../context/StoresContext'
import {
  createPayPalSubscription,
  testPayPalCredentials,
  checkAuthStatus,
} from '../../../api/paypal'
import Header from '../../common/header/Header'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import './billing.css'

const Billing = () => {
  const {
    state: { loading, newStoreToAdd },
  } = useContext(StoresContext)

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [authResult, setAuthResult] = useState(null)

  console.log('newStoreToAdd @ Billing', newStoreToAdd)

  const handleTestAuth = async () => {
    try {
      setAuthResult(null)
      setError(null)
      const result = await checkAuthStatus()
      setAuthResult(result)
    } catch (err) {
      console.error('Auth test error:', err)
      const errorMessage = err.response?.data?.error || err.message
      setAuthResult({ success: false, error: errorMessage })
      setError('Authentication test failed: ' + errorMessage)
    }
  }

  const handleTestPayPal = async () => {
    try {
      setTestResult(null)
      setError(null)
      const result = await testPayPalCredentials()
      setTestResult(result)
    } catch (err) {
      console.error('PayPal test error:', err)
      const errorMessage = err.response?.data?.error || err.message
      setTestResult({ success: false, error: errorMessage })
      setError('PayPal test failed: ' + errorMessage)

      // If it's an authentication error, provide helpful guidance
      if (errorMessage.includes('logged in') || err.response?.status === 401) {
        setError('Authentication required. Please make sure you are logged in.')
      }
    }
  }

  const handleAddStoreSubscription = async () => {
    if (!newStoreToAdd?.storeName) {
      setError('Store name is required')
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await createPayPalSubscription(newStoreToAdd)

      if (response.success && response.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = response.approvalUrl
      } else {
        setError('Failed to create subscription. Please try again.')
      }
    } catch (err) {
      console.error('Error creating subscription:', err)
      setError(
        err.response?.data?.error ||
          'An error occurred while creating the subscription',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="billing-page">
      <Header />
      <div className="billing-container">
        <div className="stars-background" />
        <div className="billing-content">
          <div className="billing-sections">
            <div className="billing-section">
              <div className="billing-section-header">
                <h2>New Store (Subscription) to add</h2>
              </div>

              {error && <div className="error-message">{error}</div>}

              {success && <div className="success-message">{success}</div>}

              {testResult && (
                <div
                  className={`${testResult.success ? 'success-message' : 'error-message'}`}
                >
                  PayPal Test: {testResult.success ? 'SUCCESS' : 'FAILED'}
                  {testResult.error && ` - ${testResult.error}`}
                </div>
              )}

              {authResult && (
                <div
                  className={`${authResult.success ? 'success-message' : 'error-message'}`}
                >
                  Auth Test: {authResult.success ? 'SUCCESS' : 'FAILED'}
                  {authResult.error && ` - ${authResult.error}`}
                  {authResult.success &&
                    authResult.user &&
                    ` (${authResult.user.name})`}
                </div>
              )}

              <div className="plan-info">
                <div className="plan-item">
                  <span className="plan-label">Plan Name:</span>
                  <span className="plan-value">High Score Hero</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Monthly Rate:</span>
                  <span className="plan-value">$7</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Store Name:</span>
                  <span className="plan-value">
                    {newStoreToAdd?.storeName || 'Not specified'}
                  </span>
                </div>

                <button
                  className="billing-btn secondary"
                  onClick={handleTestAuth}
                  style={{ marginBottom: '1rem', backgroundColor: '#17a2b8' }}
                >
                  Test Authentication
                </button>

                <button
                  className="billing-btn secondary"
                  onClick={handleTestPayPal}
                  style={{ marginBottom: '1rem', backgroundColor: '#6c757d' }}
                >
                  Test PayPal Connection
                </button>

                <button
                  className={`billing-btn primary ${isProcessing ? 'processing' : ''}`}
                  onClick={handleAddStoreSubscription}
                  disabled={isProcessing || !newStoreToAdd?.storeName}
                >
                  {isProcessing ? 'Processing...' : 'Add Store (Subscription)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing
