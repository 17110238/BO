
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */

import { typeMerchant } from "../redux.config"

export const actionSearchMC = (payload, callback) => { 
  return {
    type: typeMerchant.SEARCH_MERCHANT,
    payload,
    callback
  }
}
