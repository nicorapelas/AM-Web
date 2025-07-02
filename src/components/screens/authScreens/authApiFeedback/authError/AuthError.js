import React, { useState, useContext, useEffect } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { Context as AuthContext } from '../../../../../context/AuthContext'
import './authError.css'

const AuthError = ({ error }) => {
  const [errorMessage, setErrorMessage] = useState('')

  const { clearErrorMessage } = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      console.log('error', error)
      const {
        email,
        password,
        password2,
        notVerified,
        token,
        pin,
        currentPassword,
      } = error
      setErrorMessage(
        email ||
          password ||
          password2 ||
          notVerified ||
          token ||
          pin ||
          currentPassword,
      )
    }
  }, [error])

  const handleResendVerificationEmail = () => {
    clearErrorMessage()
    navigate('/resend-verification-email')
  }

  const renderContent = () => {
    return (
      <div className="auth-error-container-wrapper">
        <div className="auth-error-container" onClick={clearErrorMessage}>
          <div className="auth-error-content-container">
            <div className="auth-error-content">{errorMessage}</div>
            {errorMessage === 'Email address not yet verified' && (
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
