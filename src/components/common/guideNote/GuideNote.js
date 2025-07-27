import React, { useState } from 'react'
import './guideNote.css'

const GuideNote = ({ message, onNext, onPrev, onClose, step, totalSteps }) => {
  const [minimized, setMinimized] = useState(false)

  if (minimized) {
    return (
      <button
        className="guide-note-minimized-btn"
        onClick={() => setMinimized(false)}
        aria-label="Show Guide"
      >
        🛈 Guide
      </button>
    )
  }

  return (
    <div className="guide-note-container">
      <div className="guide-note-content">
        <button
          className="guide-note-minimize-btn"
          onClick={() => setMinimized(true)}
          aria-label="Minimize Guide"
        >
          =
        </button>
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
          {onClose && (
            <button
              className="guide-note-btn guide-note-btn-close"
              onClick={onClose}
            >
              {step === totalSteps - 1 ? 'Close' : 'Skip'}
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
