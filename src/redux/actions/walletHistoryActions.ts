import { CallbackResponse } from 'models';
import { appHistoryInput } from 'models/walletHistory/walletHistoryState';
import * as types from 'redux/types/walletHistoryTypes';

export const getWalletHistory = (payload: appHistoryInput, callback?: CallbackResponse) => {
  return {
    type: types.GET_WALLET_HISTORY.REQUEST,
    callback,
    payload,
  };
};
