import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const CommonReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'ALL_STAFF':
      return { ...state, staff: action.payload, loading: false }
    case 'USER_STAFF':
      return { ...state, userStaff: action.payload, loading: false }
    case 'STORE_STAFF':
      return { ...state, storeStaff: action.payload, loading: false }
    case 'SET_STAFF_TO_EDIT':
      return { ...state, staffToEdit: action.payload }
    case 'SET_STAFF_SELECTED':
      return { ...state, staffSelected: action.payload }
    case 'STORE_STAFF_USERNAME_AVAILABLE':
      return { ...state, usernameAvailable: action.payload }
    default:
      return state
  }
}

// Actions
const setLoading = (dispatch) => (value) => {
  dispatch({ type: 'LOADING', payload: value })
}

const createStaff = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await ngrokApi.post('/staff/create-staff', data)
    dispatch({ type: 'STORE_STAFF', payload: response.data })
    return
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const fetchUserStaff = (dispatch) => async () => {
  dispatch({ type: 'LOADING', payload: true })
  const response = await ngrokApi.get('/staff/user-staff')
  dispatch({ type: 'USER_STAFF', payload: response.data })
}

const fetchStoreStaff = (dispatch) => async (storeId) => {
  console.log('storeId', storeId)
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/staff/fetch-store-staff`, storeId)
    dispatch({ type: 'STORE_STAFF', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const editStaff = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await ngrokApi.post(`/staff/edit-staff`, data)
    dispatch({ type: 'STORE_STAFF', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const setStaffToEdit = (dispatch) => async (data) => {
  dispatch({ type: 'SET_STAFF_TO_EDIT', payload: data })
}

const setStaffSelected = (dispatch) => async (data) => {
  dispatch({ type: 'SET_STAFF_SELECTED', payload: data })
}

const deleteStaff = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/staff/delete-staff`, data)
    dispatch({ type: 'STORE_STAFF', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const createLoan = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/staff/create-loan`, data)
    dispatch({ type: 'STORE_STAFF', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const addLoanPayment = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/staff/add-loan-payment`, data)
    dispatch({ type: 'STORE_STAFF', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const checkUsernameAvailability = (dispatch) => async (username) => {
  try {
    const response = await ngrokApi.post(`/staff/check-username-availability`, {
      username,
    })
    dispatch({ type: 'STORE_STAFF_USERNAME_AVAILABLE', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

export const { Provider, Context } = createDataContext(
  CommonReducer,
  {
    setLoading,
    createStaff,
    fetchUserStaff,
    fetchStoreStaff,
    editStaff,
    setStaffToEdit,
    setStaffSelected,
    deleteStaff,
    createLoan,
    addLoanPayment,
    checkUsernameAvailability,
  },
  {
    loading: false,
    staff: [],
    userStaff: [],
    storeStaff: [],
    staffToEdit: null,
    staffSelected: null,
    usernameAvailable: 'not-checked',
  },
)
