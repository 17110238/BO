import { GET_SUPPORT_STAFF } from './../types/customerSupport';

// import { exportFileTransaction } from './transactionActions';
import * as types from 'redux/types';
import { CallbackResponse } from 'models';
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */

export const getListCustomerSupport = (payload : any  , callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_CUSTOMER_SUPPORT.REQUEST,
    payload,
    callback,
  };
};


export const getFilterValueCustomerSupport = ( callback: CallbackResponse) => {
  return {
    type: types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.REQUEST,
    callback,
  };
};


export const getSupportStaff = ( callback: CallbackResponse) => {
  return {
    type: types.GET_SUPPORT_STAFF.REQUEST,
    callback,
  };
};


export const getDetailCustomerSupport = (payload : any  , callback: CallbackResponse) => {
  return {
    type: types.GET_DETAIL_CUSTOMER_SUPPORT.REQUEST,
    payload,
    callback,
  };
};
export const updateTicket = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_TICKET.REQUEST,
    payload,
    callback,
  };
};
export const addTicket = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.ADD_TICKET.REQUEST,
    payload,
    callback,
  };
};
export const sendEmail = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.SEND_EMAIL_CUSTOMER_SUPPORT.REQUEST,
    payload,
    callback,
  };
};
export const getLog = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_LOG_CUSTOMER_SUPPORT.REQUEST,
    payload,
    callback,
  };
};
export const getDataAssignTarget = (payload:any,callback:CallbackResponse) =>{
  return {
    type: types.GET_ASSIGN_TARGET.REQUEST,
    payload,
    callback,
  };
}
export const getDataDashBoardTicket = (payload :any,callback:CallbackResponse) =>{
  return {
    type: types.GET_DATA_DASHBOARD_TICKET.REQUEST,
    payload,
    callback,
  };
}
export const getDetailDataDashBoardTicket = (payload :any,callback:CallbackResponse) =>{
  return {
    type: types.GET_DETAIL_DATA_DASHBOARD_TICKET.REQUEST,
    payload,
    callback,
  };
}
export const setStateDashBoardTicket = (payload:any,callback:CallbackResponse) =>{
  return {
    type:types.SET_STATE_TICKET.REQUEST,
    payload,
    callback
  }
}
export const getRelyDashBoardTicket = (payload:any,callback:CallbackResponse) =>{
  return {
    type:types.GET_DATA_RELY_TICKET.REQUEST,
    payload,
    callback
  }
}
export const addReplyTicket = (payload:any,callback:CallbackResponse) =>{
  return {
    type:types.ADD_RELY_DASHBOARD_TICKET.REQUEST,
    payload,
    callback
  }
}


