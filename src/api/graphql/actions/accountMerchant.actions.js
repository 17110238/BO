
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */

import { typeAccountMerchant } from "../redux.config"


export const actionSearchAccountMC = (payload, callback) => { 
  return {
    type: typeAccountMerchant.SEARCH_ACC_MC,
    payload,
    callback
  }
}
