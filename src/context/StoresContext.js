import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const CommonReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'ALL_STORES':
      return { ...state, stores: action.payload, loading: false }
    case 'USER_STORES':
      return { ...state, userStores: action.payload, loading: false }
    case 'SET_STORE_TO_EDIT':
      return { ...state, storeToEdit: action.payload }
    case 'SET_STORE_SELECTED':
      return { ...state, storeSelected: action.payload }
    case 'SET_NEW_STORE_TO_ADD':
      return { ...state, newStoreToAdd: action.payload }
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

const createStore = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    dispatch({ type: 'ADD_ERROR', payload: null }) // Clear any previous errors

    const response = await ngrokApi.post('/stores/create-store', data)

    if (response.data && response.data.stores) {
      dispatch({ type: 'USER_STORES', payload: response.data.stores })
      return response.data.staffCredentials
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (error) {
    console.error('Error creating store:', error)
    const errorMessage =
      error.response?.data?.error || error.message || 'Failed to create store'
    dispatch({ type: 'ADD_ERROR', payload: errorMessage })
    return null
  } finally {
    dispatch({ type: 'LOADING', payload: false })
  }
}

const fetchUserStores = (dispatch) => async () => {
  dispatch({ type: 'LOADING', payload: true })
  const response = await ngrokApi.get('/stores/user-stores')
  dispatch({ type: 'USER_STORES', payload: response.data })
}

const editStore = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await ngrokApi.post(`/stores/edit-store`, data)
    dispatch({ type: 'USER_STORES', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const setStoreToEdit = (dispatch) => async (data) => {
  dispatch({ type: 'SET_STORE_TO_EDIT', payload: data })
}

const setStoreSelected = (dispatch) => async (data) => {
  dispatch({ type: 'SET_STORE_SELECTED', payload: data })
}

const deleteStore = (dispatch) => async (storeId) => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/stores/delete-store`, storeId)

    // Handle the enhanced response that includes PayPal cancellation info
    if (response.data.stores) {
      dispatch({ type: 'USER_STORES', payload: response.data.stores })
    } else {
      // Fallback for old response format
      dispatch({ type: 'USER_STORES', payload: response.data })
    }
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const fetchStore = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  const response = await ngrokApi.post(`/stores/fetch-store`, data)
  dispatch({ type: 'USER_STORES', payload: response.data })
}

const setNewStoreToAdd = (dispatch) => async (data) => {
  dispatch({ type: 'SET_NEW_STORE_TO_ADD', payload: data })
}

export const { Provider, Context } = createDataContext(
  CommonReducer,
  {
    setLoading,
    createStore,
    fetchUserStores,
    editStore,
    setStoreToEdit,
    setStoreSelected,
    deleteStore,
    fetchStore,
    setNewStoreToAdd,
    setError,
  },
  {
    loading: false,
    stores: [],
    userStores: [],
    storeToEdit: null,
    storeSelected: null,
    newStoreToAdd: null,
    error: null,
  },
)
