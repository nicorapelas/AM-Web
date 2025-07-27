import ngrokApi from '../api/ngrok'
import createDataContext from './createDataContext'

// Reducer
const GuidedTourReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GUIDE_ENABLED':
      return { ...state, guideEnabled: action.payload }
    case 'SET_GUIDE_PART_INDEX':
      return { ...state, guidePartIndex: action.payload }
    default:
      return state
  }
}

// Actions
const setGuideEnabled = (dispatch) => (value) => {
  dispatch({ type: 'SET_GUIDE_ENABLED', payload: value })
}

const setGuidePartIndex = (dispatch) => (value) => {
  dispatch({ type: 'SET_GUIDE_PART_INDEX', payload: value })
}

export const { Provider, Context } = createDataContext(
  GuidedTourReducer,
  {
    setGuideEnabled,
    setGuidePartIndex,
  },
  {
    guideEnabled: true,
    guidePartIndex: 0,
  },
)
