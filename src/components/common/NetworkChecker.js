import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Context as AuthContext } from '../../context/AuthContext'

const NetworkChecker = () => {
  const {
    state: { networkError: authNetworkError },
  } = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (authNetworkError) {
      navigate('/network-error')
    }
  }, [authNetworkError])

  return null
}

export default NetworkChecker
