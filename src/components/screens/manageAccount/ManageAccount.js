import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthError from '../authScreens/authApiFeedback/authError/AuthError'
import AuthSuccess from '../authScreens/authApiFeedback/authSuccess/AuthSuccess'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as GuidedTourContext } from '../../../context/GuidedTourContext'
import Header from '../../common/header/Header'
import BillingHistoryModal from '../../common/modals/BillingHistoryModal'
import './manageAccount.css'

const ManageAccount = () => {
  const navigate = useNavigate()
  const {
    state: { loading, user, errorMessage, apiMessage },
    updateProfile,
    updatePassword,
    deleteAccount,
  } = useContext(AuthContext)

  const {
    state: { userStores },
  } = useContext(StoresContext)

  const {
    state: { guideEnabled },
    restartTour,
  } = useContext(GuidedTourContext)

  const [isEditing, setIsEditing] = useState(false)
  const [showPinInput, setShowPinInput] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleteConfirmationNumber, setDeleteConfirmationNumber] = useState('')
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('')
  const [showBillingHistory, setShowBillingHistory] = useState(false)
  const [selectedStoreForBilling, setSelectedStoreForBilling] = useState(null)

  const [formDataState, setFormDataState] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailUpdatePin: '',
  })

  // Update form data when user data changes
  useEffect(() => {
    setFormDataState({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailUpdatePin: '',
    })
  }, [user?.name, user?.email])

  // Memoized billing information calculation
  const billingInfo = useMemo(() => {
    if (!userStores || userStores.length === 0) {
      return {
        totalStores: 0,
        activeStores: 0,
        paidStores: 0,
        freeStores: 0,
        pendingStores: 0,
        highestTier: 'free-tier',
        subscriptionCount: 0,
        paymentIssues: 0,
      }
    }

    const activeStores = userStores.filter((store) => store.isActive)
    const paidStores = userStores.filter(
      (store) =>
        store.tier &&
        store.tier !== 'free-tier' &&
        store.paymentStatus === 'ACTIVE',
    )
    const freeStores = userStores.filter(
      (store) => store.tier === 'free-tier' || !store.tier,
    )
    const pendingStores = userStores.filter(
      (store) => store.paymentStatus === 'PENDING',
    )
    const storesWithIssues = userStores.filter(
      (store) =>
        store.paymentFailureCount > 0 || store.paymentStatus === 'FAILED',
    )

    // Determine highest tier
    const tiers = userStores.map((store) => store.tier).filter(Boolean)
    const highestTier =
      tiers.length > 0
        ? tiers.reduce((highest, tier) => {
            if (tier === 'PAID_HIGH_SCORE_HERO') return tier
            if (highest === 'PAID_HIGH_SCORE_HERO') return highest
            if (tier === 'PAID_ARCADE_MASTER') return tier
            if (highest === 'PAID_ARCADE_MASTER') return highest
            return tier
          })
        : 'free-tier'

    return {
      totalStores: userStores.length,
      activeStores: activeStores.length,
      paidStores: paidStores.length,
      freeStores: freeStores.length,
      pendingStores: pendingStores.length,
      highestTier,
      subscriptionCount: userStores.filter((store) => store.subscriptionId)
        .length,
      paymentIssues: storesWithIssues.length,
    }
  }, [userStores])

  // Memoized next billing date calculation
  const nextBillingDate = useMemo(() => {
    // Find the most recent store with a subscription
    const storesWithSubscriptions = userStores.filter(
      (store) => store.subscriptionId,
    )
    if (storesWithSubscriptions.length === 0) return 'N/A'

    // Get the most recent tier anchor date
    const mostRecentStore = storesWithSubscriptions.reduce((latest, store) => {
      return new Date(store.tierAnchorDate) > new Date(latest.tierAnchorDate)
        ? store
        : latest
    })

    if (!mostRecentStore.tierAnchorDate) return 'N/A'

    const anchorDate = new Date(mostRecentStore.tierAnchorDate)
    const nextBilling = new Date(anchorDate)
    nextBilling.setMonth(nextBilling.getMonth() + 1)

    return nextBilling.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [userStores])

  const getTierDisplayName = (tier) => {
    switch (tier) {
      case 'PAID_HIGH_SCORE_HERO':
        return 'High Score Hero'
      case 'PAID_ARCADE_MASTER':
        return 'Arcade Master'
      case 'free-tier':
      default:
        return 'Free Tier'
    }
  }

  const getTierStoreLimit = (tier) => {
    switch (tier) {
      case 'PAID_HIGH_SCORE_HERO':
        return 'Unlimited'
      case 'PAID_ARCADE_MASTER':
        return '10 stores'
      case 'free-tier':
      default:
        return '3 stores'
    }
  }

  // Scroll to top when error or API message changes
  useEffect(() => {
    if (errorMessage || apiMessage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [errorMessage, apiMessage])

  useEffect(() => {
    if (apiMessage) {
      const { success } = apiMessage
      if (success === 'Name updated successfully') {
        setIsEditing(false)
        setFormDataState((prev) => ({
          ...prev,
          name: '',
        }))
      }
    }
  }, [apiMessage])

  useEffect(() => {
    if (errorMessage) {
      const { pin } = errorMessage
      if (pin && pin.length > 0) {
        setShowPinInput(true)
      }
    }
  }, [errorMessage])

  // Show PIN input form when API message indicates PIN has been sent
  useEffect(() => {
    if (
      apiMessage &&
      apiMessage.success &&
      apiMessage.success.includes('verification PIN has been sent')
    ) {
      setShowPinInput(true)
      setIsEditing(false)
    }
  }, [apiMessage])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormDataState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    await updateProfile({ name: formDataState.name })
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    await updatePassword(formDataState)
  }

  const handleDeleteAccount = () => {
    // Generate a random 6-digit number
    const randomNumber = Math.floor(100000 + Math.random() * 900000).toString()
    setDeleteConfirmationNumber(randomNumber)
    setShowDeleteConfirmation(true)

    // Scroll to the confirmation message
    setTimeout(() => {
      const confirmationElement = document.querySelector(
        '.delete-account-confirmation',
      )
      if (confirmationElement) {
        confirmationElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }, 100) // Small delay to ensure the element is rendered
  }

  const handleDeleteConfirmation = (e) => {
    e.preventDefault()
    if (deleteConfirmationInput === deleteConfirmationNumber) {
      deleteAccount()
    } else {
      // Handle incorrect number
      setDeleteConfirmationInput('')
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
    setDeleteConfirmationInput('')
    setDeleteConfirmationNumber('')
  }

  const handleViewBillingHistory = () => {
    navigate('/all-billing-history')
  }

  const handleViewStoreBillingHistory = (store) => {
    setSelectedStoreForBilling(store)
    setShowBillingHistory(true)
  }

  const handleCloseBillingHistory = () => {
    setShowBillingHistory(false)
    setSelectedStoreForBilling(null)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="manage-account-page">
      <Header />
      {errorMessage && <AuthError error={errorMessage} />}
      {apiMessage?.success && <AuthSuccess success={apiMessage.success} />}
      <div className="manage-account-container">
        <div className="stars-background" />
        <div className="manage-account-content">
          <div className="manage-account-sections">
            {/* Profile Section */}
            <div className="manage-account-section">
              <div className="manage-account-section-header">
                <h2>Profile Information</h2>
                {!showPinInput && (
                  <button
                    className="manage-account-edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                )}
              </div>

              {showPinInput ? (
                <form
                  onSubmit={handleProfileUpdate}
                  className="manage-account-form"
                >
                  {apiMessage?.success && (
                    <div className="manage-account-success-message">
                      {apiMessage.success}
                    </div>
                  )}
                  <div className="manage-account-form-group">
                    <label htmlFor="emailUpdatePin">
                      Enter Verification PIN
                    </label>
                    <div className="manage-account-form-group-input-container">
                      <input
                        type="text"
                        id="emailUpdatePin"
                        name="emailUpdatePin"
                        value={formDataState.emailUpdatePin}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit PIN"
                        maxLength="6"
                        className="editing"
                      />
                    </div>
                  </div>
                  <button type="submit" className="manage-account-save-btn">
                    Verify PIN
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleProfileUpdate}
                  className="manage-account-form"
                >
                  <div className="manage-account-form-group">
                    <label htmlFor="name">Name</label>
                    <div className="manage-account-form-group-input-container">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formDataState.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={isEditing ? 'editing' : ''}
                      />
                    </div>
                  </div>

                  <div className="manage-account-form-group">
                    <label htmlFor="email">Email</label>
                    <div className="manage-account-form-group-input-container">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formDataState.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={isEditing ? 'editing' : ''}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <button type="submit" className="manage-account-save-btn">
                      Save Changes
                    </button>
                  )}
                </form>
              )}
            </div>

            {/* Password Section */}
            <div className="manage-account-section">
              <div className="manage-account-section-header">
                <h2>Change Password</h2>
                <button
                  type="button"
                  className={`password-toggle-btn ${showPasswords ? 'passwords-visible' : 'passwords-hidden'}`}
                  onClick={togglePasswordVisibility}
                >
                  {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                </button>
              </div>

              <form
                onSubmit={handlePasswordUpdate}
                className="manage-account-form"
              >
                <div className="manage-account-form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="manage-account-form-group-input-container">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={formDataState.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="manage-account-form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="manage-account-form-group-input-container">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={formDataState.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="manage-account-form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="manage-account-form-group-input-container">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formDataState.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button type="submit" className="manage-account-save-btn">
                  Update Password
                </button>
              </form>
            </div>

            {/* Billing Section */}
            <div className="manage-account-section">
              <div className="manage-account-section-header">
                <h2>Billing & Subscription</h2>
              </div>
              <div className="billing-content">
                <div className="billing-info">
                  <div className="billing-item">
                    <span className="billing-label">Current Plan:</span>
                    <span className="billing-value">
                      {getTierDisplayName(billingInfo.highestTier)}
                    </span>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Next Billing:</span>
                    <span className="billing-value">{nextBillingDate}</span>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Stores Limit:</span>
                    <span className="billing-value">
                      {getTierStoreLimit(billingInfo.highestTier)}
                    </span>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Total Stores:</span>
                    <span className="billing-value">
                      {billingInfo.totalStores}
                    </span>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Active Stores:</span>
                    <span className="billing-value">
                      {billingInfo.activeStores}
                    </span>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Paid Subscriptions:</span>
                    <span className="billing-value">
                      {billingInfo.subscriptionCount}
                    </span>
                  </div>
                  {billingInfo.paymentIssues > 0 && (
                    <div className="billing-item billing-warning">
                      <span className="billing-label">Payment Issues:</span>
                      <span className="billing-value warning">
                        {billingInfo.paymentIssues} stores
                      </span>
                    </div>
                  )}
                </div>
                <div className="billing-actions">
                  <button
                    className="manage-account-billing-btn secondary"
                    onClick={handleViewBillingHistory}
                  >
                    View Billing History
                  </button>
                </div>
              </div>
            </div>

            {/* Store Details Section */}
            {userStores && userStores.length > 0 && (
              <div className="manage-account-section">
                <div className="manage-account-section-header">
                  <h2>Your Stores & Subscriptions</h2>
                </div>
                <div className="store-details-content">
                  {userStores.map((store) => (
                    <div key={store._id} className="store-detail-item">
                      <div className="store-detail-header">
                        <h3 className="store-name">{store.storeName}</h3>
                        <div
                          className={`store-status ${store.isActive ? 'active' : 'inactive'}`}
                        >
                          {store.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                      </div>
                      <div className="store-detail-info">
                        <div className="store-info-row">
                          <span className="store-info-label">Address:</span>
                          <span className="store-info-value">
                            {store.address}
                          </span>
                        </div>
                        <div className="store-info-row">
                          <span className="store-info-label">Tier:</span>
                          <span className="store-info-value">
                            {getTierDisplayName(store.tier)}
                          </span>
                        </div>
                        <div className="store-info-row">
                          <span className="store-info-label">
                            Payment Status:
                          </span>
                          <span
                            className={`store-info-value payment-status-${store.paymentStatus?.toLowerCase()}`}
                          >
                            {store.tier === 'free-tier'
                              ? 'N/A'
                              : store.paymentStatus || 'N/A'}
                          </span>
                        </div>
                        {store.subscriptionId && (
                          <div className="store-info-row">
                            <span className="store-info-label">
                              Subscription ID:
                            </span>
                            <span className="store-info-value subscription-id">
                              {store.subscriptionId}
                            </span>
                          </div>
                        )}
                        {store.paymentFailureCount > 0 && (
                          <div className="store-info-row">
                            <span className="store-info-label">
                              Payment Failures:
                            </span>
                            <span className="store-info-value warning">
                              {store.paymentFailureCount}
                            </span>
                          </div>
                        )}
                        {store.notes && (
                          <div className="store-info-row">
                            <span className="store-info-label">Notes:</span>
                            <span className="store-info-value">
                              {store.notes}
                            </span>
                          </div>
                        )}
                      </div>
                      {store.subscriptionId && (
                        <div className="store-detail-actions">
                          <button
                            className="store-billing-history-btn"
                            onClick={() => handleViewStoreBillingHistory(store)}
                          >
                            View Payment History
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guide Settings */}
            <div className="manage-account-section">
              <div className="manage-account-section-header">
                <h2>Guide & Tutorial</h2>
              </div>
              <div className="guide-settings-content">
                <div className="guide-settings-info">
                  <div className="guide-settings-item">
                    <span className="guide-settings-label">Guide Status:</span>
                    <span
                      className={`guide-settings-value ${guideEnabled ? 'active' : 'inactive'}`}
                    >
                      {guideEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="guide-settings-description">
                    {guideEnabled
                      ? 'The interactive guide is currently active and will help you navigate the app.'
                      : 'The guide has been ended. You can restart it anytime to get help with using the app.'}
                  </div>
                </div>
                <div className="guide-settings-actions">
                  {!guideEnabled && (
                    <button
                      className="manage-account-guide-btn"
                      onClick={restartTour}
                    >
                      Restart Guide
                    </button>
                  )}
                  {guideEnabled && (
                    <div className="guide-active-message">
                      Guide is currently active. You can end it from the guide
                      button on any page.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="manage-account-section manage-account-danger-zone">
              <div className="manage-account-section-header">
                <h2>Danger Zone</h2>
              </div>
              {showDeleteConfirmation ? (
                <div className="delete-account-confirmation">
                  <p className="delete-warning">
                    Warning: This action cannot be undone. Please type the
                    following number to confirm:
                  </p>
                  <p className="confirmation-number">
                    {deleteConfirmationNumber}
                  </p>
                  <form
                    onSubmit={handleDeleteConfirmation}
                    className="manage-account-form"
                  >
                    <div className="manage-account-form-group">
                      <div className="manage-account-form-group-input-container">
                        <input
                          type="text"
                          value={deleteConfirmationInput}
                          onChange={(e) =>
                            setDeleteConfirmationInput(e.target.value)
                          }
                          placeholder="Enter the number above"
                          maxLength="6"
                          className="editing"
                        />
                      </div>
                    </div>
                    <div className="delete-account-buttons">
                      <button
                        type="submit"
                        className="manage-account-delete-btn"
                      >
                        Confirm Delete
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelDelete}
                        className="manage-account-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={handleDeleteAccount}
                  className="manage-account-signout-btn"
                >
                  Delete Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Billing History Modal */}
      <BillingHistoryModal
        isOpen={showBillingHistory}
        onClose={handleCloseBillingHistory}
        selectedStore={selectedStoreForBilling}
      />
    </div>
  )
}

export default ManageAccount
