import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Context as AuthContext } from '../../../../context/AuthContext'
import logo from '../../../../assets/images/logo/arcadeManagerLogo.png'
import AuthError from '../authApiFeedback/authError/AuthError'
import AuthSuccess from '../authApiFeedback/authSuccess/AuthSuccess'
import NetworkChecker from '../../../common/NetworkChecker'
import LoadingSpinner from '../../../common/loaders/loadingSpinner/LoadingSpinner'
import './updatePassword.css'

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  })

  const { token } = useParams()
  const navigate = useNavigate()

  const {
    state: { loading, apiMessage, errorMessage },
    updatePassword,
    clearErrorMessage,
    clearApiMessage,
  } = useContext(AuthContext)

  useEffect(() => {
    if (apiMessage) {
      let timer = setTimeout(() => {
        navigate('/login')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [apiMessage])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOnFocus = () => {
    clearErrorMessage()
    clearApiMessage()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updatePassword({
      token,
      password: formData.password,
      password2: formData.password2,
    })
  }

  const handleClickLogin = () => {
    clearErrorMessage()
    clearApiMessage()
  }

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleOnFocus}
            required
            minLength="6"
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
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="signup-button">
          Update Password
        </button>
      </form>
    )
  }

  const headerSelector = () => {
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
        {headerSelector()}
        <div className="auth-home-content">
          <img src={logo} alt="Arcade Manager Logo" className="arcade-logo" />
        </div>
        <div className="auth-content">
          <div className="auth-title">Update Password</div>
          {renderForm()}
        </div>
        <div className="signup-link" onClick={handleClickLogin}>
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

export default UpdatePassword
