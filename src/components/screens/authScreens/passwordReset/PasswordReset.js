import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import logo from '../../../../assets/images/logo/arcadeManagerLogo.png'
import AuthError from '../authApiFeedback/authError/AuthError'
import AuthSuccess from '../authApiFeedback/authSuccess/AuthSuccess'
import NetworkChecker from '../../../common/NetworkChecker'
import LoadingSpinner from '../../../common/loaders/loadingSpinner/LoadingSpinner'
import { Context as AuthContext } from '../../../../context/AuthContext'
import './passwordReset.css'

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    email: '',
  })

  const {
    state: { loading, apiMessage, errorMessage, networkError },
    forgotPassword,
    clearErrorMessage,
    clearApiMessage,
  } = useContext(AuthContext)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOnFocus = () => {
    clearErrorMessage()
    clearApiMessage()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    forgotPassword(formData)
  }

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleOnFocus}
            required
          />
        </div>
        <button type="submit" className="signup-button">
          Reset Password
        </button>
      </form>
    )
  }

  const apiMessageSelector = () => {
    if (apiMessage) {
      return <AuthSuccess />
    }
    if (errorMessage) {
      return <AuthError error={errorMessage} />
    }
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />
    }
    return (
      <div className="login-container">
        {apiMessageSelector()}
        <div className="auth-home-content">
          <img src={logo} alt="Arcade Manager Logo" className="arcade-logo" />
        </div>
        <div className="auth-content">
          <div className="auth-title">Reset Password</div>
          {renderForm()}
        </div>
        <div className="signup-link">
          Remember your password? <Link to="/login">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <NetworkChecker />
      {renderContent()}
    </>
  )
}

export default PasswordReset
