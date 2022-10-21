
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */

import { typeNameAccount } from "../redux.config"

export const actionLogin = (payload, callback) => { 
  return {
    type: typeNameAccount.ACCOUNT_LOGIN,
    payload,
    callback
  }
}

export const actionCreateAccount = (payload, callback) => { 
  return {
    type: typeNameAccount.CREATE_ACCOUNT,
    payload,
    callback
  }
}

export const actionGetListRoleAllUser = (callback) => { 
  return {
    type: typeNameAccount.GET_LIST_ROLE_OF_ALL_USER,
    callback
  }
}

export const actionGetListScopeAllUser = (callback) => { 
  return {
    type: typeNameAccount.GET_LIST_SCOPE_OF_ALL_USER,
    callback
  }
}

