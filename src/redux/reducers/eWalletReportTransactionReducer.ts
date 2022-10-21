import { ActionReducer } from 'models';
import * as types from '../types/eWalletReportTransactionTypes';

const initialState = {
  loading: false,
  data: {
    dataReportTransaction: [],
    totalReportTransaction: [],
  },
};

const eWalletReportTransactionReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_REPORT_TRANSACTION.REQUEST:
      return { ...state, loading: true };
    case types.GET_REPORT_TRANSACTION.SUCCESS:
      return { ...state, data: action.payload, loading: false };
    case types.GET_REPORT_TRANSACTION.FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default eWalletReportTransactionReducer;
