import * as types from 'redux/types/ewalletPartnerService';
import * as typess from 'redux/types';
import { ActionReducer } from 'models';
/* eslint-disable no-case-declarations */
const initialState: any = {
  loading: false,
  ewalletServiceBillReport: [],
  bankReport: {},
  ewalletGateReport: [],
  ewalletHistoryReport: [],
  ewalletSsccReport: [],
};

export default function EwalletPartnerService(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_EWALLET_SERVICE_REPORT_BILL.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_EWALLET_SERVICE_REPORT_BILL.SUCCESS:
      return {
        ...state,
        loading: false,
        ewalletServiceBillReport: action.payload,
      };
    case types.GET_EWALLET_SERVICE_REPORT_BILL.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_BANK_REPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_BANK_REPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        bankReport: action.payload,
      };
    case types.GET_BANK_REPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_EWALLET_GATE_REPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_EWALLET_GATE_REPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        ewalletGateReport: action.payload,
      };
    case types.GET_EWALLET_GATE_REPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_EWALLET_HISTORY_REPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_EWALLET_HISTORY_REPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        ewalletHistoryReport: action.payload,
      };
    case types.GET_EWALLET_HISTORY_REPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.GET_EWALLET_SSCC_REPORT.REQUEST:
        return {
          ...state,
          loading: true,
        };
      case types.GET_EWALLET_SSCC_REPORT.SUCCESS:
        return {
          ...state,
          loading: false,
          ewalletSsccReport: action.payload,
        };
      case types.GET_EWALLET_SSCC_REPORT.FAILURE:
        return {
          ...state,
          loading: false,
        };
    default:
      return state;
  }
}
