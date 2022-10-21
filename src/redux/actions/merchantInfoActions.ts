import { CallbackResponse } from 'models';
import {
  BankLinkedInput,
  GetAccountMerchantLogInput,
  NewPasswordWalletInput,
  PayloadUpdateInfoAccount,
  ReportEwalletAccountInput,
  RequestCancelAccountInput,
  SearchEwalletAccountInput,
  SearchEWalletTransactionInput,
  UnlockKycInput,
} from 'models/merchantInfo/merchantInfoState';
import { appHistoryInput } from 'models/walletHistory/walletHistoryState';
import * as types from 'redux/types/merchantInfoTypes';

export const searchMerchantInfo = (
  payload: SearchEwalletAccountInput,
  callback: CallbackResponse
) => {
  return {
    type: types.SEARCH_MERCHANT_INFO.REQUEST,
    payload,
    callback,
  };
};


export const searchMerchantInfoList = (
  payload: SearchEwalletAccountInput,
  callback: CallbackResponse
) => {
  return {
    type: types.SEARCH_MERCHANT_INFO_LIST.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantSessions = (
  payload: SearchEwalletAccountInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_MERCHANT_SESSIONS.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantTransactionHistory = (
  payload: SearchEWalletTransactionInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_MERCHANT_TRANSACTION_HISTORY.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantLinkedBanks = (payload: BankLinkedInput |any, callback: CallbackResponse) => {
  return {
    type: types.GET_MERCHANT_LINKED_BANKS.REQUEST,
    payload,
    callback,
  };
};

export const requestCancelMerchantWallet = (
  payload: RequestCancelAccountInput,
  callback: CallbackResponse
) => {
  return {
    type: types.REQUEST_CANCEL_MERCHANT_WALLET.REQUEST,
    payload,
    callback,
  };
};

export const unlockKyc = (
  payload: UnlockKycInput,
  callback: CallbackResponse
) => {
  return {
    type: types.UNLOCK_MERCHANT_KYC.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantChangeHistory = (
  payload: GetAccountMerchantLogInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_MERCHANT_CHANGE_HISTORY.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantTransactionReport = (
  payload: ReportEwalletAccountInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_MERCHANT_TRANSACTION_REPORT.REQUEST,
    payload,
    callback,
  };
};

export const updateInfoAccountEWallet = (
  payload: PayloadUpdateInfoAccount,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_ACCOUNT_INFO_EWALLET.REQUEST,
    payload,
    callback,
  };
};

export const resetMerchantPassword = (
  payload: NewPasswordWalletInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.RESET_MERCHANT_PASSWORD.REQUEST,
    payload,
    callback,
  };
};

export const resetSearchMerchant = () => {
  return {
    type: types.RESET_SEARCH_MERCHANT.SUCCESS
  };
};