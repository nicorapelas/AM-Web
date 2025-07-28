import React, { useState, useContext, useEffect } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { Context as AuthContext } from '../../../../../context/AuthContext'
import './authSuccess.css'

const AuthSuccess = () => {
  const [successMessage, setSuccessMessage] = useState(null)

  const navigate = useNavigate()

  const {
    state: { apiMessage },
    clearApiMessage,
  } = useContext(AuthContext)

  useEffect(() => {
    if (apiMessage) {
      const { success } = apiMessage
      setSuccessMessage(success)
    }
  }, [apiMessage])

  useEffect(() => {
    if (apiMessage) {
      const { success } = apiMessage
      if (success === 'Account deleted successfully') {
        navigate('/')
      }
    }
  }, [apiMessage])

  const renderContent = () => {
    if (!successMessage) return null

    return (
      <div className="auth-success-container-wrapper">
        <div className="auth-success-container" onClick={clearApiMessage}>
          <div className="auth-success-content">{successMessage}</div>
          <IoIosCloseCircle className="auth-success-icon" />
        </div>
      </div>
    )
  }

  return renderContent()
}

export default AuthSuccess
