import * as types from 'redux/types';
import { CallbackResponse, ReportMerchantEwalletInput } from 'models';

export const getReportEwalletMC = (payload: ReportMerchantEwalletInput, callback: CallbackResponse) => {
  return {
    type: types.GET_REPORT_EWALLET_MC.REQUEST,
    payload,
    callback,
  };
};

export const exportReportEwalletMc = (payload: ReportMerchantEwalletInput, callback: CallbackResponse) => {
  return {
    type: types.EXPORT_REPORT_EWALLET_MC.REQUEST,
    payload,
    callback,
  };
};