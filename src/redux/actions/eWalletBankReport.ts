import { CallbackResponse } from './../../models/index';
import * as types from 'redux/types';

export const getBankReportFormMerchantTT23 = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_BANK_REPORT_MERCHANT_TT23.REQUEST,
    callback,
    payload,
  };
};

export const getBankReportFormEwalletTT23 = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_BANK_REPORT_EWALLET_TT23.REQUEST,
    callback,
    payload,
  };
};

export const getBankReportFormEwalletDetailTT23 = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_BANK_REPORT_DETAIL_EWALLET_TT23.REQUEST,
    callback,
    payload,
  };
};

export const getBankReportFormEwalletBillTT23 = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_BANK_REPORT_BILL_TT23.REQUEST,
    callback,
    payload,
  };
};
