import * as types from 'redux/types';
import { CallbackResponse } from 'models';

export const getReportAgent = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_REPORT_AGENT.REQUEST,
    payload,
    callback,
  };
};

export const getReportSystemTransaction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.REPORT_SYSTEM_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};
