import React from 'react'
import { useNavigate } from 'react-router-dom'
import './backButton.css'
import { CgArrowLeft } from 'react-icons/cg'

const BackButton = ({ to = -1 }) => {
  const navigate = useNavigate()

  const handleBack = () => {
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
