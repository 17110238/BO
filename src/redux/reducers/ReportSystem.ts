import { ActionReducer } from 'models';
import * as types from 'redux/types';

const initialState = {
  loading: false,
  loadingSystem:false,
  listReportAgent: [],
  listReportTransaction:[]
};
const ReportSystem = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_LIST_REPORT_AGENT.DELETE:
      return { ...state, listReportAgent: [] };
    case types.GET_LIST_REPORT_AGENT.REQUEST:
      return { ...state, loading: true };
    case types.GET_LIST_REPORT_AGENT.SUCCESS:
      return { ...state, loading: false, listReportAgent: action.payload };
    case types.GET_LIST_REPORT_AGENT.FAILURE:
      return { ...state, loading: false };
      case types.GET_LIST_REPORT_SYSTEM_TRANSACTION.REQUEST:
        return { ...state, loadingSystem: true };
      case types.GET_LIST_REPORT_SYSTEM_TRANSACTION.SUCCESS:
        return { ...state, loadingSystem: false, listReportTransaction: action.payload };
      case types.GET_LIST_REPORT_SYSTEM_TRANSACTION.FAILURE:
        return { ...state, loadingSystem: false };
    default:
      return state;
  }
};

export default ReportSystem;
