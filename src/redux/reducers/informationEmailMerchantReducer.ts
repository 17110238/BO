
import * as types from 'redux/types';
import { ActionReducer } from 'models';


const initialState = {
  loading: false,

  filter:{},

};

export default function informationEmailMerchantReducer(state = initialState, action :ActionReducer) {
  switch (action.type) {
    case types.RESEND_EMAIL_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.RESEND_EMAIL_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
    
      };
    case types.RESEND_EMAIL_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.EXPORT_EMAIL_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.EXPORT_EMAIL_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
    
      };
      case types.EXPORT_EMAIL_MERCHANT.PENDING:
        return {
          ...state,
          loading: true,
        };
    case types.EXPORT_EMAIL_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.GET_EMAIL_INFORMATION_MERCHANT.REQUEST:
        return {
          ...state,
          loading: true,
        };
      case types.GET_EMAIL_INFORMATION_MERCHANT.SUCCESS:
        return {
          ...state,
          loading: false,
      
        };
      case types.GET_EMAIL_INFORMATION_MERCHANT.FAILURE:
        return {
          ...state,
          loading: false,
        };
    default:
      return state;
  }
}
