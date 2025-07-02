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
    state: { loading, user },
    verifyEmail,
  } = useContext(AuthContext)

  useEffect(() => {
    if (!checkDone) {
      verifyEmail({ _id: params.id })
      setCheckDone(true)
    }
  }, [checkDone, params])

  useEffect(() => {
    if (user) {
      const { emailVerified } = user
      if (emailVerified) {
        let run = setTimeout(() => {
          navigate('/login')
        }, 6000)
        return () => clearTimeout(run)
      }
    }
  }, [user])

  if (loading) {
    return <LoadingSpinner />
  }

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

export default EmailVerified
