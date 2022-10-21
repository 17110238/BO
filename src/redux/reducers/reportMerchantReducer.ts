import { ActionReducer, ReportMerchantReducerType } from 'models';
import * as types from 'redux/types';

/* eslint-disable no-case-declarations */

const initialState: ReportMerchantReducerType = {
  revenueReport: [],
  sumReport: {},
};

export default function merchant(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_REVENUE_STATISTICS.REQUEST:
    case types.GET_REVENUE_STATISTICS.FAILURE:
      return {
        ...state,
        revenueReport: [],
      };
    case types.GET_REVENUE_STATISTICS.SUCCESS:
      return {
        ...state,
        revenueReport: action.payload,
      };

    case types.GET_SUM_REVENUE_STATISTICS.SUCCESS:
      return {
        ...state,
        sumReport: action.payload,
      };
    case types.GET_SUM_REVENUE_STATISTICS.REQUEST:
    case types.GET_SUM_REVENUE_STATISTICS.FAILURE:
      return {
        ...state,
        sumReport: {},
      };
    default:
      return state;
  }
}
