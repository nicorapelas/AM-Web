import axios from './ngrok'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

// Check authentication status
export const checkAuthStatus = async () => {
  try {
    console.log('Checking authentication status...')
    const response = await axios.get(
      `${API_BASE_URL}/payment/paypal/auth-check`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    console.log('Auth check response:', response.data)
    return response.data
  } catch (error) {
    console.error('Auth check failed:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

// Test PayPal credentials
export const testPayPalCredentials = async () => {
  try {
    console.log('Testing PayPal credentials...')
    const response = await axios.get(`${API_BASE_URL}/payment/paypal/test`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('PayPal test response:', response.data)
    return response.data
  } catch (error) {
    console.error('PayPal test failed:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

// Create PayPal subscription
export const createPayPalSubscription = async (storeData) => {
  try {
    console.log('Creating PayPal subscription for store:', storeData)
    const response = await axios.post(
      `${API_BASE_URL}/payment/paypal/create-subscription`,
      {
        storeName: storeData.storeName,
        storeData: storeData,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    console.log('PayPal subscription response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating PayPal subscription:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    throw error
  }
}

// Check subscription status
export const checkSubscriptionStatus = async (subscriptionId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/paypal/check-subscription-status`,
      { subscriptionId },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error checking subscription status:', error)
    throw error
  }
}

// Activate PayPal subscription (now checks status instead of manual activation)
export const activatePayPalSubscription = async (subscriptionId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/paypal/activate-subscription`,
      { subscriptionId },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error activating PayPal subscription:', error)
    throw error
  }
}

// Get subscription details
export const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payment/paypal/subscription/${subscriptionId}`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error getting subscription details:', error)
    throw error
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId, reason) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/paypal/cancel-subscription`,
      { subscriptionId, reason },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}
