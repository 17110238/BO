import {
  CallbackResponse,
  FilterEwalletReportTransactionBankInput,
  PayloadListEwalletBankTransaction,
} from 'models';
import * as types from 'redux/types';

export const getListEwalletBankTransaction = (
  payload: PayloadListEwalletBankTransaction,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_LIST_EWALLET_BANK_TRANSACTION.REQUEST,
    callback,
    payload,
  };
};

export const getListEwalletBankTransactionReport = (
  payload: FilterEwalletReportTransactionBankInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_LIST_EWALLET_BANK_TRANSACTION_REPORT.REQUEST,
    callback,
    payload,
  };
};

export const exportEwalletBankTransaction = (
  payload: PayloadListEwalletBankTransaction,
  callback?: CallbackResponse
) => {
  return {
    type: types.EXPORT_EWALLET_BANK_TRANSACTION.REQUEST,
    callback,
    payload,
  };
};
