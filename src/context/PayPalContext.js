import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const PayPalReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SET_AUTH_RESULT':
      return { ...state, authResult: action.payload, loading: false }
    case 'SET_TEST_RESULT':
      return { ...state, testResult: action.payload, loading: false }
    case 'SET_SUBSCRIPTION_RESULT':
      return { ...state, subscriptionResult: action.payload, loading: false }
    case 'SET_SUBSCRIPTION_STATUS':
      return { ...state, subscriptionStatus: action.payload, loading: false }
    case 'SET_SUBSCRIPTION_DETAILS':
      return { ...state, subscriptionDetails: action.payload, loading: false }
    case 'SET_CANCEL_RESULT':
      return { ...state, cancelResult: action.payload, loading: false }
    case 'SET_PAYMENT_HISTORY':
      return {
        ...state,
        paymentHistory: action.payload,
        paymentHistoryLoading: false,
      }
    case 'SET_PAYMENT_SUMMARY':
      return {
        ...state,
        paymentSummary: action.payload,
        paymentHistoryLoading: false,
      }
    case 'SET_PAYMENT_HISTORY_LOADING':
      return { ...state, paymentHistoryLoading: action.payload }
    case 'SET_PAYMENT_HISTORY_ERROR':
      return {
        ...state,
        paymentHistoryError: action.payload,
        paymentHistoryLoading: false,
      }
    case 'CLEAR_PAYMENT_HISTORY_ERROR':
      return { ...state, paymentHistoryError: null }
    case 'PAYMENT_DATA_FETCH_COMPLETE':
      return { ...state, paymentHistoryLoading: false }
    default:
      return state
  }
}

// Actions
const setLoading = (dispatch) => (value) => {
  dispatch({ type: 'LOADING', payload: value })
}

const setError = (dispatch) => (value) => {
  dispatch({ type: 'ADD_ERROR', payload: value })
}

const clearError = (dispatch) => () => {
  dispatch({ type: 'CLEAR_ERROR' })
}

// Check authentication status
const checkAuthStatus = (dispatch) => async () => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.get('/payment/paypal/auth-check')
    dispatch({ type: 'SET_AUTH_RESULT', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Auth check failed:', error)
    console.error('Error response:', error.response?.data)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Test PayPal credentials
const testPayPalCredentials = (dispatch) => async () => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.get('/payment/paypal/test')
    dispatch({ type: 'SET_TEST_RESULT', payload: response.data })
    return response.data
  } catch (error) {
    console.error('PayPal test failed:', error)
    console.error('Error response:', error.response?.data)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Create PayPal subscription
const createPayPalSubscription = (dispatch) => async (storeData) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post(
      '/payment/paypal/create-subscription',
      {
        storeName: storeData.storeName,
        storeData: storeData,
      },
    )
    dispatch({ type: 'SET_SUBSCRIPTION_RESULT', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error creating PayPal subscription:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Check subscription status
const checkSubscriptionStatus = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const { subscriptionId } = data
    const response = await ngrokApi.post(
      '/payment/paypal/check-subscription-status',
      { subscriptionId },
    )

    dispatch({ type: 'SET_SUBSCRIPTION_STATUS', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error checking subscription status:', error)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Activate PayPal subscription
const activatePayPalSubscription = (dispatch) => async (subscriptionId) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post(
      '/payment/paypal/activate-subscription',
      { subscriptionId },
    )

    dispatch({ type: 'SET_SUBSCRIPTION_STATUS', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error activating PayPal subscription:', error)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Get subscription details
const getSubscriptionDetails = (dispatch) => async (subscriptionId) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.get(
      `/payment/paypal/subscription/${subscriptionId}`,
    )

    dispatch({ type: 'SET_SUBSCRIPTION_DETAILS', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error getting subscription details:', error)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Cancel subscription
const cancelSubscription = (dispatch) => async (subscriptionId, reason) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post(
      '/payment/paypal/cancel-subscription',
      { subscriptionId, reason },
    )

    dispatch({ type: 'SET_CANCEL_RESULT', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error canceling subscription:', error)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Payment History Actions

// Fetch payment summary
const fetchPaymentSummary = (dispatch) => async () => {
  try {
    dispatch({ type: 'SET_PAYMENT_HISTORY_LOADING', payload: true })
    dispatch({ type: 'CLEAR_PAYMENT_HISTORY_ERROR' })

    const response = await ngrokApi.get('/payment/payment-summary')
    dispatch({ type: 'SET_PAYMENT_SUMMARY', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error fetching payment summary:', error)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'SET_PAYMENT_HISTORY_ERROR', payload: errorMessage })
    throw error
  }
}

// Fetch user payment history (all stores)
const fetchUserPaymentHistory = (dispatch) => async () => {
  try {
    dispatch({ type: 'SET_PAYMENT_HISTORY_LOADING', payload: true })
    dispatch({ type: 'CLEAR_PAYMENT_HISTORY_ERROR' })

    const response = await ngrokApi.get('/payment/user-payment-history')
    dispatch({ type: 'SET_PAYMENT_HISTORY', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error fetching user payment history:', error)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'SET_PAYMENT_HISTORY_ERROR', payload: errorMessage })
    throw error
  }
}

// Fetch store payment history
const fetchStorePaymentHistory = (dispatch) => async (storeId) => {
  try {
    dispatch({ type: 'SET_PAYMENT_HISTORY_LOADING', payload: true })
    dispatch({ type: 'CLEAR_PAYMENT_HISTORY_ERROR' })

    const response = await ngrokApi.get(
      `/payment/store-payment-history/${storeId}`,
    )
    dispatch({ type: 'SET_PAYMENT_HISTORY', payload: response.data })
    return response.data
  } catch (error) {
    console.error('Error fetching store payment history:', error)
    const errorMessage = error.response?.data?.error || error.message
    dispatch({ type: 'SET_PAYMENT_HISTORY_ERROR', payload: errorMessage })
    throw error
  }
}

// Fetch payment data (summary + history)
const fetchPaymentData =
  (dispatch) =>
  async (selectedStore = null) => {
    try {
      dispatch({ type: 'SET_PAYMENT_HISTORY_LOADING', payload: true })
      dispatch({ type: 'CLEAR_PAYMENT_HISTORY_ERROR' })

      // Fetch payment summary
      const summaryResponse = await ngrokApi.get('/payment/payment-summary')
      dispatch({ type: 'SET_PAYMENT_SUMMARY', payload: summaryResponse.data })

      // Fetch payment history
      const historyUrl = selectedStore
        ? `/payment/store-payment-history/${selectedStore._id}`
        : '/payment/user-payment-history'

      const historyResponse = await ngrokApi.get(historyUrl)
      dispatch({ type: 'SET_PAYMENT_HISTORY', payload: historyResponse.data })

      // Ensure loading is set to false
      dispatch({ type: 'PAYMENT_DATA_FETCH_COMPLETE' })

      return {
        summary: summaryResponse.data,
        history: historyResponse.data,
      }
    } catch (error) {
      console.error('Error fetching payment data:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      const errorMessage = error.response?.data?.error || error.message
      dispatch({ type: 'SET_PAYMENT_HISTORY_ERROR', payload: errorMessage })
      throw error
    }
  }

// Clear payment history error
const clearPaymentHistoryError = (dispatch) => () => {
  dispatch({ type: 'CLEAR_PAYMENT_HISTORY_ERROR' })
}

export const { Provider, Context } = createDataContext(
  PayPalReducer,
  {
    setLoading,
    setError,
    clearError,
    checkAuthStatus,
    testPayPalCredentials,
    createPayPalSubscription,
    checkSubscriptionStatus,
    activatePayPalSubscription,
    getSubscriptionDetails,
    cancelSubscription,
    fetchPaymentSummary,
    fetchUserPaymentHistory,
    fetchStorePaymentHistory,
    fetchPaymentData,
    clearPaymentHistoryError,
  },
  {
    loading: false,
    error: null,
    authResult: null,
    testResult: null,
    subscriptionResult: null,
    subscriptionStatus: null,
    subscriptionDetails: null,
    cancelResult: null,
    paymentHistory: [],
    paymentSummary: null,
    paymentHistoryLoading: false,
    paymentHistoryError: null,
  },
)
