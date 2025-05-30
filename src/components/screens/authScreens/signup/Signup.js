import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import NetworkChecker from '../../../common/NetworkChecker'
import AuthError from '../authApiFeedback/authError/AuthError'
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
    state: { apiMessage, errorMessage },
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
          <label>Username</label>
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
          {!errorMessage ? (
            <div className="auth-title">Sign up</div>
          ) : (
            <AuthError error={errorMessage} />
          )}
          {renderForm()}
        </div>
        <div className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
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

export default Signup
