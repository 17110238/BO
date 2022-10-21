import * as types from 'redux/types';
import {
  CallbackResponse,
  CancelTransactionInput,
  GetAllTransactionsInput,
  GetDetailPaymentInput,
  GetRefundAmountInput,
  RefundTransactionInput,
} from 'models';

export const getListTransaction = (
  payload: GetAllTransactionsInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const getDetailTransaction = (
  payload: GetDetailPaymentInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_DETAIL_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const refundTransaction = (payload: RefundTransactionInput, callback: CallbackResponse) => {
  return {
    type: types.REFUND_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const cancelTransaction = (payload: CancelTransactionInput, callback: CallbackResponse) => {
  return {
    type: types.CANCEL_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const getRefundAmountTransaction = (
  payload: GetRefundAmountInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_REFUND_AMOUNT_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const addPayint = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.ADD_PAYINT.REQUEST,
    payload,
    callback,
  };
};

export const reviewPayint = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.REVIEW_PAYINT.REQUEST,
    payload,
    callback,
  };
};

export const approvePayint = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.APPROVE_PAYINT.REQUEST,
    payload,
    callback,
  };
};

export const exportFileTransaction = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.TRANSACTION_MANAGE_EXPORT.REQUEST,
    payload,
    callback,
  };
};

export const exportFileTransactionPending = () => {
  return {
    type: types.TRANSACTION_MANAGE_EXPORT.PENDING,
  };
};
export const exportFileTransactionFailure = () => {
  return {
    type: types.TRANSACTION_MANAGE_EXPORT.FAILURE,
  };
};
export const exportFileTransactionSucess = () => {
  return {
    type: types.TRANSACTION_MANAGE_EXPORT.SUCCESS,
  };
};
