import React, { useState, useEffect, useContext } from 'react'
import AuthError from '../authScreens/authApiFeedback/authError/AuthError'
import AuthSuccess from '../authScreens/authApiFeedback/authSuccess/AuthSuccess'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import { Context as AuthContext } from '../../../context/AuthContext'
import Header from '../../common/header/Header'
import './manageAccount.css'

const ManageAccount = () => {
  const {
    state: { loading, user, errorMessage, apiMessage },
    updateUserProfile,
    verifyEmailUpdatePin,
    updateUserPasswordViaProfile,
    clearApiMessage,
    clearErrorMessage,
    deleteAccount,
  } = useContext(AuthContext)

  const [isEditing, setIsEditing] = useState(false)
  const [showPinInput, setShowPinInput] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleteConfirmationNumber, setDeleteConfirmationNumber] = useState('')
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailUpdatePin: '',
  })

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
        setFormData((prev) => ({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev)
  }

  const handleProfileUpdate = async (e) => {
    clearApiMessage()
    clearErrorMessage()
    e.preventDefault()
    if (showPinInput) {
      // Handle PIN verification
      verifyEmailUpdatePin({
        emailUpdatePin: formData.emailUpdatePin,
        email: formData.email,
      })
      setShowPinInput(false)
      setFormData((prev) => ({
        ...prev,
        emailUpdatePin: '',
      }))
    } else {
      // Handle initial email update request
      updateUserProfile({
        name: formData.name,
        email: formData.email,
      })
      setIsEditing(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    updateUserPasswordViaProfile({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    })
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

  // Show PIN input form when API message indicates PIN has been sent
  React.useEffect(() => {
    if (
      apiMessage &&
      apiMessage.success &&
      apiMessage.success.includes('verification PIN has been sent')
    ) {
      setShowPinInput(true)
      setIsEditing(false)
    }
  }, [apiMessage])

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
                        value={formData.emailUpdatePin}
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
                        value={formData.name}
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
                        value={formData.email}
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
                      value={formData.currentPassword}
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
                      value={formData.newPassword}
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
                      value={formData.confirmPassword}
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
                    <span className="billing-value">Free Tier</span>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Next Billing:</span>
                    <span className="billing-value">N/A</span>
                  </div>
                  <div className="billing-item">
                    <span className="billing-label">Stores Limit:</span>
                    <span className="billing-value">3 stores</span>
                  </div>
                </div>
                <div className="billing-actions">
                  <button className="manage-account-billing-btn">
                    Upgrade Plan
                  </button>
                  <button className="manage-account-billing-btn secondary">
                    View Billing History
                  </button>
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
    </div>
  )
}

export default ManageAccount
