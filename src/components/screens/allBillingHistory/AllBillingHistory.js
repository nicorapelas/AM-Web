import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { Context as BillingContext } from '../../../context/BillingContext'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import Header from '../../common/header/Header'
import './allBillingHistory.css'

const AllBillingHistory = () => {
  const [activeTab, setActiveTab] = useState('all') // 'current-month', 'all', 'selected-dates'
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: '',
    endDate: '',
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  const {
    state: { loading, allUsersBillingHistory },
    fetchAllUsersBillingHistory,
  } = useContext(BillingContext)

  useEffect(() => {
    fetchAllUsersBillingHistory()
  }, [])

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

  const getPaymentMethodIcon = useCallback((method) => {
    switch (method) {
      case 'PayPal':
        return '💳'
      case 'Free Tier':
        return '🆓'
      default:
        return '💰'
    }
  }, [])

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    if (!allUsersBillingHistory) return []

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return allUsersBillingHistory.filter((payment) => {
      const paymentDate = new Date(payment.processedAt)

      switch (activeTab) {
        case 'current-month':
          return (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear
          )
        case 'selected-dates':
          if (!selectedDateRange.startDate || !selectedDateRange.endDate) {
            return false
          }
          const startDate = new Date(selectedDateRange.startDate)
          const endDate = new Date(selectedDateRange.endDate)
          endDate.setHours(23, 59, 59) // Include the entire end date
          return paymentDate >= startDate && paymentDate <= endDate
        case 'all':
        default:
          return true
      }
    })
  }, [allUsersBillingHistory, activeTab, selectedDateRange])

  const handleDateRangeChange = useCallback((field, value) => {
    setSelectedDateRange((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    if (tab !== 'selected-dates') {
      setShowDatePicker(false)
    }
  }, [])

  const handlePrint = useCallback(() => {
    if (filteredData.length === 0) {
      alert('No data to print')
      return
    }

    // Create print-friendly content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Billing History Report</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .header h1 { color: #333; margin: 0; font-size: 24px; }
              .header p { color: #666; margin: 10px 0 0 0; font-size: 14px; }
              .filter-info { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
              .filter-info h3 { margin: 0 0 10px 0; color: #333; font-size: 16px; }
              .filter-info p { margin: 5px 0; color: #666; font-size: 12px; }
              .payment-item { 
                border: 1px solid #ddd; 
                margin-bottom: 15px; 
                padding: 15px; 
                border-radius: 5px;
                page-break-inside: avoid;
              }
              .payment-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 10px; 
                padding-bottom: 10px; 
                border-bottom: 1px solid #eee; 
              }
              .payment-status { font-weight: bold; color: #333; }
              .payment-amount { font-weight: bold; color: #28a745; font-size: 16px; }
              .payment-details { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 10px; 
              }
              .payment-info { margin-bottom: 8px; }
              .info-label { font-weight: bold; color: #666; font-size: 12px; }
              .info-value { color: #333; font-size: 12px; }
              .payment-id, .subscription-id { font-family: monospace; font-size: 11px; color: #666; }
              .summary { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
              .summary h3 { margin: 0 0 10px 0; color: #333; }
              .summary p { margin: 5px 0; color: #666; }
              @page { margin: 1in; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Billing History Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</p>
          </div>
          
          <div class="filter-info">
            <h3>Filter Information</h3>
            <p><strong>Filter Type:</strong> ${activeTab === 'current-month' ? 'Current Month' : activeTab === 'selected-dates' ? 'Selected Dates' : 'All Records'}</p>
            ${activeTab === 'selected-dates' ? `<p><strong>Date Range:</strong> ${selectedDateRange.startDate} to ${selectedDateRange.endDate}</p>` : ''}
            <p><strong>Total Records:</strong> ${filteredData.length}</p>
          </div>
          
          ${filteredData
            .map(
              (payment, index) => `
            <div class="payment-item">
              <div class="payment-header">
                <div class="payment-status">
                  ${getStatusIcon(payment.status)} ${payment.status}
                </div>
                <div class="payment-amount">
                  ${formatCurrency(payment.amount)}
                </div>
              </div>
              <div class="payment-details">
                <div class="payment-info">
                  <div class="info-label">Payment Method:</div>
                  <div class="info-value">${getPaymentMethodIcon(payment.paymentMethod)} ${payment.paymentMethod}</div>
                </div>
                <div class="payment-info">
                  <div class="info-label">Date:</div>
                  <div class="info-value">${formatDate(payment.processedAt)}</div>
                </div>
                <div class="payment-info">
                  <div class="info-label">Payment ID:</div>
                  <div class="payment-id">${payment.paymentId}</div>
                </div>
                <div class="payment-info">
                  <div class="info-label">Subscription ID:</div>
                  <div class="subscription-id">${payment.subscriptionId}</div>
                </div>
                <div class="payment-info">
                  <div class="info-label">Billing Cycle:</div>
                  <div class="info-value">${payment.billingCycle}</div>
                </div>
                ${
                  payment.metadata?.paypalBillingInfo?.next_billing_time
                    ? `
                  <div class="payment-info">
                    <div class="info-label">Next Billing:</div>
                    <div class="info-value">${formatDate(payment.metadata.paypalBillingInfo.next_billing_time)}</div>
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `,
            )
            .join('')}
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Records:</strong> ${filteredData.length}</p>
            <p><strong>Total Amount:</strong> ${formatCurrency(filteredData.reduce((sum, payment) => sum + (payment.amount || 0), 0))}</p>
            <p><strong>Successful Payments:</strong> ${filteredData.filter((p) => p.status === 'SUCCESS').length}</p>
            <p><strong>Failed Payments:</strong> ${filteredData.filter((p) => p.status === 'FAILED').length}</p>
          </div>
        </body>
      </html>
    `

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
    }
  }, [
    filteredData,
    activeTab,
    selectedDateRange,
    formatDate,
    formatCurrency,
    getStatusIcon,
    getPaymentMethodIcon,
  ])

  if (loading) return <LoadingSpinner />

  return (
    <div className="all-billing-history-page">
      <Header />
      <div className="all-billing-history-container">
        <div className="all-billing-history-stars-background" />
        <div className="all-billing-history-content">
          {/* Filter Tabs */}
          <div className="all-billing-history-filter-tabs">
            <button
              className={`all-billing-history-filter-tab ${activeTab === 'current-month' ? 'active' : ''}`}
              onClick={() => handleTabChange('current-month')}
            >
              Current Month (
              {allUsersBillingHistory?.filter((p) => {
                const now = new Date()
                const paymentDate = new Date(p.processedAt)
                return (
                  paymentDate.getMonth() === now.getMonth() &&
                  paymentDate.getFullYear() === now.getFullYear()
                )
              }).length || 0}
              )
            </button>
            <button
              className={`all-billing-history-filter-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All ({allUsersBillingHistory?.length || 0})
            </button>
            <button
              className={`all-billing-history-filter-tab ${activeTab === 'selected-dates' ? 'active' : ''}`}
              onClick={() => handleTabChange('selected-dates')}
            >
              Selected Dates
            </button>
          </div>

          {/* Date Range Picker */}
          {activeTab === 'selected-dates' && (
            <div className="all-billing-history-date-range-picker">
              <div className="all-billing-history-date-input-group">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  value={selectedDateRange.startDate}
                  onChange={(e) =>
                    handleDateRangeChange('startDate', e.target.value)
                  }
                />
              </div>
              <div className="all-billing-history-date-input-group">
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  value={selectedDateRange.endDate}
                  onChange={(e) =>
                    handleDateRangeChange('endDate', e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* Print Button */}
          {filteredData.length > 0 && (
            <div className="all-billing-history-print-section">
              <button
                className="all-billing-history-print-btn"
                onClick={handlePrint}
              >
                🖨️ Print Report ({filteredData.length} records)
              </button>
            </div>
          )}

          {/* Billing History List */}
          <div className="all-billing-history-list">
            {filteredData.length === 0 ? (
              <div className="all-billing-history-no-data">
                <p>No billing history found for the selected criteria.</p>
              </div>
            ) : (
              filteredData.map((payment) => (
                <div key={payment._id} className="all-billing-history-item">
                  <div className="all-billing-history-header-section">
                    <div className="all-billing-history-status">
                      <span className="all-billing-history-status-icon">
                        {getStatusIcon(payment.status)}
                      </span>
                      <span
                        className="all-billing-history-status-text"
                        style={{ color: getStatusColor(payment.status) }}
                      >
                        {payment.status}
                      </span>
                    </div>
                    <div className="all-billing-history-amount">
                      {formatCurrency(payment.amount)}
                    </div>
                  </div>

                  <div className="all-billing-history-details">
                    <div className="all-billing-history-info">
                      <span className="all-billing-history-info-label">
                        Payment Method:
                      </span>
                      <span className="all-billing-history-info-value">
                        {getPaymentMethodIcon(payment.paymentMethod)}{' '}
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <div className="all-billing-history-info">
                      <span className="all-billing-history-info-label">
                        Date:
                      </span>
                      <span className="all-billing-history-info-value">
                        {formatDate(payment.processedAt)}
                      </span>
                    </div>
                    <div className="all-billing-history-info">
                      <span className="all-billing-history-info-label">
                        Payment ID:
                      </span>
                      <span className="all-billing-history-payment-id">
                        {payment.paymentId}
                      </span>
                    </div>
                    <div className="all-billing-history-info">
                      <span className="all-billing-history-info-label">
                        Subscription ID:
                      </span>
                      <span className="all-billing-history-subscription-id">
                        {payment.subscriptionId}
                      </span>
                    </div>
                    <div className="all-billing-history-info">
                      <span className="all-billing-history-info-label">
                        Billing Cycle:
                      </span>
                      <span className="all-billing-history-info-value billing-cycle">
                        {payment.billingCycle}
                      </span>
                    </div>
                    {payment.metadata?.paypalBillingInfo?.next_billing_time && (
                      <div className="all-billing-history-info">
                        <span className="all-billing-history-info-label">
                          Next Billing:
                        </span>
                        <span className="all-billing-history-info-value">
                          {formatDate(
                            payment.metadata.paypalBillingInfo
                              .next_billing_time,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllBillingHistory
