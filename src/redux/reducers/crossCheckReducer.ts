import { Account } from './../../models/account/accountState';
import * as types from 'redux/types';
import { ActionReducer } from 'models';
/* eslint-disable no-case-declarations */
const initialState = {
  loading: false,
  loadingReject: false,
  loadingConfirm: false,
  loadingUpdate: false,
  loadingExport:false,
   dataCrossCheck: [],
    dataCheckItem:[]
    
};
export default function crossCheckReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_ACOUNTANT_CROSS_CHECK.DELETE:
      return {
        ...state,
        dataCrossCheck: [],
      };
    case types.GET_LIST_ACOUNTANT_CROSS_CHECK.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_ACOUNTANT_CROSS_CHECK.SUCCESS:
      return {
        ...state,
        loading: false,
        dataCrossCheck: action.payload,
      };
    case types.GET_LIST_ACOUNTANT_CROSS_CHECK.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.GET_ACOUNTANT_CROSS_CHECK_iTEM.REQUEST:
        return {
          ...state,
          loading: true,
        };
      case types.GET_ACOUNTANT_CROSS_CHECK_iTEM.SUCCESS:
        return {
          ...state,
          loading: false,
          dataCheckItem: action.payload,
        };
      case types.GET_ACOUNTANT_CROSS_CHECK_iTEM.FAILURE:
        return {
          ...state,
          loading: false,
      };
      case types. BO_REJECT_CROSS_CHECK.REQUEST:
        return {
          ...state,
          loadingReject: true,
      };
      case types. BO_REJECT_CROSS_CHECK.SUCCESS:
        return {
          ...state,
          loadingReject: false,
      };
      case types. BO_REJECT_CROSS_CHECK.FAILURE:
        return {
          ...state,
          loadingReject: false,
        };
        case types. UPDATE_STATE_FINAL_CROSS_CHECK.REQUEST:
          return {
            ...state,
            loadingConfirm: true,
        };
        case types. UPDATE_STATE_FINAL_CROSS_CHECK.SUCCESS:
          return {
            ...state,
            loadingConfirm: false,
        };
        case types. UPDATE_STATE_FINAL_CROSS_CHECK.FAILURE:
          return {
            ...state,
            loadingConfirm: false,
      };
      case types. UPDATE_STATE_CROSS_CHECK.REQUEST:
        return {
          ...state,
          loadingUpdate: true,
      };
      case types. UPDATE_STATE_CROSS_CHECK.SUCCESS:
        return {
          ...state,
          loadingUpdate: false,
      };
      case types. UPDATE_STATE_CROSS_CHECK.FAILURE:
        return {
          ...state,
          loadingUpdate: false,
        };
        case types.EXPORT_ACOUNTANT_CROSS_CHECK.REQUEST:
          return {
            ...state,
            loadingExport: true,
          };
        case types.EXPORT_ACOUNTANT_CROSS_CHECK.SUCCESS:
          return {
            ...state, loadingExport: false
          };
        case types.EXPORT_ACOUNTANT_CROSS_CHECK.FAILURE:
          return {
            ...state,
            loadingExport: false,
          };
        case types.EXPORT_ACOUNTANT_CROSS_CHECK.PENDING:
          return {
            ...state,
            loadingExport: true,
          };
         
    default:
      return state;
  }
}
