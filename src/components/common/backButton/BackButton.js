import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './backButton.css'
import { CgArrowLeft } from 'react-icons/cg'
import { Context as AuthContext } from '../../../context/AuthContext'

const BackButton = ({ to = -1 }) => {
  const navigate = useNavigate()

  const { clearErrorMessage, clearApiMessage } = useContext(AuthContext)

  const handleBack = () => {
    clearErrorMessage()
    clearApiMessage()
    if (to === -1) {
      navigate(-1)
    } else {
      navigate(to)
    }
  }

  return (
    <button className="back-btn" onClick={handleBack}>
      <CgArrowLeft size={20} />
      Back
    </button>
  )
}

export default BackButton
