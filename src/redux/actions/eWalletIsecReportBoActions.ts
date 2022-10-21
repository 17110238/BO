import { CallbackResponse, PayloadListEwalletBankTransaction } from 'models';
import * as types from 'redux/types';

export const getListCodeIsecReport = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_ISEC_CODE_REPORT.REQUEST,
    callback,
    payload,
  };
};

export const getListReportIsec = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_ISEC_REPORT.REQUEST,
    callback,
    payload,
  };
};

export const getListIsecReportTransaction = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_ISEC_REPORT_TRANSACTION.REQUEST,
    callback,
    payload,
  };
};

export const getListIsecReportByAccount = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_ISEC_REPORT_BY_ACCOUNT.REQUEST,
    callback,
    payload,
  };
};
