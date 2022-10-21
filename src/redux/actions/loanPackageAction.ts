import { CallbackResponse } from 'models';
import * as types from '../types';

export const getListLoanPackage = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_WALLET_LOAN_PACKAGE.REQUEST,
    payload,
    callback,
  };
};

export const updateLoanPackage = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_WALLET_LOAN_PACKAGE.REQUEST,
    payload,
    callback,
  };
};
