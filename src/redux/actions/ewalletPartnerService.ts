import { CallbackResponse, SearchSupplierTransactionInput } from 'models';
import { GetBankReportInput, GetEwalletGateReportInput, GetEwalletHistoryReportInput, GetEwalletServiceBillReportInput, GetEwalletSsccReportInput } from 'models/ewalletPartnerService';
import * as types from 'redux/types';

export const getEwalletServiceBillReport = (payload: GetEwalletServiceBillReportInput , callback: CallbackResponse) => {
  return {
    type: types.GET_EWALLET_SERVICE_REPORT_BILL.REQUEST,
    payload,
    callback,
  };
};

export const getBankReport = (payload: GetBankReportInput , callback: CallbackResponse) => {
  return {
    type: types.GET_BANK_REPORT.REQUEST,
    payload,
    callback,
  };
};

export const getEwalletGateReport = (payload: GetEwalletGateReportInput , callback: CallbackResponse) => {
  return {
    type: types.GET_EWALLET_GATE_REPORT.REQUEST,
    payload,
    callback,
  };
};

export const getEwalletHistoryReport = (payload: GetEwalletHistoryReportInput , callback: CallbackResponse) => {
  return {
    type: types.GET_EWALLET_HISTORY_REPORT.REQUEST,
    payload,
    callback,
  };
};

export const getEwalletSsccReport = (payload: GetEwalletSsccReportInput , callback: CallbackResponse) => {
  return {
    type: types.GET_EWALLET_SSCC_REPORT.REQUEST,
    payload,
    callback,
  };
};

export const exportPartnerService = (payload: SearchSupplierTransactionInput, callback: CallbackResponse) => {
  return {
    type: types.EXPORT_PARTNER_SERVICE.REQUEST,
    payload,
    callback,
  };
};