import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Context as AuthContext } from '../../../../context/AuthContext'
import LoadingSpinner from '../../../common/loaders/loadingSpinner/LoadingSpinner'
import './emailVerified.css'

const EmailVerified = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [checkDone, setCheckDone] = useState(false)

  const {
    state: { loading, user, errorMessage },
    verifyEmail,
    clearErrorMessage,
  } = useContext(AuthContext)

  useEffect(() => {
    if (!checkDone) {
      verifyEmail({ _id: params.id })
      setCheckDone(true)
    }
  }, [checkDone, params])

  useEffect(() => {
    if (user && !errorMessage) {
      const { emailVerified } = user
      if (emailVerified) {
        let run = setTimeout(() => {
          navigate('/login')
        }, 6000)
        return () => clearTimeout(run)
      }
    }
  }, [user, errorMessage])

  const handleResendVerification = () => {
    clearErrorMessage()
    navigate('/resend-verification-email')
  }

  const handleBackToLogin = () => {
    clearErrorMessage()
    navigate('/login')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Check for error message first
  if (errorMessage) {
    const { token } = errorMessage
    if (token) {
      return (
        <div className="email-verified-container">
          <div className="email-verified-content">
            <h1>Verification Failed</h1>
            <p>{token}</p>
            <p>The verification link may have expired or is invalid.</p>
            <div className="email-verified-buttons">
              <button
                onClick={handleResendVerification}
                className="email-verified-resend-btn"
              >
                Resend Verification Email
              </button>
              <button
                onClick={handleBackToLogin}
                className="email-verified-back-btn"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  // Only show success if we have a user and no errors
  if (user && !errorMessage) {
    const { emailVerified } = user
    if (emailVerified) {
      return (
        <div className="email-verified-container">
          <div className="email-verified-content">
            <h1>Email Verified!</h1>
            <p>Your email has been successfully verified.</p>
            <p>You can now close this window and return to the application.</p>
          </div>
        </div>
      )
    }
  }

  // Show loading or processing state if no user yet and no error
  return (
    <div className="email-verified-container">
      <div className="email-verified-content">
        <h1>Verifying Email...</h1>
        <p>Please wait while we verify your email address.</p>
      </div>
    </div>
  )
}

export default EmailVerified
