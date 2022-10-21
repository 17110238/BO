import { CallbackResponse } from 'models';
import * as types from 'redux/types';

export const getTopTransferAction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_TOP_TRANSFER.REQUEST,
    payload,
    callback,
  };
};

export const getTop10WalletCount = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_DATA_TOP_10_WALLET.REQUEST,
    payload,
    callback,
  };
};

export const getTop10WalletAmount = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_DATA_TOP_10_WALLET_AMOUNT.REQUEST,
    payload,
    callback,
  };
};


