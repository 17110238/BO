import * as types from 'redux/types';
import { ActionReducer } from 'models';

const initialState: any = {
  loading: false,
  eWalletTransactionInfoArray: [],
  eWalletRefund: {},
  loadingExport: false,
};

export default function eWalletTransactionReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_E_WALLET_TRANSACTION.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_E_WALLET_TRANSACTION.SUCCESS:
      return {
        ...state,
        loading: false,
        eWalletTransactionInfoArray: action.payload,
      };
    case types.GET_LIST_E_WALLET_TRANSACTION.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.EXPORT_E_WALLET_TRANSACTION.REQUEST:
      return {
        ...state,
        loadingExport: true,
      };
    case types.EXPORT_E_WALLET_TRANSACTION.SUCCESS:
      return {
        ...state, loadingExport: false
      };
    case types.EXPORT_E_WALLET_TRANSACTION.FAILURE:
      return {
        ...state,
        loadingExport: false,
      };
    case types.EXPORT_E_WALLET_TRANSACTION.PENDING:
      return {
        ...state,
        loadingExport: true,
      };

      case types.REFUND_E_WALLET_TRANSACTION.SUCCESS:
      return {
        ...state, loading: false
      };
    case types.REFUND_E_WALLET_TRANSACTION.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.REFUND_E_WALLET_TRANSACTION.REQUEST:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}
