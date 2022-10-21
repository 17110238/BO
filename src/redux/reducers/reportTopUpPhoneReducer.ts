import { ActionReducer } from 'models';
import * as types from 'redux/types';

const initialState = {
  loading: false,
  listReportPhone: [],
};

const ReportTopUpPhoneReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_TOP_UP_PHONE.DELETE:
      return { ...state, listReportPhone: [] };
    case types.GET_TOP_UP_PHONE.REQUEST:
      return { ...state, loading: true };
    case types.GET_TOP_UP_PHONE.SUCCESS:
      return { ...state, loading: false, listReportPhone: action.payload };
    case types.GET_TOP_UP_PHONE.FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default ReportTopUpPhoneReducer;
