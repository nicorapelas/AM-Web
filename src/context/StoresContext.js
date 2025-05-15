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
    default:
      return state
  }
}

// Actions
const setLoading = (dispatch) => (value) => {
  dispatch({ type: 'LOADING', payload: value })
}

const createStore = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await ngrokApi.post('/stores/create-store', data)
    dispatch({ type: 'USER_STORES', payload: response.data.stores })
    return response.data.staffCredentials
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
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

const deleteStore = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/stores/delete-store`, data)
    dispatch({ type: 'USER_STORES', payload: response.data })
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
  },
  {
    loading: false,
    stores: [],
    userStores: [],
    storeToEdit: null,
    storeSelected: null,
  },
)
