import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as SupportContext } from '../../../context/SupportContext'
import Header from '../../common/header/Header'
import './contactSupport.css'

const ContactSupport = () => {
  const navigate = useNavigate()

  const {
    state: { user },
  } = useContext(AuthContext)

  const {
    state: { loading, error, successMessage },
    createSupportRequest,
    clearError,
    clearSuccess,
  } = useContext(SupportContext)

  const [currentStage, setCurrentStage] = useState(1)
  const [formType, setFormType] = useState('') // 'support' or 'feature'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'Medium',
    category: 'General',
    featureName: '',
    featureDescription: '',
    useCase: '',
    impact: 'Medium',
  })

  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        email: user.email,
        name: user.name || user.username || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (error) {
      let timeout = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [error])

  useEffect(() => {
    if (successMessage) {
      let timeout = setTimeout(() => {
        clearSuccess()
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [successMessage])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFormTypeSelect = (type) => {
    setFormType(type)
    setCurrentStage(2)
  }

  const handleNext = () => {
    setCurrentStage(currentStage + 1)
  }

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Prepare the data based on form type
      const submitData = {
        formType,
        name: formData.name,
        email: formData.email,
      }

      if (formType === 'support') {
        submitData.category = formData.category
        submitData.priority = formData.priority
        submitData.subject = formData.subject
        submitData.message = formData.message
      } else if (formType === 'feature') {
        submitData.featureName = formData.featureName
        submitData.featureDescription = formData.featureDescription
        submitData.useCase = formData.useCase
        submitData.impact = formData.impact
      }

      // Submit the support request
      await createSupportRequest(submitData)

      // Show success message and navigate
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      // Error is already handled by the context
      console.error('Error submitting support request:', error)
    }
  }

  // Display error message if there is one
  const renderErrorMessage = () => {
    if (error) {
      return (
        <div className="contact-support-error">
          <span className="contact-support-error-icon">⚠️</span>
          <span className="contact-support-error-text">{error}</span>
        </div>
      )
    }
    return null
  }

  // Display success message if there is one
  const renderSuccessMessage = () => {
    if (successMessage) {
      return (
        <div className="contact-support-success">
          <span className="contact-support-success-icon">✅</span>
          <span className="contact-support-success-text">{successMessage}</span>
        </div>
      )
    }
    return null
  }

  const renderStage1 = () => (
    <div className="contact-support-stage">
      <div className="contact-support-header">
        <h2 className="contact-support-title">How can we help?</h2>
        <p className="contact-support-subtitle">
          Choose the type of request you'd like to submit
        </p>
      </div>

      <div className="contact-support-toggle-container">
        <button
          className={`contact-support-toggle-btn ${formType === 'support' ? 'active' : ''}`}
          onClick={() => handleFormTypeSelect('support')}
        >
          <span className="toggle-icon">🆘</span>
          <span className="toggle-text">Need Support?</span>
          <span className="toggle-description">
            Get help with issues or questions
          </span>
        </button>

        <button
          className={`contact-support-toggle-btn ${formType === 'feature' ? 'active' : ''}`}
          onClick={() => handleFormTypeSelect('feature')}
        >
          <span className="toggle-icon">💡</span>
          <span className="toggle-text">Feature Suggestion</span>
          <span className="toggle-description">
            Suggest new features or improvements
          </span>
        </button>
      </div>
    </div>
  )

  const renderSupportStage2 = () => (
    <div className="contact-support-stage">
      <div className="contact-support-header">
        <h2 className="contact-support-title">Support Request</h2>
        <p className="contact-support-subtitle">Tell us about your issue</p>
      </div>

      <div className="contact-support-form-row">
        <div className="contact-support-form-group">
          <label className="contact-support-label" htmlFor="category">
            What type of issue?
          </label>
          <select
            className="contact-support-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category...</option>
            <option value="Technical">Technical Problem</option>
            <option value="Billing">Billing Question</option>
            <option value="Account">Account Issue</option>
            <option value="Bug">Bug Report</option>
            <option value="General">General Question</option>
          </select>
        </div>

        <div className="contact-support-form-group">
          <label className="contact-support-label" htmlFor="priority">
            How urgent is this?
          </label>
          <select
            className="contact-support-select"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="">Select priority...</option>
            <option value="Low">Low - Not blocking</option>
            <option value="Medium">Medium - Somewhat important</option>
            <option value="High">High - Blocking work</option>
            <option value="Urgent">Urgent - Critical issue</option>
          </select>
        </div>
      </div>

      <div className="contact-support-button-container">
        <button
          type="button"
          className="contact-support-back-btn"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="contact-support-next-btn"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  )

  const renderFeatureStage2 = () => (
    <div className="contact-support-stage">
      <div className="contact-support-header">
        <h2 className="contact-support-title">Feature Suggestion</h2>
        <p className="contact-support-subtitle">Tell us about your idea</p>
      </div>

      <div className="contact-support-form-group">
        <label className="contact-support-label" htmlFor="featureName">
          What would you call this feature?
        </label>
        <input
          className="contact-support-input"
          type="text"
          id="featureName"
          name="featureName"
          value={formData.featureName}
          onChange={handleChange}
          placeholder="e.g., Dark Mode, Export Reports, etc."
          required
        />
      </div>

      <div className="contact-support-form-group">
        <label className="contact-support-label" htmlFor="featureDescription">
          Describe the feature
        </label>
        <textarea
          className="contact-support-textarea"
          id="featureDescription"
          name="featureDescription"
          value={formData.featureDescription}
          onChange={handleChange}
          placeholder="What should this feature do? How would it work?"
          rows="4"
          required
        />
      </div>

      <div className="contact-support-button-container">
        <button
          type="button"
          className="contact-support-back-btn"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="contact-support-next-btn"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  )

  const renderSupportStage3 = () => (
    <div className="contact-support-stage">
      <div className="contact-support-header">
        <h2 className="contact-support-title">Support Request</h2>
        <p className="contact-support-subtitle">Provide more details</p>
      </div>

      <div className="contact-support-form-group">
        <label className="contact-support-label" htmlFor="subject">
          Brief description of your issue
        </label>
        <input
          className="contact-support-input"
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g., Can't add new games, Payment failed, etc."
          required
        />
      </div>

      <div className="contact-support-form-group">
        <label className="contact-support-label" htmlFor="message">
          Detailed description
        </label>
        <textarea
          className="contact-support-textarea"
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Please provide step-by-step details about what happened, what you expected, and any error messages you saw..."
          rows="6"
          required
        />
      </div>

      <div className="contact-support-button-container">
        <button
          type="button"
          className="contact-support-back-btn"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="contact-support-next-btn"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  )

  const renderFeatureStage3 = () => (
    <div className="contact-support-stage">
      <div className="contact-support-header">
        <h2 className="contact-support-title">Feature Suggestion</h2>
        <p className="contact-support-subtitle">
          Help us understand the impact
        </p>
      </div>

      <div className="contact-support-form-group">
        <label className="contact-support-label" htmlFor="useCase">
          How would you use this feature?
        </label>
        <textarea
          className="contact-support-textarea"
          id="useCase"
          name="useCase"
          value={formData.useCase}
          onChange={handleChange}
          placeholder="Describe a specific scenario where this feature would be helpful..."
          rows="4"
          required
        />
      </div>

      <div className="contact-support-form-group">
        <label className="contact-support-label" htmlFor="impact">
          How important is this to you?
        </label>
        <select
          className="contact-support-select"
          id="impact"
          name="impact"
          value={formData.impact}
          onChange={handleChange}
          required
        >
          <option value="">Select impact level...</option>
          <option value="Low">Nice to have</option>
          <option value="Medium">Would be helpful</option>
          <option value="High">Very important</option>
          <option value="Critical">Essential for my workflow</option>
        </select>
      </div>

      <div className="contact-support-button-container">
        <button
          type="button"
          className="contact-support-back-btn"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="contact-support-next-btn"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  )

  const renderFinalStage = () => (
    <div className="contact-support-stage">
      <div className="contact-support-header">
        <h2 className="contact-support-title">Contact Information</h2>
        <p className="contact-support-subtitle">So we can get back to you</p>
      </div>

      <div className="contact-support-form-row">
        <div className="contact-support-form-group">
          <label className="contact-support-label" htmlFor="name">
            Full Name
          </label>
          <input
            className="contact-support-input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="contact-support-form-group">
          <label className="contact-support-label" htmlFor="email">
            Email Address
          </label>
          <input
            className="contact-support-input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="contact-support-info">
        <div className="contact-support-info-item">
          <span className="contact-support-info-icon">📧</span>
          <span className="contact-support-info-text">
            We typically respond within 2 business days
          </span>
        </div>
        <div className="contact-support-info-item">
          <span className="contact-support-info-icon">🔒</span>
          <span className="contact-support-info-text">
            Your information is secure and confidential
          </span>
        </div>
      </div>

      <div className="contact-support-button-container">
        <button
          type="button"
          className="contact-support-back-btn"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="contact-support-submit-btn"
          disabled={loading}
        >
          {loading
            ? 'Submitting...'
            : formType === 'support'
              ? 'Send Support Request'
              : 'Submit Feature Suggestion'}
        </button>
      </div>
    </div>
  )

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 1:
        return renderStage1()
      case 2:
        return formType === 'support'
          ? renderSupportStage2()
          : renderFeatureStage2()
      case 3:
        return formType === 'support'
          ? renderSupportStage3()
          : renderFeatureStage3()
      case 4:
        return renderFinalStage()
      default:
        return renderStage1()
    }
  }

  return (
    <div className="contact-support-page-container">
      <div className="contact-support-stars-bg"></div>
      <Header />
      <div className="contact-support-form-container">
        <form className="contact-support-form" onSubmit={handleSubmit}>
          {renderErrorMessage()}
          {renderSuccessMessage()}
          {renderCurrentStage()}
        </form>
      </div>
    </div>
  )
}

export default ContactSupport
