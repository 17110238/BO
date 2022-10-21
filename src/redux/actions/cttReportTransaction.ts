import { CallbackResponse } from 'models';
import * as types from 'redux/types';

export const getReportTransaction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_REPORT_TRANSACTION_CTT.REQUEST,
    payload,
    callback,
  };
};
