import * as types from 'redux/types';
import { CallbackResponse } from 'models';

export const getEwalletServiceReportAction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.REPORT_EWALLET_SERVICE.REQUEST,
    payload,
    callback,
  };
};
export const getEwalletEnumServicesAction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_EWALLET_ENUM_SERVICE.REQUEST,
    payload,
    callback,
  };
};
export const getAppReportAction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.APP_SERVICE_ITEM.REQUEST,
    payload,
    callback,
  };
};
