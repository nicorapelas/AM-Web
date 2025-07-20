import React, { useContext, useState } from 'react'

import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as PayPalContext } from '../../../context/PayPalContext'
import { Context as BillingContext } from '../../../context/BillingContext'
import Header from '../../common/header/Header'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import './billing.css'

const Billing = () => {
  const {
    state: { loading, newStoreToAdd },
  } = useContext(StoresContext)

  const {
    state: {
      loading: paypalLoading,
      error: paypalError,
      authResult,
      testResult,
    },
    checkAuthStatus,
    testPayPalCredentials,
    createPayPalSubscription,
    clearError,
  } = useContext(PayPalContext)

  const { setTierSelected } = useContext(BillingContext)

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const startLoading = (operation) => {
    setError(null)
    setSuccess(null)
    clearError()
  }

  const stopLoading = () => {
    // Loading is handled by the context
  }

  const handleTestAuth = async () => {
    try {
      startLoading('auth-test')
      setError(null)
      await checkAuthStatus()
      setSuccess('Authentication test completed successfully')
    } catch (err) {
      console.error('Auth test error:', err)
      setError('Authentication test failed: ' + (paypalError || err.message))
    } finally {
      stopLoading()
    }
  }

  const handleTestPayPal = async () => {
    try {
      startLoading('paypal-test')
      setError(null)
      await testPayPalCredentials()
      setSuccess('PayPal connection test completed successfully')
    } catch (err) {
      console.error('PayPal test error:', err)
      setError('PayPal test failed: ' + (paypalError || err.message))

      // If it's an authentication error, provide helpful guidance
      if (paypalError?.includes('logged in') || err.response?.status === 401) {
        setError('Authentication required. Please make sure you are logged in.')
      }
    } finally {
      stopLoading()
    }
  }

  const handleAddStoreSubscription = async () => {
    if (!newStoreToAdd?.storeName) {
      setError('Store name is required')
      return
    }
    setTierSelected('PAID_HIGH_SCORE_HERO')
    setIsProcessing(true)
    setError(null)
    setSuccess(null)
    startLoading('subscription-creation')

    try {
      const response = await createPayPalSubscription(newStoreToAdd)

      if (response.success && response.approvalUrl) {
        // Show success message in modal instead of text
        setSuccessMessage(
          'Subscription created successfully! Redirecting to PayPal for payment...',
        )
        setShowSuccessModal(true)
        // Small delay to show success message before redirect
        setTimeout(() => {
          window.location.href = response.approvalUrl
        }, 1500)
      } else {
        setError('Failed to create subscription. Please try again.')
      }
    } catch (err) {
      console.error('Error creating subscription:', err)
      setError(
        paypalError ||
          err.response?.data?.error ||
          'An error occurred while creating the subscription',
      )
    } finally {
      setIsProcessing(false)
      stopLoading()
    }
  }

  const getLoadingMessage = () => {
    if (paypalLoading) {
      return 'Processing...'
    }
    return 'Processing...'
  }

  if (loading || paypalLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="billing-page">
      <Header />

      {/* Loading Modal */}
      {paypalLoading && (
        <div className="loading-modal-overlay">
          <div className="loading-modal">
            <LoadingSpinner />
            <p className="loading-message">{getLoadingMessage()}</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="loading-modal-overlay">
          <div className="loading-modal">
            <LoadingSpinner />
            <p className="loading-message success">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="billing-container">
        <div className="stars-background" />
        <div className="billing-content">
          <div className="billing-sections">
            <div className="billing-section">
              <div className="billing-section-header">
                <h2>New Store (Subscription) to add</h2>
              </div>

              {error && <div className="error-message">{error}</div>}
              {paypalError && (
                <div className="error-message">{paypalError}</div>
              )}

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
                  className={`billing-btn primary ${isProcessing ? 'processing' : ''}`}
                  onClick={handleAddStoreSubscription}
                  disabled={
                    isProcessing || !newStoreToAdd?.storeName || paypalLoading
                  }
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
