import * as types from 'redux/types';
import { CallbackResponse } from 'models';

export const getEwalletReportAction = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.REPORT_CHECK_SUM.REQUEST,
    callback,
    payload,
  };
};

export const getListEwalletReportUser = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_REPORT_USER.REQUEST,
    callback,
    payload,
  };
};

export const getStatisticEwalletReportUser = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_STATISTIC_REPORT_USER.REQUEST,
    callback,
    payload,
  };
};

export const exportFileReportUser = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.EXPORT_FILE_REPORT_USER.REQUEST,
    callback,
    payload,
  };
};

export const exportFileReportUserPending = () => {
  return {
    type: types.EXPORT_FILE_REPORT_USER.PENDING,
  };
};
export const exportFileReportUserFailure = () => {
  return {
    type: types.EXPORT_FILE_REPORT_USER.FAILURE,
  };
};
export const exportFileReportUserSucess = () => {
  return {
    type: types.EXPORT_FILE_REPORT_USER.SUCCESS,
  };
};
