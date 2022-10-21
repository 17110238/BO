import {
    CallbackResponse
} from 'models';
import * as types from 'redux/types';
export const getInformationEmailMerchant = (payload: any, callback: CallbackResponse) => {
    return {
      type: types.GET_EMAIL_INFORMATION_MERCHANT.REQUEST,
      payload,
      callback,
    };
  };
  export const reSendEmail = (payload: any, callback: CallbackResponse) => {
    return {
      type: types.RESEND_EMAIL_MERCHANT.REQUEST,
      payload,
      callback,
    };
  };
  export const exportEmailMerchant = (payload: any, callback: CallbackResponse) => {
    return {
      type: types.EXPORT_EMAIL_MERCHANT.REQUEST,
      payload,
      callback,
    };
  };