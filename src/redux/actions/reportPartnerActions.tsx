import { CallbackResponse, ReportPartnerInput } from 'models';
import * as types from 'redux/types';

export const getReportPartnerAction = (
  payload: ReportPartnerInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_REPORT_PARTNER.REQUEST,
    callback,
    payload,
  };
};
