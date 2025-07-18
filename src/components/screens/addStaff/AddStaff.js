import React, { useState, useContext, useEffect } from 'react'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as StaffContext } from '../../../context/StaffContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import Header from '../../common/header/Header'
import './addStaff.css'

const AddStaff = () => {
  const {
    state: { loading, storeSelected, userStores },
  } = useContext(StoresContext)

  const { createStaff } = useContext(StaffContext)

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    storeId: storeSelected?._id,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: 'Staff',
    startDate: '',
    hourlyRate: '',
    isActive: true,
    username: '',
    paymentTerms: 'Monthly',
    paymentMethod: 'Cash',
    paymentValue: '',
    pin: String(Math.floor(1000 + Math.random() * 9000)),
    editFinancialEnabled: false,
    deleteFinancialEnabled: false,
  })

  const generateUsername = (firstName, lastName) => {
    if (!firstName || !lastName) return ''
    const firstPart = firstName.toLowerCase().slice(0, 3)
    const secondPart = lastName.toLowerCase().slice(0, 3)
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `${firstPart}${secondPart}${randomNum}`
  }

  useEffect(() => {
    if (!userStores || userStores.length === 0) {
      navigate('/dashboard')
    }
  }, [userStores])

  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const username = generateUsername(formData.firstName, formData.lastName)
      setFormData((prev) => ({ ...prev, username }))
    }
  }, [formData.firstName, formData.lastName])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createStaff(formData)
    navigate('/staff')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="add-staff-page-container">
      <div className="add-staff-stars-bg"></div>
      <Header />
      <div className="add-staff-form-container">
        <form className="add-staff-form" onSubmit={handleSubmit}>
          <div className="add-staff-form-row">
            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="firstName">
                First Name
              </label>
              <input
                className="add-staff-input"
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="add-staff-input"
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="add-staff-form-row">
            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="email">
                Email
              </label>
              <input
                className="add-staff-input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="phone">
                Phone
              </label>
              <input
                className="add-staff-input"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="add-staff-form-row">
            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="position">
                Position
              </label>
              <select
                className="add-staff-select"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Cashier">Cashier</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Security">Security</option>
                <option value="Handyman">Handyman</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="startDate">
                Start Date
              </label>
              <input
                className="add-staff-input"
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="toggle-switch-container">
            <label className="toggle-switch-label" htmlFor="isActive">
              <div
                className={`toggle-switch ${formData.isActive ? 'active' : ''}`}
              >
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              </div>
              Active Employee
            </label>
          </div>

          <div className="add-staff-credentials">
            <div className="add-staff-credentials-item">
              <label className="add-staff-label">Username:</label>
              <span className="add-staff-username">{formData.username}</span>
            </div>
            <div className="add-staff-credentials-item">
              <label className="add-staff-label">PIN:</label>
              <span className="add-staff-password">{formData.pin}</span>
            </div>
          </div>

          <div className="add-staff-form-row">
            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="paymentTerms">
                Payment Terms
              </label>
              <select
                className="add-staff-select"
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>
          </div>

          <div className="add-staff-form-row">
            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                className="add-staff-select"
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">EFT</option>
              </select>
            </div>
          </div>

          <div className="add-staff-form-row">
            <div className="add-staff-form-group">
              <label className="add-staff-label" htmlFor="paymentValue">
                Payment Value
              </label>
              <input
                className="add-staff-value-input"
                type="number"
                id="paymentValue"
                name="paymentValue"
                value={formData.paymentValue}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="toggle-switch-container">
            <label
              className="toggle-switch-label"
              htmlFor="editFinancialEnabled"
            >
              <div
                className={`toggle-switch ${formData.editFinancialEnabled ? 'active' : ''}`}
              >
                <input
                  type="checkbox"
                  id="editFinancialEnabled"
                  name="editFinancialEnabled"
                  checked={formData.editFinancialEnabled}
                  onChange={handleChange}
                />
              </div>
              Enable Financial Edit
            </label>
          </div>

          <div className="toggle-switch-container">
            <label
              className="toggle-switch-label"
              htmlFor="deleteFinancialEnabled"
            >
              <div
                className={`toggle-switch ${formData.deleteFinancialEnabled ? 'active' : ''}`}
              >
                <input
                  type="checkbox"
                  id="deleteFinancialEnabled"
                  name="deleteFinancialEnabled"
                  checked={formData.deleteFinancialEnabled}
                  onChange={handleChange}
                />
              </div>
              Enable Financial Delete
            </label>
          </div>

          <div className="add-staff-button-container">
            <button type="submit" className="add-staff-submit-btn">
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStaff
