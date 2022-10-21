import * as types from 'redux/types';
import { CallbackResponse } from 'models';

export const getBalance = (callback: CallbackResponse) => {
  return {
    type: types.GET_BALANCE_REPORT_WALLET.REQUEST,
    callback,
  };
};

export const getInfoKycWallet = (callback: CallbackResponse) => {
  return {
    type: types.GET_INFO_KYC_REPORT_WALLET.REQUEST,
    callback,
  };
};
