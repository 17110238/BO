import { ActionReducer } from 'models';
import * as types from 'redux/types';

const initialState = {
  loading: false,
  loadingWordFilter: false,
  loadingTopMerchant:false,
  listReportBill: [],
  listReportWordFilter: [],
  listTopMerchant:[],
  
};

const ReportBillReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_LIST_REPORT_BILL.DELETE:
      return { ...state, listReportBill: [] };
    case types.GET_LIST_REPORT_BILL.REQUEST:
      return { ...state, loading: true };
    case types.GET_LIST_REPORT_BILL.SUCCESS:
      return { ...state, loading: false, listReportBill: action.payload };
    case types.GET_LIST_REPORT_BILL.FAILURE:
      return { ...state, loading: false };
      case types.GET_LIST_REPORT_TOP.DELETE:
        return { ...state, listReportBill: [] };
      case types.GET_LIST_REPORT_TOP.REQUEST:
        return { ...state, loadingTopMerchant: true };
      case types.GET_LIST_REPORT_TOP.SUCCESS:
        return { ...state, loadingTopMerchant: false, listTopMerchant: action.payload };
      case types.GET_LIST_REPORT_TOP.FAILURE:
        return { ...state, loadingTopMerchant: false };
      case types.GET_LIST_EWALLET_WORD_FILLTER.REQUEST:
        return { ...state, loadingWordFilter: true };
      case types.GET_LIST_EWALLET_WORD_FILLTER.SUCCESS:
        return { ...state, loadingWordFilter: false, listReportWordFilter: action.payload };
      case types.GET_LIST_EWALLET_WORD_FILLTER.FAILURE:
        return { ...state, loadingWordFilter: false };
    default:
      return state;
  }
};

export default ReportBillReducer;
