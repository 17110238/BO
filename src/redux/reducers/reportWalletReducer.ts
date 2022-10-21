import { ActionReducer } from 'models';
import * as types from 'redux/types';

const initialState = {
  loading: false,
  listReportWallet: [],
};

const ReportWalletReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_REPORT_WALLET.REQUEST:
      return { ...state, loading: true };
    case types.GET_REPORT_WALLET.SUCCESS:
      return { ...state, loading: false, listReportWallet: action.payload };
    case types.GET_REPORT_WALLET.FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default ReportWalletReducer;
