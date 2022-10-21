import * as types from 'redux/types';
import {
  CallbackResponse, GetEWalletTransactionDetailInput, RefundEWalletTransactionInput, SearchEWalletTransactionInput,
} from 'models';

export const getListEWalletTransaction = (
  payload: SearchEWalletTransactionInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_E_WALLET_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const getServiceSearchTransaction = (
  callback: CallbackResponse
) => {
  return {
    type: types.GET_SERVICE_SEARCH_TRANSACTION.REQUEST,
    callback,
  };
};

export const getEWalletTransactionDetails = (
  payload: GetEWalletTransactionDetailInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_E_WALLET_DETAILS.REQUEST,
    payload,
    callback,
  };
};

export const eWalletTransactionRefund = (
  payload: RefundEWalletTransactionInput,
  callback: CallbackResponse
) => {
  return {
    type: types.REFUND_E_WALLET_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const exportFileTransactionHistory = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.EXPORT_E_WALLET_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const exportFileTransactionHistoryPending = () => {
  return {
    type: types.EXPORT_E_WALLET_TRANSACTION.PENDING,
  };
};
export const exportFileTransactionHistoryFailure = () => {
  return {
    type: types.EXPORT_E_WALLET_TRANSACTION.FAILURE,
  };
};
export const exportFileTransactionHistorySucess = () => {
  return {
    type: types.EXPORT_E_WALLET_TRANSACTION.SUCCESS,
  };
};

export const getListEWalletTransactionSupplier = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_E_WALLET_TRANSACTION_SUPPLIER.REQUEST,
    payload,
    callback,
  };
};


