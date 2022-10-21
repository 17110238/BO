import { CallbackResponse } from 'models';
import * as types from 'redux/types';

export const depositWithdrawAction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.DEPOSIT_WITHDRAW.REQUEST,
    payload,
    callback,
  };
};


export const depositWithdrawEwalletAction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.DEPOSIT_WITHDRAW_EWALLET.REQUEST,
    payload,
    callback,
  };
};

