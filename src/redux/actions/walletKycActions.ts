import { CallbackResponse } from 'models';
import * as types from 'redux/types';
import {
  PayloadLogKYCWallet,
  PayloadRejectEKYC,
  PayloadRequestEKYC,
  PayloadSearchKYC,
  WalletKYC,
} from './../../models/walletKyc/walletKycState';

export const getEKYCList = (payload: PayloadSearchKYC, callback?: CallbackResponse) => {
  return {
    type: types.GET_EWALLET_KYC.REQUEST,
    callback,
    payload,
  };
};

export const updateEKYC = (payload: WalletKYC, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_EWALLET_KYC.REQUEST,
    callback,
    payload,
  };
};

export const requestEKYC = (payload: PayloadRequestEKYC, callback?: CallbackResponse) => {
  return {
    type: types.REQUEST_EWALLET_KYC.REQUEST,
    callback,
    payload,
  };
};

export const rejectEKYC = (payload: PayloadRejectEKYC, callback?: CallbackResponse) => {
  return {
    type: types.REJECT_EWALLET_KYC.REQUEST,
    callback,
    payload,
  };
};

export const getListLogKYCWallet = (payload: PayloadLogKYCWallet, callback?: CallbackResponse) => {
  return {
    type: types.GET_LOGS_EWALLET_KYC.REQUEST,
    callback,
    payload,
  };
};

export const requestApprovalAutoEKYC = (
  payload: PayloadRequestEKYC,
  callback?: CallbackResponse
) => {
  return {
    type: types.REQUEST_APRROVAL_AUTO_EWALLET_KYC.REQUEST,
    callback,
    payload,
  };
};

export const rejectEKYCIC = (
  payload: Pick<PayloadRejectEKYC, 'reason' | 'id'>,
  callback?: CallbackResponse
) => {
  return {
    type: types.REJECT_EWALLET_KYC_IC.REQUEST,
    callback,
    payload,
  };
};

export const requestEKYCIC = (
  payload: Pick<WalletKYC, 'id' | 'identifyNumber'>,
  callback?: CallbackResponse
) => {
  return {
    type: types.REQUEST_EWALLET_KYC_IC.REQUEST,
    callback,
    payload,
  };
};
