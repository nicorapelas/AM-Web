import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { Context as PayPalContext } from '../../../context/PayPalContext'
import './billingHistoryModal.css'

const BillingHistoryModal = ({ isOpen, onClose, selectedStore = null }) => {
  const [activeTab, setActiveTab] = useState('all') // 'all', 'success', 'failed'
  const hasLoadedRef = useRef(false)
  const selectedStoreRef = useRef(null)

  const {
    state: { paymentHistory, paymentHistoryLoading, paymentHistoryError },
    fetchPaymentData,
    clearPaymentHistoryError,
  } = useContext(PayPalContext)

  // Stabilize the functions to prevent useEffect from running repeatedly
  const stableFetchPaymentData = useCallback(fetchPaymentData, [])
  const stableClearPaymentHistoryError = useCallback(
    clearPaymentHistoryError,
    [],
  )

  // Update ref when selectedStore changes
  useEffect(() => {
    selectedStoreRef.current = selectedStore
  }, [selectedStore])

  // Handle modal open/close and data fetching
  useEffect(() => {
    if (!isOpen) {
      hasLoadedRef.current = false
      return
    }

    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        stableClearPaymentHistoryError()
      }, 10000)

      // Pass null explicitly for all stores, or the store object for specific store
      const storeToFetch = selectedStoreRef.current

      stableFetchPaymentData(storeToFetch)
        .then(() => {
          clearTimeout(timeoutId)
        })
        .catch((error) => {
          console.error('Error fetching payment data:', error)
          clearTimeout(timeoutId)
        })
    }
  }, [isOpen, stableFetchPaymentData, stableClearPaymentHistoryError])

  const handleRetry = useCallback(() => {
    stableClearPaymentHistoryError()
    stableFetchPaymentData(selectedStoreRef.current).catch((error) => {
      console.error('Retry failed:', error)
    })
  }, [stableFetchPaymentData, stableClearPaymentHistoryError])

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }, [])

  const getBillingCycleInfo = useCallback((payment) => {
    if (!payment._store?.tierAnchorDate) {
      return {
        display: 'N/A',
        tooltip: 'No billing cycle information available',
      }
    }

    const anchorDate = new Date(payment._store.tierAnchorDate)
    const billingCycle = payment.billingCycle || 'MONTHLY'

    // Calculate next billing date based on anchor date
    const now = new Date()
    let nextBilling = new Date(anchorDate)

    // Calculate the next billing date
    while (nextBilling <= now) {
      if (billingCycle === 'MONTHLY') {
        nextBilling.setMonth(nextBilling.getMonth() + 1)
      } else if (billingCycle === 'YEARLY') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1)
      }
    }

    const daysUntil = Math.ceil((nextBilling - now) / (1000 * 60 * 60 * 24))

    return {
      display: `${billingCycle} (${daysUntil} days)`,
      tooltip: `Next billing: ${nextBilling.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}`,
      daysUntil,
      nextBilling,
    }
  }, [])

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'SUCCESS':
        return '#28a745'
      case 'FAILED':
        return '#dc3545'
      case 'PENDING':
        return '#ffc107'
      case 'CANCELLED':
        return '#6c757d'
      case 'REFUNDED':
        return '#17a2b8'
      default:
        return '#6c757d'
    }
  }, [])

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'SUCCESS':
        return '✅'
      case 'FAILED':
        return '❌'
      case 'PENDING':
        return '⏳'
      case 'CANCELLED':
        return '🚫'
      case 'REFUNDED':
        return '↩️'
      default:
        return '❓'
    }
  }, [])

  const filteredPayments = useMemo(() => {
    return paymentHistory.filter((payment) => {
      if (activeTab === 'all') return true
      return payment.status === activeTab.toUpperCase()
    })
  }, [paymentHistory, activeTab])

  const handleOverlayClick = useCallback(
    (e) => {
      // Only close if clicking on the overlay itself, not the modal content
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose],
  )

  if (!isOpen) return null

  return (
    <div className="billing-history-modal-overlay" onClick={handleOverlayClick}>
      <div className="billing-history-modal">
        <div className="billing-history-modal-header">
          <h2>Billing History</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {paymentHistoryLoading ? (
          <div className="billing-history-loading">
            <p>Loading payment history...</p>
          </div>
        ) : paymentHistoryError ? (
          <div className="billing-history-error">
            <p>{paymentHistoryError}</p>
            <button onClick={handleRetry}>Retry</button>
          </div>
        ) : (
          <div className="billing-history-content">
            {/* Payment History Tabs */}
            <div className="payment-history-tabs">
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({paymentHistory.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'success' ? 'active' : ''}`}
                onClick={() => setActiveTab('success')}
              >
                Successful (
                {paymentHistory.filter((p) => p.status === 'SUCCESS').length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'failed' ? 'active' : ''}`}
                onClick={() => setActiveTab('failed')}
              >
                Failed (
                {paymentHistory.filter((p) => p.status === 'FAILED').length})
              </button>
            </div>

            {/* Payment History List */}
            <div className="payment-history-list">
              {filteredPayments.length === 0 ? (
                <div className="no-payments">
                  <p>No payment history found.</p>
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <div key={payment._id} className="payment-item">
                    <div className="payment-header">
                      <div className="payment-status">
                        <span className="status-icon">
                          {getStatusIcon(payment.status)}
                        </span>
                        <span
                          className="status-text"
                          style={{ color: getStatusColor(payment.status) }}
                        >
                          {payment.status}
                        </span>
                      </div>
                      <div className="payment-amount">
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>

                    <div className="payment-details">
                      <div className="payment-info">
                        <span className="info-label">Store:</span>
                        <span className="info-value">
                          {payment._store?.storeName || 'Unknown Store'}
                        </span>
                      </div>
                      <div className="payment-info">
                        <span className="info-label">Date:</span>
                        <span className="info-value">
                          {formatDate(payment.processedAt)}
                        </span>
                      </div>
                      <div className="payment-info">
                        <span className="info-label">Payment ID:</span>
                        <span className="info-value payment-id">
                          {payment.paymentId}
                        </span>
                      </div>
                      {payment.failureReason && (
                        <div className="payment-info">
                          <span className="info-label">Failure Reason:</span>
                          <span className="info-value error">
                            {payment.failureReason}
                          </span>
                        </div>
                      )}
                      <div className="payment-info">
                        <span className="info-label">Billing Cycle:</span>
                        <span
                          className="info-value billing-cycle"
                          title={getBillingCycleInfo(payment).tooltip}
                        >
                          {getBillingCycleInfo(payment).display}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BillingHistoryModal
