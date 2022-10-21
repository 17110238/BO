// import { exportFileTransaction } from './transactionActions';
import * as types from 'redux/types';
import { CallbackResponse } from 'models';
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */
export const actionLogin = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.CHECK_AUTH.CHECK_AUTH_REQUEST,
    payload,
    callback,
  };
};
export const getListMerchantsReport = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_MERCHANTS_REPORT.REQUEST,
    payload,
    callback,
  };
};
export const getListPaymentLocationReport = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_PAYMENT_LOCATIONS_REPORT.REQUEST,
    payload,
    callback,
  };
};
export const getListPaymentMenthodReport = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_PAYMENT_METHOD_REPORT.REQUEST,
    payload,
    callback,
  };
};

export const getListMerchantTypeReport = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_MERCHANT_TYPE_REPORT.REQUEST,
    payload,
    callback,
  };
};
export const getListTopIncomeMerchant = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_TOP_INCOME_MERCHANT.REQUEST,
    payload,
    callback,
  };
};
export const exportFileMerchant = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.MERCHANT_EXPORT.REQUEST,
    payload,
    callback,
  };
};
