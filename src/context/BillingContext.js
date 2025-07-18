import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const BillingReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'SET_TIER_SELECTED':
      return { ...state, tierSelected: action.payload }
    case 'SET_ALL_USERS_BILLING_HISTORY':
      return {
        ...state,
        allUsersBillingHistory: action.payload,
        loading: false,
      }
    default:
      return state
  }
}

// Actions
const setLoading = (dispatch) => (value) => {
  dispatch({ type: 'LOADING', payload: value })
}

const setTierSelected = (dispatch) => (value) => {
  dispatch({ type: 'SET_TIER_SELECTED', payload: value })
}

const fetchAllUsersBillingHistory = (dispatch) => async () => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.get('/payment/all-users-billing-history')
    dispatch({ type: 'SET_ALL_USERS_BILLING_HISTORY', payload: response.data })
  } catch (error) {
    console.error('Error fetching all users billing history:', error)
  }
}

export const { Provider, Context } = createDataContext(
  BillingReducer,
  {
    setLoading,
    setTierSelected,
    fetchAllUsersBillingHistory,
  },
  {
    loading: false,
    tierSelected: null,
    allUsersBillingHistory: [],
  },
)
