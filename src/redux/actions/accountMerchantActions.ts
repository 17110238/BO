import { CallbackResponse } from 'models';
import {
  ChangePassAccMcInput,
  FilterSearchAccountMc,
  PasswordTemporaryInput,
  UnlockAccMcInput,
  UpdateAccMcInput,
  UpdateActiveAccMcInput,
  SearchByRoleInput,
  RequestActiveInput
} from 'models/account/accountMerchant';
import { DeleteScopeBoInput } from 'models/scope';
import { PagingInput } from 'models/utitlity/utilityState';
import * as types from 'redux/types/accountMcType';

export const searchAccountMc = (payload: FilterSearchAccountMc, callback: CallbackResponse) => {
  return {
    type: types.SEARCH_ACCOUNT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const updateAccountMc = (payload: UpdateAccMcInput, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_ACCOUNT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const passwordTemporary = (payload: PasswordTemporaryInput, callback: CallbackResponse) => {
  return {
    type: types.PASSWORD_TEMPORARY_ACC_MC.REQUEST,
    payload,
    callback,
  };
};

export const unlockAccountMc = (payload: UnlockAccMcInput, callback: CallbackResponse) => {
  return {
    type: types.UNLOCK_ACCOUNT_MC.REQUEST,
    payload,
    callback,
  };
};

export const updatePassword = (payload: ChangePassAccMcInput, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_PASSWORD_MC.REQUEST,
    payload,
    callback,
  };
};

export const getListRoleAccountMc = (callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_ROLE_ACCOUNT_MC.REQUEST,
    callback,
  };
};

export const updateActiveAccountMc = (
  payload: UpdateActiveAccMcInput,
  callback: CallbackResponse
) => {
  return {
    type: types.UPDATE_ACTIVE_ACCOUNT_MC.REQUEST,
    payload,
    callback,
  };
};

export const getListAccountSale = (payload: SearchByRoleInput, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_ACCOUNT_SALE.REQUEST,
    payload,
    callback,
  };
};


export const requestActiveAccount = (payload: RequestActiveInput, callback: CallbackResponse) => {
  return {
    type: types.REQUEST_ACTIVE_ACCOUNT.REQUEST,
    payload,
    callback,
  };
};