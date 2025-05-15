import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as StaffContext } from '../../../context/StaffContext'
import Header from '../../common/header/Header'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import './staff.css'

const Staff = () => {
  const {
    state: { loading, storeSelected, userStores },
  } = useContext(StoresContext)

  const {
    state: { loading: staffLoading, storeStaff },
    setStaffToEdit,
    deleteStaff,
    createLoan,
    addLoanPayment,
  } = useContext(StaffContext)

  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState(null)
  const [showLoansModal, setShowLoansModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [showCreateLoanForm, setShowCreateLoanForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [loanFormData, setLoanFormData] = useState({
    amount: '',
    notes: '',
  })
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    notes: '',
  })

  useEffect(() => {
    if (!userStores || userStores.length === 0) {
      navigate('/dashboard')
    }
  }, [userStores])

  console.log(storeStaff)

  const getStatusClass = (isActive) => {
    return isActive ? 'staff-status-active' : 'staff-status-inactive'
  }

  if (loading || staffLoading) {
    return <LoadingSpinner />
  }

  const handleClickEdit = (staff) => {
    setStaffToEdit(staff)
    navigate('/edit-staff')
  }

  const handleClickDelete = (staff) => {
    setStaffToDelete(staff)
    setShowDeleteModal(true)
  }

  const handleClickLoans = (staff) => {
    setSelectedStaff(staff)
    setShowLoansModal(true)
    setShowCreateLoanForm(false)
    setShowPaymentForm(false)
    setLoanFormData({ amount: '', notes: '' })
    setPaymentFormData({ amount: '', notes: '' })
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteStaff({ _id: staffToDelete._id })
      setShowDeleteModal(false)
      setStaffToDelete(null)
    } catch (error) {
      console.error('Error deleting staff member:', error)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setStaffToDelete(null)
  }

  const handleCloseLoansModal = () => {
    setShowLoansModal(false)
    setSelectedStaff(null)
    setShowCreateLoanForm(false)
    setShowPaymentForm(false)
    setLoanFormData({ amount: '', notes: '' })
    setPaymentFormData({ amount: '', notes: '' })
  }

  const handleCreateLoan = () => {
    setShowCreateLoanForm(true)
  }

  const handleLoanFormChange = (e) => {
    const { name, value } = e.target
    setLoanFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoanFormSubmit = async (e) => {
    e.preventDefault()
    await createLoan({
      staffId: selectedStaff._id,
      ...loanFormData,
    })
    setShowCreateLoanForm(false)
    setLoanFormData({ amount: '', notes: '' })
  }

  const handleCancelCreateLoan = () => {
    setShowCreateLoanForm(false)
    setLoanFormData({ amount: '', notes: '' })
  }

  const handleTakePayment = () => {
    setShowPaymentForm(true)
  }

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target
    setPaymentFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentFormSubmit = async (e) => {
    e.preventDefault()
    try {
      await addLoanPayment({
        staffId: selectedStaff._id,
        amount: paymentFormData.amount,
        notes: paymentFormData.notes,
      })
      setShowPaymentForm(false)
      setShowLoansModal(false)
      setSelectedStaff(null)
      setPaymentFormData({ amount: '', notes: '' })
    } catch (error) {
      console.error('Error submitting payment:', error)
    }
  }

  const handleCancelPayment = () => {
    setShowPaymentForm(false)
    setPaymentFormData({ amount: '', notes: '' })
  }

  const renderDeleteModal = () => {
    if (!showDeleteModal || !staffToDelete) return null

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this staff member?</p>
          <p className="modal-staff-name">
            {staffToDelete.firstName} {staffToDelete.lastName}
          </p>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={handleCancelDelete}>
              Cancel
            </button>
            <button className="delete-btn" onClick={handleConfirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderCreateLoanForm = () => {
    return (
      <form onSubmit={handleLoanFormSubmit} className="loan-form">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={loanFormData.amount}
            onChange={handleLoanFormChange}
            required
            min="0"
            step="0.01"
            placeholder="Enter loan amount"
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={loanFormData.notes}
            onChange={handleLoanFormChange}
            placeholder="Enter loan notes"
            rows="3"
          />
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancelCreateLoan}
          >
            Cancel
          </button>
          <button type="submit" className="create-loan-btn">
            Create Loan
          </button>
        </div>
      </form>
    )
  }

  const renderPaymentForm = () => {
    const calculateOutstandingBalance = (loan) => {
      const totalPayments = loan.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      )
      return loan.amount - totalPayments
    }

    const outstandingBalance = calculateOutstandingBalance(selectedStaff.loan)

    const formatCurrency = (amount) => {
      return `$${Number(amount).toFixed(2)}`
    }

    return (
      <form onSubmit={handlePaymentFormSubmit} className="loan-form">
        <div className="payment-balance-info">
          <span className="payment-balance-label">Outstanding Balance:</span>
          <span className="payment-balance-value">
            {formatCurrency(outstandingBalance)}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="payment-amount">Payment Amount</label>
          <input
            type="number"
            id="payment-amount"
            name="amount"
            value={paymentFormData.amount}
            onChange={handlePaymentFormChange}
            required
            min="0"
            max={outstandingBalance}
            step="0.01"
            placeholder="Enter payment amount"
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment-notes">Notes</label>
          <textarea
            id="payment-notes"
            name="notes"
            value={paymentFormData.notes}
            onChange={handlePaymentFormChange}
            placeholder="Enter payment notes"
            rows="3"
          />
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancelPayment}
          >
            Cancel
          </button>
          <button type="submit" className="create-loan-btn">
            Submit Payment
          </button>
        </div>
      </form>
    )
  }

  const renderLoanDetails = (loan) => {
    if (!loan) return null

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const formatCurrency = (amount) => {
      return `$${Number(amount).toFixed(2)}`
    }

    const calculateOutstandingBalance = (loan) => {
      const totalPayments = loan.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      )
      return loan.amount - totalPayments
    }

    const outstandingBalance = calculateOutstandingBalance(loan)

    return (
      <div className="loan-details">
        <div className="loan-info-item">
          <span className="loan-label">Amount:</span>
          <span className="loan-value">{formatCurrency(loan.amount)}</span>
        </div>
        <div className="loan-info-item">
          <span className="loan-label">Outstanding Balance:</span>
          <span
            className={`loan-value ${outstandingBalance > 0 ? 'loan-balance-outstanding' : 'loan-balance-paid'}`}
          >
            {formatCurrency(outstandingBalance)}
          </span>
        </div>
        <div className="loan-info-item">
          <span className="loan-label">Date Issued:</span>
          <span className="loan-value">{formatDate(loan.dateIssued)}</span>
        </div>
        <div className="loan-info-item">
          <span className="loan-label">Due Date:</span>
          <span className="loan-value">{formatDate(loan.dueDate)}</span>
        </div>
        <div className="loan-info-item">
          <span className="loan-label">Status:</span>
          <span className={`loan-status loan-status-${loan.status}`}>
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </span>
        </div>
        {loan.notes && (
          <div className="loan-info-item">
            <span className="loan-label">Notes:</span>
            <span className="loan-value">{loan.notes}</span>
          </div>
        )}
        {loan.payments && loan.payments.length > 0 && (
          <div className="loan-payments">
            <h4>Payment History</h4>
            {loan.payments.map((payment, index) => (
              <div key={index} className="payment-item">
                <div className="payment-main-info">
                  <span className="payment-date">
                    {formatDate(payment.date)}
                  </span>
                  <span className="payment-amount">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                {payment.notes && (
                  <div className="payment-notes">{payment.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {loan.status === 'active' && (
          <button className="take-payment-btn" onClick={handleTakePayment}>
            Take Payment
          </button>
        )}
      </div>
    )
  }

  const renderLoansModal = () => {
    if (!showLoansModal || !selectedStaff) return null

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Loans Management</h3>
          <p className="modal-staff-name">
            {selectedStaff.firstName} {selectedStaff.lastName}
          </p>
          {showCreateLoanForm ? (
            renderCreateLoanForm()
          ) : showPaymentForm ? (
            renderPaymentForm()
          ) : (
            <>
              {selectedStaff.loan ? (
                renderLoanDetails(selectedStaff.loan)
              ) : (
                <p className="no-loan-message">No active loans</p>
              )}
              <div className="modal-actions">
                {(!selectedStaff.loan ||
                  selectedStaff.loan.status === 'paid') && (
                  <button
                    className="create-loan-btn"
                    onClick={handleCreateLoan}
                  >
                    Create Loan
                  </button>
                )}
                <button className="cancel-btn" onClick={handleCloseLoansModal}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (!storeSelected) {
    return (
      <div className="staff-page-container">
        <div className="staff-stars-bg" />
        <Header />
        <div className="staff-no-store-message">
          Please select a store to view staff members
        </div>
      </div>
    )
  }

  return (
    <div className="staff-page-container">
      <div className="staff-stars-bg" />
      <Header />
      <div className="staff-content">
        <div className="staff-header">
          <h2 className="staff-title">{storeSelected.storeName}</h2>
          <div className="staff-stats">
            <div className="staff-stat-item">
              <span className="staff-stat-label">Total Staff:</span>
              <span className="staff-stat-value">{storeStaff.length}</span>
            </div>
            <div className="staff-stat-item">
              <span className="staff-stat-label">Active Staff:</span>
              <span className="staff-stat-value">
                {storeStaff.filter((staff) => staff.isActive).length}
              </span>
            </div>
          </div>
        </div>

        <div className="staff-grid">
          {storeStaff.map((staff) => (
            <div key={staff.id} className="staff-card">
              <div className="staff-card-star" />
              <div className="staff-card-header">
                <h3 className="staff-name">
                  {staff.firstName} {staff.lastName}
                </h3>
                <span
                  className={`staff-status ${getStatusClass(staff.isActive)}`}
                >
                  {staff.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="staff-card-content">
                <div className="staff-info-item">
                  <span className="staff-label">Position:</span>
                  <span className="staff-value">{staff.position}</span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">Email:</span>
                  <span className="staff-value">{staff.email}</span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">Phone:</span>
                  <span className="staff-value">{staff.phone}</span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">Start Date:</span>
                  <span className="staff-value">
                    {new Date(staff.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">Payment Terms:</span>
                  <span className="staff-value">{staff.paymentTerms}</span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">Payment Method:</span>
                  <span className="staff-value">{staff.paymentMethod}</span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">Payment Value:</span>
                  <span className="staff-value">{staff.paymentValue}</span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">Username:</span>
                  <span className="staff-value">{staff.username}</span>
                </div>
                <div className="staff-info-item">
                  <span className="staff-label">PIN:</span>
                  <span className="staff-value">{staff.pin}</span>
                </div>
              </div>

              <div className="staff-card-actions">
                <button
                  className="staff-action-btn staff-edit-btn"
                  onClick={() => handleClickEdit(staff)}
                >
                  Edit
                </button>
                <button
                  className="staff-action-btn staff-loans-btn"
                  onClick={() => handleClickLoans(staff)}
                >
                  Loans
                </button>
                <button
                  className="staff-action-btn staff-delete-btn"
                  onClick={() => handleClickDelete(staff)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {renderDeleteModal()}
      {renderLoansModal()}
    </div>
  )
}

export default Staff
