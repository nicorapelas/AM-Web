import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const SupportReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_SUPPORT_REQUESTS':
      return { ...state, supportRequests: action.payload, loading: false }
    case 'SET_USER_SUPPORT_REQUESTS':
      return { ...state, userSupportRequests: action.payload, loading: false }
    case 'SET_SUPPORT_REQUEST':
      return { ...state, supportRequest: action.payload, loading: false }
    case 'SET_SUPPORT_STATS':
      return { ...state, supportStats: action.payload, loading: false }
    case 'SET_SUCCESS_MESSAGE':
      return { ...state, successMessage: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'CLEAR_SUCCESS':
      return { ...state, successMessage: null }
    default:
      return state
  }
}

// Actions
const setLoading = (dispatch) => (value) => {
  dispatch({ type: 'LOADING', payload: value })
}

const addError = (dispatch) => (error) => {
  dispatch({ type: 'ADD_ERROR', payload: error })
}

const clearError = (dispatch) => () => {
  dispatch({ type: 'CLEAR_ERROR' })
}

const setSuccessMessage = (dispatch) => (message) => {
  dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message })
}

const clearSuccess = (dispatch) => () => {
  dispatch({ type: 'CLEAR_SUCCESS' })
}

// Create support request or feature suggestion
const createSupportRequest = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post(
      '/support/create-support-request',
      data,
    )

    if (response.data.success) {
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: response.data.message })
      // Refresh user's support requests
      await fetchUserSupportRequests(dispatch)()
    }

    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Error creating support request'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Fetch all support requests (admin only)
const fetchSupportRequests = (dispatch) => async () => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post('/support/fetch-all-support-requests')
    dispatch({ type: 'SET_SUPPORT_REQUESTS', payload: response.data })
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Error fetching support requests'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
  }
}

// Fetch user's support requests
const fetchUserSupportRequests = (dispatch) => async () => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post('/support/fetch-user-support-requests')
    dispatch({ type: 'SET_USER_SUPPORT_REQUESTS', payload: response.data })
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Error fetching user support requests'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
  }
}

// Fetch specific support request
const fetchSupportRequest = (dispatch) => async (id) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post('/support/fetch-support-request', {
      _id: id,
    })
    dispatch({ type: 'SET_SUPPORT_REQUEST', payload: response.data })
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Error fetching support request'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
  }
}

// Update support request (admin only)
const updateSupportRequest = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post(
      '/support/update-support-request',
      data,
    )

    if (response.data.success) {
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: response.data.message })
      // Refresh support requests
      await fetchSupportRequests(dispatch)()
    }

    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Error updating support request'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Delete support request
const deleteSupportRequest = (dispatch) => async (id) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post('/support/delete-support-request', {
      _id: id,
    })

    if (response.data.success) {
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: response.data.message })
      // Refresh support requests
      await fetchUserSupportRequests(dispatch)()
    }

    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Error deleting support request'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    throw error
  }
}

// Fetch support statistics (admin only)
const fetchSupportStats = (dispatch) => async () => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    const response = await ngrokApi.post('/support/fetch-support-stats')
    dispatch({ type: 'SET_SUPPORT_STATS', payload: response.data })
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Error fetching support statistics'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
  }
}

export const { Provider, Context } = createDataContext(
  SupportReducer,
  {
    setLoading,
    addError,
    clearError,
    setSuccessMessage,
    clearSuccess,
    createSupportRequest,
    fetchSupportRequests,
    fetchUserSupportRequests,
    fetchSupportRequest,
    updateSupportRequest,
    deleteSupportRequest,
    fetchSupportStats,
  },
  {
    loading: false,
    error: null,
    successMessage: null,
    supportRequests: [],
    userSupportRequests: [],
    supportRequest: null,
    supportStats: null,
  },
)
