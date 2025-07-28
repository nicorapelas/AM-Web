import React, { useState, useContext, useEffect } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { Context as AuthContext } from '../../../../../context/AuthContext'
import './authError.css'

const AuthError = () => {
  const {
    state: { errorMessage },
    clearErrorMessage,
  } = useContext(AuthContext)

  console.log('errorMessage', errorMessage)

  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (errorMessage) {
      const { email, password, password2, notVerified } = errorMessage
      if (email) {
        setError(email)
      }
      if (password) {
        setError(password)
      }
      if (password2) {
        setError(password2)
      }
      if (notVerified) {
        setError(notVerified)
      }
    }
    if (!errorMessage) {
      setError(null)
    }
  }, [errorMessage])

  const handleResendVerificationEmail = () => {
    clearErrorMessage()
    navigate('/resend-verification-email')
  }

  const renderContent = () => {
    if (!error) return null

    return (
      <div className="auth-error-container-wrapper">
        <div className="auth-error-container" onClick={clearErrorMessage}>
          <div className="auth-error-content-container">
            <div className="auth-error-content">
              {error}, if you don't receive the email, please check your spam
              folder.
            </div>
            {error === 'Email address not yet verified' && (
              <div
                className="auth-error-resend-button"
                onClick={handleResendVerificationEmail}
              >
                Click here to resend verification email
              </div>
            )}
          </div>
          <IoIosCloseCircle className="auth-error-icon" />
        </div>
      </div>
    )
  }

  return renderContent()
}

export default AuthError
