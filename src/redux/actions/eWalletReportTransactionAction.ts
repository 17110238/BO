import * as types from '../types/eWalletReportTransactionTypes';
import { CallbackResponse } from 'models';

export const getReportTransaction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_REPORT_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};
