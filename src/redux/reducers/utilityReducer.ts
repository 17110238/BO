import * as types from 'redux/types';
import { UtilityReducerState, ActionReducer, PaymentMethod } from 'models';
/* eslint-disable no-case-declarations */
const initialState: UtilityReducerState = {
  paymentMethods: [],
  locations: [],
  mccCodes: [],
  listBank: [],
  defaultMerchantFee: {},
  GetAppInfoData: [],
  GetNationality: []
};

export default function merchant(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_PAYMENT_METHOD_LIST.SUCCESS:
      return {
        ...state,
        paymentMethods: action.payload,
      };

    case types.GET_APP_INFO_LIST.SUCCESS:
      return {
        ...state,
        GetAppInfoData: action.payload,
      };

    case types.GET_LOCATION_CITY_LIST.SUCCESS:
      return {
        ...state,
        locations: action.payload,
      };
    case types.GET_MCC_CODE_LIST_FULL_INFO.REQUEST:
      return {
        ...state,
        mccCodes: [],
      };
    case types.GET_MCC_CODE_LIST_FULL_INFO.SUCCESS:
      return {
        ...state,
        mccCodes: action.payload,
      };
    case types.GET_DEFAULT_MERCHANT_FEE_CONFIG.REQUEST:
      return {
        ...state,
        defaultMerchantFee: {},
      };
    case types.GET_DEFAULT_MERCHANT_FEE_CONFIG.SUCCESS:
      return {
        ...state,
        defaultMerchantFee: action.payload,
      };
      case types.GET_DATA_NATIONAL.SUCCESS:
        return {
          ...state,
          GetNationality: action.payload,
        };

    case types.GET_INFO_LIST_BANK.SUCCESS:
      return {
        ...state,
        listBank: action.payload,
      };

    default:
      return state;
  }
}
