import { Account } from './../../models/account/accountState';
import * as types from 'redux/types';
import { ActionReducer } from 'models';
import { ChartMerchant } from 'models/chartmerchant/chartmerchant';
/* eslint-disable no-case-declarations */
const initialState: ChartMerchant = {
    loading: false,
    dataColumnMerchant: [],
    dataLocationMerchant:[],
  dataPaymentMethod: [],
  dataMerchantType: [],
  dataTopIncomeMerchant:[]
};

export default function chartMerchantReducers(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_MERCHANTS_REPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_MERCHANTS_REPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        dataColumnMerchant: action.payload,
      };
    case types.GET_MERCHANTS_REPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.GET_PAYMENT_LOCATIONS_REPORT.REQUEST:
        return {
          ...state,
          loading: true,
      };
      case types.GET_PAYMENT_LOCATIONS_REPORT.SUCCESS:
        return {
          ...state,
            loading: false,
            dataLocationMerchant:action.payload,
        };
      case types.GET_PAYMENT_LOCATIONS_REPORT.FAILURE:
        return {
          ...state,
          loading:  false,
        };
    case types.GET_PAYMENT_METHOD_REPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PAYMENT_METHOD_REPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        dataPaymentMethod: action.payload,
      };
    case types.GET_PAYMENT_METHOD_REPORT.FAILURE:
      return {
        ...state,
        loading: true,
      };
      case types.GET_MERCHANT_TYPE_REPORT.REQUEST:
        return {
          ...state,
          loading: true,
        };
      case types.GET_MERCHANT_TYPE_REPORT.SUCCESS:
        return {
          ...state,
          loading: false,
          dataMerchantType: action.payload,
        };
      case types.GET_MERCHANT_TYPE_REPORT.FAILURE:
        return {
          ...state,
          loading: true,
      };
      case types.GET_TOP_INCOME_MERCHANT.REQUEST:
        return {
          ...state,
          loading: true,
        };
      case types.GET_TOP_INCOME_MERCHANT.SUCCESS:
        return {
          ...state,
          loading: false,
          dataTopIncomeMerchant: action.payload,
        };
      case types.GET_TOP_INCOME_MERCHANT.FAILURE:
        return {
          ...state,
          loading: true,
      };
      
    default:
      return state;
  }
}
