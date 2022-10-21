import { CallbackResponse, CreateDepositBankInput, CreateEwalletPaymentBoInput, GetEwalletPaymentsInput, ListAccountBankSearch, ManualBankSearch, UpdateEwalletDepositBankBoInput, UpdateEwalletDepositPaymentInput } from 'models';
import * as types from '../types/manualBankTypes';

export const getListAccountBank = (payload: ListAccountBankSearch, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_ACCOUNT_BANK.REQUEST,
    payload,
    callback,
  };
};

export const getListBank = (callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_BANK.REQUEST,
    callback,
  };
};

export const getListManualBank = (payload: ManualBankSearch, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_MANUAL_BANK.REQUEST,
    payload,
    callback,
  };
};

export const getListManualBankDeposit = (payload: GetEwalletPaymentsInput, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_MANUAL_BANK_DEPOSIT.REQUEST,
    payload,
    callback,
  };
};

export const createBankTransferTransaction = (payload: CreateEwalletPaymentBoInput, callback: CallbackResponse) => {
  return {
    type: types.CREATE_BANK_TRANSFER_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const updateBankTransaction = (payload: CreateEwalletPaymentBoInput, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_BANK_TRANSFER_TRANSACTION.REQUEST,
    payload,
    callback,
  };
};

export const createDepositBank = (payload: CreateDepositBankInput, callback: CallbackResponse) => {
  return {
    type: types.CREATE_DEPOSIT_BANK.REQUEST,
    payload,
    callback,
  };
};

export const updateDepositBank = (payload: UpdateEwalletDepositBankBoInput, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_BANK_DEPOSIT.REQUEST,
    payload,
    callback,
  };
};

export const updateBankPayment = (payload: UpdateEwalletDepositPaymentInput, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_BANK_PAYMENT.REQUEST,
    payload,
    callback,
  };
};
