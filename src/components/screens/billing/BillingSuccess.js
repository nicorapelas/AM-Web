import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Context as StoreContext } from '../../../context/StoresContext'
import { Context as PayPalContext } from '../../../context/PayPalContext'
import { Context as BillingContext } from '../../../context/BillingContext'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import './billing.css'

const BillingSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [storeInfo, setStoreInfo] = useState(null)

  const { fetchUserStores } = useContext(StoreContext)
  const { checkSubscriptionStatus } = useContext(PayPalContext)

  const {
    state: { tierSelected },
  } = useContext(BillingContext)

  console.log('Tier selected!!!!!!!!!!!!!!!!:', tierSelected)

  useEffect(() => {
    const subscriptionId = searchParams.get('subscription_id')
    const token = searchParams.get('token')
    const payerId = searchParams.get('PayerID')
    const baToken = searchParams.get('ba_token')

    console.log('PayPal success URL parameters:', {
      subscriptionId,
      token,
      payerId,
      baToken,
      allParams: Object.fromEntries(searchParams.entries()),
    })

    // PayPal can send different parameter combinations
    // For subscriptions, we might get ba_token instead of subscription_id
    const actualSubscriptionId = subscriptionId || baToken

    if (!actualSubscriptionId) {
      console.error('No subscription ID found in URL parameters')
      setError('Invalid payment response from PayPal - missing subscription ID')
      setIsProcessing(false)
      return
    }

    // Check the subscription status
    const checkSubscription = async () => {
      try {
        console.log(
          'Checking subscription status for ID:',
          actualSubscriptionId,
        )
        const response = await checkSubscriptionStatus({
          subscriptionId: actualSubscriptionId,
          tierSelected: tierSelected,
        })

        setSubscriptionStatus(response.status)

        if (response.success) {
          setSuccess(true)
          fetchUserStores()
          // If store was created, show store information
          if (response.storeCreated && response.store) {
            setStoreInfo(response.store)
          }
          // Redirect to stores page after 5 seconds (longer to show store info)
          setTimeout(() => {
            navigate('/stores')
          }, 5000)
        } else {
          // Handle different statuses
          switch (response.status) {
            case 'APPROVAL_PENDING':
              setError(
                'Payment is still being processed. Please wait a moment and refresh the page, or check your PayPal account for the subscription status.',
              )
              break
            case 'CANCELLED':
              setError('The subscription was cancelled. Please try again.')
              break
            case 'EXPIRED':
              setError(
                'The subscription has expired. Please create a new subscription.',
              )
              break
            default:
              setError(
                response.message ||
                  'An error occurred while processing the subscription',
              )
          }
        }
      } catch (err) {
        console.error('Error checking subscription status:', err)
        setError(
          err.response?.data?.error ||
            'An error occurred while checking the subscription status',
        )
      } finally {
        setIsProcessing(false)
      }
    }

    checkSubscription()
  }, [searchParams, navigate])

  if (isProcessing) {
    return (
      <div className="billing-page">
        <div className="billing-container">
          <div className="stars-background" />
          <div className="billing-content">
            <div className="billing-sections">
              <div className="billing-section">
                <div className="billing-section-header">
                  <h2>Processing Payment</h2>
                </div>
                <div className="plan-info">
                  <LoadingSpinner />
                  <p
                    style={{
                      textAlign: 'center',
                      fontSize: '0.6rem',
                      marginTop: '1rem',
                    }}
                  >
                    Checking your subscription status...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="billing-page">
      <div className="billing-container">
        <div className="stars-background" />
        <div className="billing-content">
          <div className="billing-sections">
            <div className="billing-section">
              <div className="billing-section-header">
                <h2>{success ? 'Payment Successful!' : 'Payment Status'}</h2>
              </div>

              {error && <div className="error-message">{error}</div>}

              {success && (
                <div className="success-message">
                  {storeInfo ? (
                    <>
                      <p>Your subscription has been activated successfully!</p>
                      <p>Store "{storeInfo.name}" has been created.</p>
                      <p>Staff credentials:</p>
                      <p>Username: {storeInfo.staffCredentials.username}</p>
                      <p>Password: {storeInfo.staffCredentials.password}</p>
                      <p>Redirecting to stores page...</p>
                    </>
                  ) : (
                    <>
                      Your subscription has been activated successfully! You can
                      now add your new store. Redirecting to stores page...
                    </>
                  )}
                </div>
              )}

              {subscriptionStatus && !success && !error && (
                <div className="info-message">
                  Subscription Status: {subscriptionStatus}
                </div>
              )}

              <div className="plan-info">
                {error && (
                  <button
                    className="billing-btn secondary"
                    onClick={() => navigate('/billing')}
                    style={{ marginTop: '1rem', backgroundColor: '#6c757d' }}
                  >
                    Try Again
                  </button>
                )}

                {subscriptionStatus === 'APPROVAL_PENDING' && (
                  <button
                    className="billing-btn secondary"
                    onClick={() => window.location.reload()}
                    style={{ marginTop: '1rem', backgroundColor: '#17a2b8' }}
                  >
                    Refresh Page
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingSuccess
