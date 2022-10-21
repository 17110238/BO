
export const HIDE_LOADING = 'HIDE_LOADING';
export const SHOW_LOADING = 'SHOW_LOADING';

/* ----------------------------------- TYPE STATUS API ------------------------------------- */
export const REQUEST_SUCCESS = 1000
export const ERROR_502 = 502
export const ERROR_404 = 404
export const ERROR_401 = 401
/* -------------------------------------------------------------------------------------------- */
/* ----------------------------------- LOG ------------------------------------- */
export const CALL_SHOW_LOG = 'CALL_SHOW_LOG'
export const SHOW_LOG = 'SHOW_LOG'
export const CALL_ADD_LOG_LIST = 'CALL_ADD_LOG_LIST'
export const ADD_LOG_LIST = 'ADD_LOG_LIST'
export const CALL_REMOVE_LOG_LIST = 'CALL_REMOVE_LOG_LIST'
export const REMOVE_LOG_LIST = 'REMOVE_LOG_LIST'
export const UPDATE_BACKGROUND_TIME = 'UPDATE_BACKGROUND_TIME'
/* -------------------------------------------------------------------------------------------- */
/* ----------------------------------- TYPE NOT CALL API ------------------------------------- */
export const SWITCH_ENVIRONMENT = 'SWITCH_ENVIRONMENT'
export const SWITCH_LANGUAGE = 'SWITCH_LANGUAGE'

export const UPLOAD = 'UPLOAD'
export const LOGOUT = 'LOGOUT'
export const CHANGE_STACK = 'CHANGE_STACK'

export const SHOW_BALANCE = 'SHOW_BALANCE'
/* -------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------- */
/* ----------------------------------- TYPE CALL API ------------------------------------- */


export const typeNameAccount = {
  ACCOUNT_LOGIN: 'ACCOUNT_LOGIN',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  GET_LIST_ROLE_OF_ALL_USER: 'GET_LIST_ROLE_OF_ALL_USER',
  SET_LIST_ROLE_OF_ALL_USER: 'SET_LIST_ROLE_OF_ALL_USER',
  GET_LIST_SCOPE_OF_ALL_USER: 'GET_LIST_SCOPE_OF_ALL_USER',
  SET_LIST_SCOPE_OF_ALL_USER: 'SET_LIST_SCOPE_OF_ALL_USER',
}

export const typeAccountPayME = {
  SEARCH_ACCOUNT_PAYME:'SEARCH_ACCOUNT_PAYME'
}

export const typeMerchant = {
  SEARCH_MERCHANT: 'SEARCH_MERCHANT',
}

export const typeAccountMerchant = {
  SEARCH_ACC_MC: 'SEARCH_ACC_MC'
}
