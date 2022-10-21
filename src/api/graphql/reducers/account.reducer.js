import { ERROR_401, typeNameAccount } from "../redux.config"

/* eslint-disable no-case-declarations */
const initialState = {
  accessToken: '' ,
  userInfo: {},
  prevInfo: {},
  userState: '', 
  listRoleOfAllUser: [],
  listScopeOfAllUser: [],
}

export default function account(state = initialState, action) {
  switch (action.type) {
    case `${typeNameAccount.ACCOUNT_LOGIN}_SUCCESS`:
      return {
        ...state,
        userInfo: { ...state.userInfo, accessToken: action.payload?.accessToken, kycState: action.payload?.kycState },
        prevInfo: { ...state.prevInfo, username: action.payload?.username },
        userState: action.payload?.userState
      }
    case typeNameAccount.SET_LIST_ROLE_OF_ALL_USER: 
      return {
        ... state,
        listRoleOfAllUser: action.payload
      }
    case typeNameAccount.SET_LIST_SCOPE_OF_ALL_USER: 
      return {
        ... state,
        listScopeOfAllUser: action.payload
      }
    case ERROR_401:
      return {
        ...initialState
      }
    default: return state
  }
}
