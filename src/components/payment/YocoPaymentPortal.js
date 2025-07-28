import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Context as YocoContext } from '../../context/YocoContext'
import './yocoPaymentProtal.css'

const YocoPaymentPortal = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [cardToBuy, setCardToBuy] = useState(null)

  const {
    state: { confirmPurchase, paymentTriggered },
    initiatePayment,
    setConfirmPurchase,
    setPaymentTriggered,
  } = useContext(YocoContext)

  useEffect(() => {
    if (!loading) {
      let timer = setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    if (confirmPurchase && cardToBuy) {
      setPaymentTriggered(true)
    }
  }, [confirmPurchase, cardToBuy])

  useEffect(() => {
    if (paymentTriggered) {
      handleConfirmedPurchase()
    }
  }, [paymentTriggered])

  const navigate = useNavigate()

  const handleConfirmedPurchase = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await initiatePayment({
        amountInCents: cardToBuy.price,
        currency: 'ZAR',
        productCode: cardToBuy.productCode,
      })

      if (response?.redirectUrl) {
        window.location.href = response.redirectUrl
      } else {
        setError('No redirect URL available')
        setLoading(false)
      }
    } catch (error) {
      setError(error.message || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  const handlePayment = async (productCode, price) => {
    console.log(`im running...!`)
    try {
      setLoading(true)
      setError(null)

      const startTime = Date.now()
      localStorage.setItem('paymentStartTime', startTime)
      localStorage.setItem('paymentInProgress', 'true')

      const response = await initiatePayment({
        amountInCents: price,
        currency: 'ZAR',
        productCode: productCode,
      })

      if (response?.redirectUrl) {
        window.location.href = response.redirectUrl
      } else {
        setError('No redirect URL available')
        setLoading(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError(error.message || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  return (
    <div className="payment-container">
      <h2>Make Payment</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="payment-status">{loading ? 'Processing...' : ''}</div>
    </div>
  )
}

export default YocoPaymentPortal
