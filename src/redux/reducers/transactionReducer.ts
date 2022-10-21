import * as types from 'redux/types';
import { TransactionState, ActionReducer } from 'models';

const initialState: TransactionState = {
  loadingDrawer: false,
  loadingModal: false,
  loadingExport: false,
  loading: false,
  transactionInfoArray: [],
  transactionDetail: {},
  refundTransactionInfo: {},
  cancelTransactionInfo: {},
  errorExport: {
    message: '',
    code: '',
  },
};

export default function transaction(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_TRANSACTION.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_TRANSACTION.SUCCESS:
      return {
        ...state,
        loading: false,
        transactionInfoArray: action.payload,
      };
  case types.GET_LIST_TRANSACTION.FAILURE:
      return {
        ...state,
        loading: false,
        transactionInfoArray: [],
      };
    case types.GET_DETAIL_TRANSACTION.REQUEST:
      return {
        ...state,
        loadingDrawer: true,
      };
    case types.GET_DETAIL_TRANSACTION.SUCCESS:
      return {
        ...state,
        loadingDrawer: false,
        transactionDetail: action.payload,
      };
    case types.GET_DETAIL_TRANSACTION.FAILURE:
      return {
        ...state,
        loadingDrawer: false,
      };
    case types.LOADING_DRAWER.SHOW:
      return {
        ...state,
        loadingDrawer: true,
      };
    case types.LOADING_DRAWER.HIDE:
      return {
        ...state,
        loadingDrawer: false,
      };
    case types.REFUND_TRANSACTION.REQUEST:
      return {
        ...state,
        loadingModal: true,
      };
    case types.REFUND_TRANSACTION.SUCCESS:
      return {
        ...state,
        loadingModal: false,
        refundTransactionInfo: action.payload,
      };
    case types.REFUND_TRANSACTION.FAILURE:
      return {
        ...state,
        loadingModal: false,
        refundTransactionInfo: action.payload,
      };
    case types.CANCEL_TRANSACTION.REQUEST:
      return {
        ...state,
        loadingModal: true,
      };
    case types.CANCEL_TRANSACTION.SUCCESS:
      return {
        ...state,
        loadingModal: false,
        cancelTransactionInfo: action.payload,
      };
    case types.CANCEL_TRANSACTION.FAILURE:
      return {
        ...state,
        loadingModal: false,
        cancelTransactionInfo: action.payload,
      };
    case types.DELETE_TRANSACTION: {
      return {
        ...state,
        loadingDrawer: false,
        cancelTransactionInfo: [],
      };
    }
    case types.TRANSACTION_MANAGE_EXPORT.REQUEST:
      return {
        ...state,
        loadingExport: true,
      };
    case types.TRANSACTION_MANAGE_EXPORT.SUCCESS:
      return { ...state, loadingExport: false };
    case types.TRANSACTION_MANAGE_EXPORT.FAILURE:
      return {
        ...state,
        loadingExport: false,
      };
    case types.TRANSACTION_MANAGE_EXPORT.PENDING:
      return {
        ...state,
        loadingExport: true,
      };
    default:
      return state;
  }
}
