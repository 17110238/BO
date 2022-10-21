import { ActionReducer } from 'models';
import * as types from 'redux/types';

/* eslint-disable no-case-declarations */

const initialState = {
  filter: {},
  loading: false,
};

export default function reportKYC(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_REPORT_KYC.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LIST_REPORT_KYC.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LIST_REPORT_KYC.FAILURE:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}
