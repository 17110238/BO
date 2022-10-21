import * as types from 'redux/types/eWalletReportTypes';
import { ActionReducer, initialStateReport } from 'models';
const initialState: initialStateReport = {
  loading: false,
  listReportUser: [],
  loadingExport: false
};

export default function eWalletReportReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_REPORT_USER.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_REPORT_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        listReportUser: action.payload,
      };
    case types.GET_REPORT_USER.FAILURE:
      return {
        ...state,
        loading: false,
        listReportUser: action.payload,
      };
    case types.EXPORT_FILE_REPORT_USER.REQUEST:
      return {
        ...state,
        loadingExport: true,
      };
    case types.EXPORT_FILE_REPORT_USER.SUCCESS:
      return {
        ...state, loadingExport: false
      };
    case types.EXPORT_FILE_REPORT_USER.FAILURE:
      return {
        ...state,
        loadingExport: false,
      };
    case types.EXPORT_FILE_REPORT_USER.PENDING:
      return {
        ...state,
        loadingExport: true,
      };

    default:
      return state;
  }
}
