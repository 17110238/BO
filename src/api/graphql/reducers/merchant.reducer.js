import { ERROR_401, typeMerchant } from "../redux.config"

/* eslint-disable no-case-declarations */
const initialState = {
  merchantInfoArray: [],
}

export default function merchant(state = initialState, action) {
  switch (action.type) {
    case `${typeMerchant.SEARCH_MERCHANT}_SUCCESS`:
      return {
        ...state,
        merchantInfoArray: action.payload,
      }
    case ERROR_401:
      return {
        ...initialState
      }
    default: return state
  }
}
