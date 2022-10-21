import { AddEmployeeInput, CallbackResponse, DeleteEmployeeInput, SearchEmployeeInput, UpdateEmployeeInput } from 'models';
import * as types from 'redux/types';

export const searchManagertAccountWalletPayme = (
  payload: SearchEmployeeInput ,
  callback?: CallbackResponse
) => {
  return {
    type: types.SEARCH_ACCOUNTS_WALLET_PAYME.REQUEST,
    callback,
    payload,
  };
};

export const addManagertAccountWalletPayme = (
  payload: AddEmployeeInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.ADD_ACCOUNTS_WALLET_PAYME.REQUEST,
    callback,
    payload,
  };
};

export const updateManagertAccountWalletPayme = (
  payload: UpdateEmployeeInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_ACCOUNTS_WALLET_PAYME.REQUEST,
    callback,
    payload,
  };
};

export const deleteManagertAccountWalletPayme = (
  payload: DeleteEmployeeInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.DELETE_ACCOUNTS_WALLET_PAYME.REQUEST,
    callback,
    payload,
  };
};

export const getListCompany = (
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_LIST_COMPANY.REQUEST,
    callback
  };
};
