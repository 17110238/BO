import { ActionReducer } from 'models';
import * as types from 'redux/types';

/* eslint-disable no-case-declarations */

const initialState :any = {
loading:false ,
filterAmount:{}
};

export default function quanTityMerchantReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_TOP_MERCHANT_CATEGORY.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_TOP_MERCHANT_CATEGORY.SUCCESS:
      return {
        ...state,
        loading: false,
 
      };
    case types.GET_TOP_MERCHANT_CATEGORY.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.GET_DATA_QUANTITY_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DATA_QUANTITY_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
      
      };
    case types.GET_DATA_QUANTITY_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.GET_DATA_REPORT_MC_AMOUNT.REQUEST:
      return {
        ...state,
        loading: true,

      };
    case types.GET_DATA_REPORT_MC_AMOUNT.SUCCESS:
      return {
        ...state,
        loading: false,
        filterAmount:action.payload,
      };
    case types.GET_DATA_REPORT_MC_AMOUNT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
