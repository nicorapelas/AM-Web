import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import NetworkChecker from '../../../common/NetworkChecker'
import AuthError from '../authApiFeedback/authError/AuthError'
import LoadingSpinner from '../../../common/loaders/loadingSpinner/LoadingSpinner'
import { Context as AuthContext } from '../../../../context/AuthContext'
import arcadeLogo from '../../../../assets/images/logo/arcadeManagerLogo.png'
import './signup.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  })

  const {
    state: { loading, apiMessage, errorMessage },
    register,
    clearErrorMessage,
  } = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (apiMessage) {
      navigate('/login')
    }
  }, [apiMessage])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOnFocus = () => {
    clearErrorMessage()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    register(formData)
  }

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleOnFocus}
          />
        </div>
        <div className="auth-form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleOnFocus}
          />
        </div>
        <div className="auth-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            onFocus={handleOnFocus}
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />
    }
    return (
      <div className="login-container">
        <div className="auth-home-content" onClick={() => navigate('/')}>
          <img
            src={arcadeLogo}
            alt="Arcade Manager Logo"
            className="arcade-logo"
          />
        </div>
        <div className="auth-content">
          <div className="auth-title">Sign up</div>
          {renderForm()}
        </div>
        <div className="signup-link" onClick={() => clearErrorMessage()}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page-bed">
      <NetworkChecker />
      {errorMessage && <AuthError error={errorMessage} />}
      {renderContent()}
    </div>
  )
}

export default Signup
