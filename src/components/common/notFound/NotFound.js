import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/fullScreenLoader/LoaderFullScreen'
import './notFound.css'

const NotFound = () => {
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let timer = setTimeout(() => {
      navigate('/')
    }, 7000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <div className="error-divider"></div>
        <h2 className="error-message">Page Not Found</h2>
        <p className="error-description">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="home-button">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
