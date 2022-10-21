import { ActionReducer } from 'models';
import { TransferState } from 'models/transfer';
import * as types from 'redux/types/transferTypes';

const initialState: TransferState = {
  loading: false,
  loadingUpdateTransaction: false,
  loadingExport: false,
  mismatchTransactions: [],
  message: '',
};

export default function transfer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_MISMATCH_TRANSACTIONS.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_MISMATCH_TRANSACTIONS.SUCCESS:
      return {
        ...state,
        loading: false,
        mismatchTransactions: action.payload,
      };

    case types.GET_MISMATCH_TRANSACTIONS.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.UPDATE_MISMATCH_TRANSACTIONS.REQUEST:
      return {
        ...state,
        loadingUpdateTransaction: true,
      };

    case types.UPDATE_MISMATCH_TRANSACTIONS.SUCCESS:
      return {
        ...state,
        loadingUpdateTransaction: false,
        message: action.payload,
      };

    case types.UPDATE_MISMATCH_TRANSACTIONS.FAILURE:
      return {
        ...state,
        loadingUpdateTransaction: false,
        message: action.payload,
      };

    case types.EXPORT_MISMATCH_TRANSACTIONS.REQUEST:
      return {
        ...state,
        loadingExport: true,
      };

    case types.EXPORT_MISMATCH_TRANSACTIONS.PENDING:
      return {
        ...state,
        loadingExport: true,
      };

    case types.EXPORT_MISMATCH_TRANSACTIONS.SUCCESS:
      return {
        ...state,
        loadingExport: false,
      };

    case types.EXPORT_MISMATCH_TRANSACTIONS.FAILURE:
      return {
        ...state,
        loadingExport: false,
      };

    default:
      return state;
  }
}
