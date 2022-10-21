import { CallbackResponse } from 'models';
import * as types from 'redux/types';

export const getMerchantQuantity = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_DATA_QUANTITY_MERCHANT.REQUEST,
    callback,
    payload,
  };
};

export const getTopMerchantCategory = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_TOP_MERCHANT_CATEGORY.REQUEST,
    callback,
    payload,
  };
};

export const getReportMerchantAmount = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_DATA_REPORT_MC_AMOUNT.REQUEST,
    callback,
    payload,
  };
};
