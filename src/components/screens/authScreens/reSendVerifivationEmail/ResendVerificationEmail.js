import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import AuthError from '../authApiFeedback/authError/AuthError'
import AuthSuccess from '../authApiFeedback/authSuccess/AuthSuccess'
import { Context as AuthContext } from '../../../../context/AuthContext'
import LoadingSpinner from '../../../common/loaders/loadingSpinner/LoadingSpinner'
import './resendVerificationEmail.css'

const ResendVerificationEmail = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const {
    state: { loading, apiMessage, errorMessage },
    resendVerificationEmail,
    clearApiMessage,
    clearErrorMessage,
  } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    clearApiMessage()
    clearErrorMessage()
    if (!email) {
      setError('Please enter your email address')
      return
    }

    try {
      const response = await resendVerificationEmail({ email })
      setMessage(response.success)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to resend verification email')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const handleBackToLogin = () => {
    clearApiMessage()
    clearErrorMessage()
    navigate('/login')
  }

  return (
    <div className="resend-verification-container">
      <div className="resend-verification-content">
        {apiMessage && <AuthSuccess message={apiMessage} />}
        {errorMessage && <AuthError error={errorMessage} />}
        {errorMessage || apiMessage ? null : (
          <>
            <h1>Email not verified</h1>
            <p>
              Your email address is not yet verified. Please check your inbox,
              including spam and junk folders, to find the verification email.
              If you did not receive it and would like us to resend the
              verification email, please enter your email address below and
              click "Send."
            </p>
          </>
        )}

        <div className="resend-form-container">
          <form onSubmit={handleSubmit} className="resend-form">
            <div className="resend-form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="resend-email-input"
              />
            </div>
            <button type="submit" className="resend-button">
              Send
            </button>
          </form>
        </div>

        <button onClick={handleBackToLogin} className="back-button">
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default ResendVerificationEmail
