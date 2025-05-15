import React from 'react'
import './loadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="stars-background"></div>
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-text">Loading...</div>
      </div>
    </div>
  )
}

export default LoadingSpinner
