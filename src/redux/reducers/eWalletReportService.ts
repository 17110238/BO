import * as types from 'redux/types/eWalletReportService';
import { ActionReducer } from 'models';
/* eslint-disable no-case-declarations */
const initialState: any = {
  loading: false,
  ewalletReportCustomer: {},
};

export default function EwalletReportService(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_REPORT_CUSTOMER.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_REPORT_CUSTOMER.SUCCESS:
      return {
        ...state,
        loading: false,
        ewalletReportCustomer: action.payload,
      };
    case types.GET_REPORT_CUSTOMER.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
