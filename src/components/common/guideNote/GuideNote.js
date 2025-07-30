import React, { useState, useEffect, useRef } from 'react'
import './guideNote.css'

const GuideNote = ({
  message,
  onNext,
  onPrev,
  onClose,
  onRestart,
  step,
  totalSteps,
}) => {
  const [minimized, setMinimized] = useState(true)
  const [showEndTourConfirm, setShowEndTourConfirm] = useState(false)
  const [showMinimizedMenu, setShowMinimizedMenu] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMinimizedMenu(false)
      }
    }

    if (showMinimizedMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMinimizedMenu])

  const handleEndTour = () => {
    setShowEndTourConfirm(true)
  }

  const confirmEndTour = () => {
    setShowEndTourConfirm(false)
    onClose()
  }

  const cancelEndTour = () => {
    setShowEndTourConfirm(false)
  }

  const restartTour = () => {
    setShowMinimizedMenu(false)
    if (onRestart) {
      onRestart()
    }
  }

  if (minimized) {
    return (
      <div className="guide-note-minimized-container">
        <button
          className="guide-note-minimized-btn"
          onClick={() => setMinimized(false)}
          aria-label="Show Guide"
        >
          <span className="guide-icon">🛈</span>
          <span className="guide-text">Guide</span>
        </button>
        {showMinimizedMenu && (
          <div className="guide-note-minimized-menu" ref={menuRef}>
            <button
              className="guide-note-menu-btn"
              onClick={() => setMinimized(false)}
            >
              Continue Tour
            </button>
            <button className="guide-note-menu-btn" onClick={restartTour}>
              Restart Tour
            </button>
            <button
              className="guide-note-menu-btn guide-note-menu-btn-close"
              onClick={onClose}
            >
              End Tour
            </button>
          </div>
        )}
        <button
          className="guide-note-menu-toggle"
          onClick={() => setShowMinimizedMenu(!showMinimizedMenu)}
          aria-label="Toggle Guide Menu"
        >
          ⋯
        </button>
      </div>
    )
  }

  if (showEndTourConfirm) {
    return (
      <div className="guide-note-container">
        <div className="guide-note-content">
          <div className="guide-note-header">
            <div></div> {/* Empty div for spacing */}
            <button
              className="guide-note-minimize-btn"
              onClick={() => setMinimized(true)}
              aria-label="Minimize Guide"
            >
              HIDE
            </button>
          </div>
          <div className="guide-note-message">
            Are you sure you want to end the tour? You can restart it anytime
            from the guide button.
          </div>
          <div className="guide-note-navigation">
            <button className="guide-note-btn" onClick={cancelEndTour}>
              Continue Tour
            </button>
            <button
              className="guide-note-btn guide-note-btn-close"
              onClick={confirmEndTour}
            >
              End Tour
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="guide-note-container">
      <div className="guide-note-content">
        <div className="guide-note-header">
          <button
            className="guide-note-end-tour-btn"
            onClick={handleEndTour}
            aria-label="End Tour"
          >
            END TOUR
          </button>
          <button
            className="guide-note-minimize-btn"
            onClick={() => setMinimized(true)}
            aria-label="Minimize Guide"
          >
            HIDE
          </button>
        </div>
        <div className="guide-note-message">{message}</div>
        <div className="guide-note-navigation">
          {onPrev && (
            <button className="guide-note-btn" onClick={onPrev}>
              Back
            </button>
          )}
          {onNext && (
            <button className="guide-note-btn" onClick={onNext}>
              {step === totalSteps - 1 ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
        <div className="guide-note-step-indicator">
          Step {step + 1} of {totalSteps}
        </div>
      </div>
    </div>
  )
}

export default GuideNote
