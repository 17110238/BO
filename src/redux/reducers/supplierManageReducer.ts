import { ActionReducer } from 'models';
import * as types from 'redux/types';

const initialState = {
  loading: false,
  supplierInfoArray: [],
  supplierDetail: [],
  filter: {},
  errorExport: {
    message: '',
    code: '',
  },
};

export default function supplier(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_SUPPLIER_MANAGE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_SUPPLIER_MANAGE.SUCCESS:
      return {
        ...state,
        loading: false,
        supplierInfoArray: action.payload,
      };
    case types.GET_LIST_SUPPLIER_MANAGE.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.GET_DETAIL_SUPPLIER.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DETAIL_SUPPLIER.CLEAR:
      return {
        ...state,
        supplierDetail: [],
      };
    case types.GET_DETAIL_SUPPLIER.SUCCESS:
      return {
        ...state,
        loading: false,
        filter: action.payload,
        // supplierDetail: action.payload,
      };
    case types.GET_DETAIL_SUPPLIER.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.EXPORT_SUPPLIER_MANAGE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.EXPORT_SUPPLIER_MANAGE.SUCCESS:
      return { ...state, loading: false };
    case types.EXPORT_SUPPLIER_MANAGE.FAILURE:
      return {
        ...state,
        loading: false,
        errorExport: action.payload,
      };

    case types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.SUCCESS:
      return { ...state, loading: false };

    case types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
