import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const CommonReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'ALL_FINANCIALS':
      return { ...state, financials: action.payload, loading: false }
    case 'USER_FINANCIALS':
      return { ...state, userFinancials: action.payload, loading: false }
    case 'STORE_FINANCIALS':
      return { ...state, storeFinancials: action.payload, loading: false }
    case 'SET_FINANCIAL_TO_EDIT':
      return { ...state, financialToEdit: action.payload }
    case 'SET_FINANCIAL_SELECTED':
      return { ...state, financialSelected: action.payload }
    default:
      return state
  }
}

// Actions
const setLoading = (dispatch) => (value) => {
  dispatch({ type: 'LOADING', payload: value })
}

const createFinancial = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await ngrokApi.post('/financials/create-financial', data)
    dispatch({ type: 'STORE_FINANCIALS', payload: response.data })
    return
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const fetchUserFinancials = (dispatch) => async () => {
  dispatch({ type: 'LOADING', payload: true })
  const response = await ngrokApi.get('/financials/user-financials')
  dispatch({ type: 'USER_FINANCIALS', payload: response.data })
}

const editFinancial = (dispatch) => async (data) => {
  try {
    const response = await ngrokApi.patch(`/financials/edit-financial`, data)
    dispatch({ type: 'STORE_FINANCIALS', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const setFinancialToEdit = (dispatch) => async (data) => {
  dispatch({ type: 'SET_FINANCIAL_TO_EDIT', payload: data })
}

const setFinancialSelected = (dispatch) => async (data) => {
  dispatch({ type: 'SET_FINANCIAL_SELECTED', payload: data })
}

const fetchStoreFinancials = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  const response = await ngrokApi.post(
    `/financials/fetch-store-financials/`,
    data,
  )
  dispatch({ type: 'STORE_FINANCIALS', payload: response.data })
}

const deleteFinancial = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  const response = await ngrokApi.post(`/financials/delete-financial`, data)
  dispatch({ type: 'STORE_FINANCIALS', payload: response.data })
}

export const { Provider, Context } = createDataContext(
  CommonReducer,
  {
    setLoading,
    createFinancial,
    fetchUserFinancials,
    editFinancial,
    setFinancialToEdit,
    setFinancialSelected,
    fetchStoreFinancials,
    deleteFinancial,
  },
  {
    loading: false,
    financials: [],
    userFinancials: [],
    storeFinancials: [],
    financialToEdit: null,
    financialSelected: null,
  },
)
