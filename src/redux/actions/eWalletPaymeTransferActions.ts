import * as types from 'redux/types';
import {
  CallbackResponse,
  EwalletPaymeTransferHistoryInput,
  EwalletPaymeTransferLogInput,
  EwalletPaymeTransferCampaignInput,
} from 'models';

export const getListPaymeTransferHistory = (
  payload: EwalletPaymeTransferHistoryInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_LIST_PAYME_TRANSFER_HISTORY.REQUEST,
    payload,
    callback,
  };
};

export const getListPaymeTransferLog = (
  payload: EwalletPaymeTransferLogInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_LIST_PAYME_TRANSFER_LOG.REQUEST,
    payload,
    callback,
  };
};

export const getDetailPaymeTransfer = (
  payload: EwalletPaymeTransferLogInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_DETAIL_PAYME_TRANSFER.REQUEST,
    payload,
    callback,
  };
};

export const addPaymeTransfer = (
  payload: any, 
  callback?: CallbackResponse
) => {
  return {
    type: types.TRANSFER_WALLET_PAYME.REQUEST,
    payload,
    callback,
  };
};

export const confirmPaymeTransfer = (
  payload: EwalletPaymeTransferCampaignInput, 
  callback?: CallbackResponse
) => {
  return {
    type: types.CONFIRM_TRANSFER_WALLET_PAYME.REQUEST,
    payload,
    callback,
  };
};

export const createCommandPaymeTransfer = (
  payload: any, 
  callback?: CallbackResponse
) => {
  return {
    type: types.CREATE_COMMAND_TRANSFER_WALLET_PAYME.REQUEST,
    payload,
    callback,
  };
};