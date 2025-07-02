import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import LoaderFullScreen from '../../../common/loaders/fullScreenLoader/LoaderFullScreen'
import AuthError from '../authApiFeedback/authError/AuthError'
import AuthSuccess from '../authApiFeedback/authSuccess/AuthSuccess'
import NetworkChecker from '../../../common/NetworkChecker'
import { Context as AuthContext } from '../../../../context/AuthContext'
import './login.css'
import arcadeLogo from '../../../../assets/images/logo/arcadeManagerLogo.png'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const {
    state: { loading, apiMessage, errorMessage },
    login,
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
    login(formData)
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
        <button type="submit" className="signup-button">
          Login
        </button>
      </form>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <LoaderFullScreen />
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
          <div className="auth-title">Login</div>
          {renderForm()}
        </div>
        <div className="forgot-password-link" onClick={handleOnFocus}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="signup-link" onClick={handleOnFocus}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page-bed">
      <NetworkChecker />
      {!errorMessage ? null : <AuthError error={errorMessage} />}
      {!apiMessage ? null : <AuthSuccess />}
      {renderContent()}
    </div>
  )
}

export default Login
