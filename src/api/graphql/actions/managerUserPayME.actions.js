
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */

import { typeAccountPayME } from "../redux.config"

export const searchAccountPayME = (payload, callback) => { 
  return {
    type: typeAccountPayME.SEARCH_ACCOUNT_PAYME,
    payload,
    callback
  }
}

