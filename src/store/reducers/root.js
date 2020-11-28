export const UPDATE_USER = 'UPDATE_USER'
export const CONNECT_ETHEREUM = 'CONNECT_ETHEREUM'
export const ALL_ARTICLES = 'ALL_ARTICLES'
export const ALL_HISTORICAL = 'ALL_HISTORICAL'

const initialState = {
  user: null,
  account: null,
  contract: null,
  allarticles : [],
  historical : [],
}

const updateUser = user => ({ type: UPDATE_USER, user })

const connectEthereum = ({ account, contract }) => ({
  type: CONNECT_ETHEREUM,
  account,
  contract,
})

const getAllArticlesStore = ({allarticles}) => ({
  type: ALL_ARTICLES,
  allarticles,
})

const updateHistorical = ({historical}) => ({
  type: ALL_HISTORICAL,
  historical,
})

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      const { user } = action
      return { ...state, user }
    case CONNECT_ETHEREUM:
      const { account, contract} = action
      return { ...state, account, contract }
    case ALL_ARTICLES:
      const {allarticles} = action
      return { ...state, allarticles}
    case ALL_HISTORICAL:
      const {historical} = action
      return {...state, historical}
    default:
      return state
  }
}

export default rootReducer
export { updateUser, connectEthereum, getAllArticlesStore, updateHistorical}
