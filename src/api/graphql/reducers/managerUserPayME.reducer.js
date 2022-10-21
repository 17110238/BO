import { typeNameAccount } from "../redux.config"

/* eslint-disable no-case-declarations */
const initialState = {
  accessToken: '' ,
  userInfo: {},
  prevInfo: {},
}

export default function account(state = initialState, action) {
  switch (action.type) {
    case `${typeNameAccount.ACCOUNT_LOGIN}_SUCCESS`:
      return {
        ...state,
        userInfo: { ...state.userInfo, accessToken: action.payload?.accessToken, kycState: action.payload?.kycState },
        prevInfo: { ...state.prevInfo, username: action.payload?.username }
      }
    
    case ERROR_401:
      return {
        ...initialState
      }
    default: return state
  }
}
