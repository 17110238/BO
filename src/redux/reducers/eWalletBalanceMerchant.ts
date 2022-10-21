import * as types from 'redux/types';
import { ActionReducer, initialStateReport } from 'models';
const initialState = {
  loading: false,
  listWalletBalance: [],
  loadingExport: false
};

export default function eWalletBalanceReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_BALANCE_MERCHANT.DELETE:
      return {
        ...state,
        listWalletBalance: [],
      };
    case types.GET_LIST_BALANCE_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_BALANCE_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        listWalletBalance: action.payload,
      };
    case types.GET_LIST_BALANCE_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
        listWalletBalance: action.payload,
      };
    case types.EXPORT_SEARCH_ACCOUNTANT.REQUEST:
      return {
        ...state,
        loadingExport: true,
      };
    case types.EXPORT_SEARCH_ACCOUNTANT.SUCCESS:
      return {
        ...state, loadingExport: false
      };
    case types.EXPORT_SEARCH_ACCOUNTANT.FAILURE:
      return {
        ...state,
        loadingExport: false,
      };
    case types.EXPORT_SEARCH_ACCOUNTANT.PENDING:
      return {
        ...state,
        loadingExport: true,
      };

    default:
      return state;
  }
}
