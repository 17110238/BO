import { CallbackResponse } from "models";
import { ReportEwalletAccountInput } from "models/overviewReportWallet";
import * as types from 'redux/types';


export const getOverviewReportWallet = (
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_OVERVIEW_REPORT_WALLET.REQUEST,
    callback,
  };
};

export const getTotalUser = (
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_TOTAL_USER.REQUEST,
    callback,
  };
};

export const reportEwalletDaily = (payload: ReportEwalletAccountInput , callback: CallbackResponse) => {
  return {
    type: types.REPORT_EWALLET_DAILY.REQUEST,
    payload,
    callback,
  };
};

export const getAccountStatmentSecureWallet = (
  callback?: CallbackResponse
) => {
  return {
    type: types.ACCOUNT_STATMENT_SECURE_WALLET.REQUEST,
    callback,
  };
};