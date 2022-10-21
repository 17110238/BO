import * as types from 'redux/types';
import { ActionReducer } from 'models';

const initialState: any = {
    loadingDate: false,
  loadingAccount: false,
  loadingCount: false,
  arrTopTransactionByAccount: [],
  arrTopTransactionByCount: [],
    arrTopTransactionByDate: [],
};

export default function eWalletTransactionReportReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_TOP_TRANSACTION_BY_DATE.DELETE:
        return {
          ...state,
          arrTopTransactionByAccount: [],
          arrTopTransactionByCount: [],
            arrTopTransactionByDate: [],
        };
    case types.GET_TOP_TRANSACTION_BY_ACCOUNT.REQUEST:
      return {
        ...state,
        loadingAccount: true,
      };
    case types.GET_TOP_TRANSACTION_BY_ACCOUNT.SUCCESS:
      return {
        ...state,
        loadingAccount: false,
        arrTopTransactionByAccount: action.payload,
      };
    case types.GET_TOP_TRANSACTION_BY_ACCOUNT.FAILURE:
      return {
        ...state,
        loadingAccount: false,
      };
      case types.GET_TOP_TRANSACTION_BY_DATE.REQUEST:
        return {
          ...state,
          loadingDate: true,
        };
      case types.GET_TOP_TRANSACTION_BY_DATE.SUCCESS:
      return {
          ...state, loadingDate: false,
          arrTopTransactionByDate:action.payload
      };
    case types.GET_TOP_TRANSACTION_BY_DATE.FAILURE:
      return {
        ...state,
        loadingDate: false,
      };
      case types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.REQUEST:
        return {
          ...state,
          loadingCount: true,
        };
      case types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.SUCCESS:
      return {
          ...state, loadingCount: false,
          arrTopTransactionByCount:action.payload
      };
    case types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.FAILURE:
      return {
        ...state,
        loadingCount: false,
      };

    default:
      return state;
  }
}
