import * as types from 'redux/types/emailSmsTypes';
import * as typess from 'redux/types';
import { ActionReducer } from 'models';
/* eslint-disable no-case-declarations */
const initialState: any = {
  loading: false,
  emailSmsProduct: [],
  emailSmsMerchant: [],
  emailSmsHistory : []
};

export default function EmailSmsReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.EMAIL_SMS_PRODUCT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.EMAIL_SMS_PRODUCT.SUCCESS:
      return {
        ...state,
        loading: false,
        emailSmsProduct: action.payload,
      };
    case types.EMAIL_SMS_PRODUCT.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.EMAIL_SMS_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.EMAIL_SMS_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        emailSmsProduct: action.payload,
      };
    case types.EMAIL_SMS_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.EMAIL_SMS_HISTORY.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.EMAIL_SMS_HISTORY.SUCCESS:
      return {
        ...state,
        loading: false,
        emailSmsProduct: action.payload,
      };
    case types.EMAIL_SMS_HISTORY.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
