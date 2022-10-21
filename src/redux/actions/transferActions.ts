import { CallbackResponse } from 'models';
import * as types from 'redux/types/transferTypes';
import { SearchMismatchTransactionInput, UpdateMismatchTransactionInput } from 'models/transfer'

export const getMismatchTransactions = (payload: SearchMismatchTransactionInput, callback: CallbackResponse) => {
  return {
    type: types.GET_MISMATCH_TRANSACTIONS.REQUEST,
    payload,
    callback,
  };
};

export const updateMismatchTransaction = (payload: UpdateMismatchTransactionInput, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_MISMATCH_TRANSACTIONS.REQUEST,
    payload,
    callback,
  };
};

export const exportFileMismatchTransactions = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.EXPORT_MISMATCH_TRANSACTIONS.REQUEST,
    payload,
    callback,
  };
};

export const exportFileMismatchTransactionsFailure = () => {
  return {
    type: types.EXPORT_MISMATCH_TRANSACTIONS.FAILURE,
  };
};

export const exportFileMismatchTransactionsSuccess = () => {
  return {
    type: types.EXPORT_MISMATCH_TRANSACTIONS.SUCCESS,
  };
};