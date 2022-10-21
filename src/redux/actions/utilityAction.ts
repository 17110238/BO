import {
  CallbackResponse,
  GetAccountMerchantLogInput,
  GetChangedInfoInput,
  GetMerchantSDKInput,
  LocationSearchPayload,
  MccCodeListType,
  MerchantDefaultFeeItem,
  PayloadFilterMccCodeContentType,
  PayloadFilterMccCodeType,
} from 'models';
import * as types from 'redux/types';

export const getpaymentMethodList = (callback?: CallbackResponse) => {
  return {
    type: types.GET_PAYMENT_METHOD_LIST.REQUEST,
    callback,
  };
};

export const getLocationCityList = (callback?: CallbackResponse) => {
  return {
    type: types.GET_LOCATION_CITY_LIST.REQUEST,
    callback,
    payload: {
      identifyCode: '',
    },
  };
};

export const getSubLocationList = (payload: LocationSearchPayload, callback?: CallbackResponse) => {
  return {
    type: types.GET_SUB_LOCATION_LIST.REQUEST,
    callback,
    payload,
  };
};

export const getMccCodeList = (
  payload?: PayloadFilterMccCodeType | PayloadFilterMccCodeContentType,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_MCC_CODE_LIST_FULL_INFO.REQUEST,
    callback,
    payload,
  };
};

export const getLogs = (payload: GetAccountMerchantLogInput, callback?: CallbackResponse) => {
  return {
    type: types.GET_LOGS.REQUEST,
    callback,
    payload,
  };
};

export const getChangedInfoFee = (payload: GetChangedInfoInput, callback?: CallbackResponse) => {
  return {
    type: types.GET_CHANGED_INFO_FEE.REQUEST,
    callback,
    payload,
  };
};

export const getListInfoBank = (callback?: CallbackResponse) => {
  return {
    type: types.GET_INFO_LIST_BANK.REQUEST,
    callback,
  };
};

export const updateEcommerceFeeDefault = (
  payload: MerchantDefaultFeeItem[],
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_ECOMMERCE_FEE_DEFAULT.REQUEST,
    callback,
    payload,
  };
};

export const updatePopoFeeDefault = (
  payload: MerchantDefaultFeeItem[],
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_POBO_FEE_DEFAULT.REQUEST,
    callback,
    payload,
  };
};

export const updateMccCodeItem = (payload: MccCodeListType, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_MCC_CODE_ITEM.REQUEST,
    callback,
    payload,
  };
};

export const getAppInfo = (callback?: CallbackResponse) => {
  return {
    type: types.GET_APP_INFO_LIST.REQUEST,
    callback,
  };
};

export const getMccCodeListPartial = (
  payload?: PayloadFilterMccCodeType | PayloadFilterMccCodeContentType,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_MCC_CODE_LIST_PARTIAL.REQUEST,
    callback,
    payload,
  };
};

export const getPaymentMethodFullType = (callback?: CallbackResponse) => {
  return {
    type: types.GET_PAYMENT_METHOD_FULL_TYPE.REQUEST,
    callback,
  };
};

export const getMCSDKList = (payload: GetMerchantSDKInput, callback?: CallbackResponse) => {
  return {
    type: types.MC_SDK_LIST.REQUEST,
    callback,
    payload,
  };
};

export const getChangedStateCoboPobo = (payload: GetChangedInfoInput, callback?: CallbackResponse) => {
  return {
    type: types.GET_CHANGE_STATE_COBO_POBO.REQUEST,
    callback,
    payload,
  };
};


export const getNationalList = ( callback?: CallbackResponse) => {
  return {
    type: types.GET_DATA_NATIONAL.REQUEST,
    callback,
  };
};