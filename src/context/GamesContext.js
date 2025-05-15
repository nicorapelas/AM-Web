import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const CommonReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'ALL_GAMES':
      return { ...state, games: action.payload, loading: false }
    case 'USER_GAMES':
      return { ...state, userGames: action.payload, loading: false }
    case 'STORE_GAMES':
      return { ...state, storeGames: action.payload, loading: false }
    case 'SET_GAME_TO_EDIT':
      return { ...state, gameToEdit: action.payload }
    case 'SET_GAME_SELECTED':
      return { ...state, gameSelected: action.payload }
    default:
      return state
  }
}

// Actions
const setLoading = (dispatch) => (value) => {
  dispatch({ type: 'LOADING', payload: value })
}

const createGame = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await ngrokApi.post('/games/create-game', data)
    dispatch({ type: 'STORE_GAMES', payload: response.data })
    return
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const fetchUserGames = (dispatch) => async () => {
  dispatch({ type: 'LOADING', payload: true })
  const response = await ngrokApi.get('/games/user-games')
  dispatch({ type: 'USER_GAMES', payload: response.data })
}

const fetchStoreGames = (dispatch) => async (storeId) => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/games/fetch-store-games`, storeId)
    dispatch({ type: 'STORE_GAMES', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const editGame = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await ngrokApi.post(`/games/edit-game`, data)
    dispatch({ type: 'STORE_GAMES', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

const setGameToEdit = (dispatch) => async (data) => {
  dispatch({ type: 'SET_GAME_TO_EDIT', payload: data })
}

const setGameSelected = (dispatch) => async (data) => {
  dispatch({ type: 'SET_GAME_SELECTED', payload: data })
}

const deleteGame = (dispatch) => async (data) => {
  dispatch({ type: 'LOADING', payload: true })
  try {
    const response = await ngrokApi.post(`/games/delete-game`, data)
    dispatch({ type: 'STORE_GAMES', payload: response.data })
  } catch (error) {
    dispatch({ type: 'ADD_ERROR', payload: error })
    return
  }
}

export const { Provider, Context } = createDataContext(
  CommonReducer,
  {
    setLoading,
    createGame,
    fetchUserGames,
    fetchStoreGames,
    editGame,
    setGameToEdit,
    setGameSelected,
    deleteGame,
  },
  {
    loading: false,
    games: [],
    userGames: [],
    storeGames: [],
    gameToEdit: null,
    gameSelected: null,
  },
)
