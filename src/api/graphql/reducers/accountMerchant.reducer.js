import { ERROR_401, typeAccountMerchant } from "../redux.config"

/* eslint-disable no-case-declarations */
const initialState = {
  accountMerchantInfoArray: [],
}

export default function merchant(state = initialState, action) {
  switch (action.type) {
    case `${typeAccountMerchant.SEARCH_ACC_MC}_SUCCESS`:
      return {
        ...state,
        accountMerchantInfoArray: action.payload,
      }
    case ERROR_401:
      return {
        ...initialState
      }
    default: return state
  }
}
