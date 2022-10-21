import { CallbackResponse } from 'models';
import * as types from 'redux/types';

export const getReportSalaryAdvance = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_REPORT_SALARY_ADVANCE.REQUEST,
    payload,
    callback,
  };
};

export const getSalaryAdvance = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_SALARY_ADVANCE.REQUEST,
    payload,
    callback,
  };
};
