import { CallbackResponse } from 'models';
import * as types from 'redux/types';

export const getListSocialPay = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_EWALLET_SOCIAL_PAY.REQUEST,
    payload,
    callback,
  };
};

export const getListReportEWalletSocial = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_REPORT_EWALLET_SOCIAL.REQUEST,
    payload,
    callback,
  };
};
