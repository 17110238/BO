import * as types from 'redux/types';
import { CallbackResponse } from 'models';

export const getListSupplierManage = (callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_SUPPLIER_MANAGE.REQUEST,

    callback,
  };
};

export const getDetailSupplierManage = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_DETAIL_SUPPLIER.REQUEST,
    payload,
    callback,
  };
};

export const clearDataSupplierManage = () => {
  return {
    type: types.GET_DETAIL_SUPPLIER.CLEAR,
  };
};
export const exportFileSupplierManage = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.EXPORT_SUPPLIER_MANAGE.REQUEST,
    payload,
    callback,
  };
};


export const getReportTransactionSupplier = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.REQUEST,
    payload,
    callback,
  };
};