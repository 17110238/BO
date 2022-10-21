import * as types from 'redux/types';
import {
  CallbackResponse,
  FormUpdateStore,
  InputAlipayStore,
  InputSearchLogStore,
  SearchStoreInput,
} from 'models';

export const getListStore = (payload: SearchStoreInput, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_STORE.REQUEST,
    payload,
    callback,
  };
};

export const updateStore = (payload: FormUpdateStore, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_STORE.REQUEST,
    payload,
    callback,
  };
};

export const getLogStore = (payload: InputSearchLogStore, callback: CallbackResponse) => {
  return {
    type: types.GET_LOG_STORE.REQUEST,
    payload,
    callback,
  };
};

export const checkStatusAlipayStore = (payload: InputAlipayStore, callback: CallbackResponse) => {
  return {
    type: types.CHECK_STATUS_ALIPAY.REQUEST,
    payload,
    callback,
  };
};

export const approvalAlipayStore = (payload: InputAlipayStore, callback: CallbackResponse) => {
  return {
    type: types.APPROVAL_ALIPAY_TYPES.REQUEST,
    payload,
    callback,
  };
};

export const getDelegateStore = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_DELEGATE_STORE.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantStore = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_MERCHANT_STORE.REQUEST,
    payload,
    callback,
  };
};
