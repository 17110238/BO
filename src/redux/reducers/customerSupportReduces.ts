import * as types from 'redux/types';

/* eslint-disable no-case-declarations */
const initialState = {
  loading: false,
  listData: [],
  listFilterValue: [],
};

export default function customerSupportReducers(state = initialState, action: any) {
  switch (action.type) {
    case types.GET_DETAIL_CUSTOMER_SUPPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DETAIL_CUSTOMER_SUPPORT.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.GET_DETAIL_CUSTOMER_SUPPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LIST_CUSTOMER_SUPPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_CUSTOMER_SUPPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        listData: action.payload,
      };
    case types.GET_LIST_CUSTOMER_SUPPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.ADD_TICKET.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ADD_TICKET.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.ADD_TICKET.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LOG_CUSTOMER_SUPPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LOG_CUSTOMER_SUPPORT.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LOG_CUSTOMER_SUPPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.UPDATE_TICKET.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.UPDATE_TICKET.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.UPDATE_TICKET.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.SEND_EMAIL_CUSTOMER_SUPPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.SEND_EMAIL_CUSTOMER_SUPPORT.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.SEND_EMAIL_CUSTOMER_SUPPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_DATA_DASHBOARD_TICKET.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DATA_DASHBOARD_TICKET.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.GET_DATA_DASHBOARD_TICKET.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DETAIL_DATA_DASHBOARD_TICKET.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.GET_DETAIL_DATA_DASHBOARD_TICKET.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        listFilterValue: action.payload,
      };
    case types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
