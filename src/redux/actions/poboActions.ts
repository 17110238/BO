import * as types from 'redux/types';
import { CallbackResponse, GetRefundAmountInput } from 'models';
import {
  ChangePoboOrderStateInput,
  ExportPoboOrderInput,
  ExportWithDrawInput,
  GetPoboOrderInput,
} from 'models/pobo/poboState';

export const getListPOBO = (payload: GetPoboOrderInput, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_POBO.REQUEST,
    payload,
    callback,
  };
};

export const changePOBO = (payload: ChangePoboOrderStateInput, callback: CallbackResponse) => {
  return {
    type: types.CHANGE_POBO.REQUEST,
    payload,
    callback,
  };
};

export const getTransactionBankState = (
  payload: GetRefundAmountInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_TRANSACTION_BANK_STATE.REQUEST,
    payload,
    callback,
  };
};

export const exportPoboOrder = (payload: ExportPoboOrderInput, callback: CallbackResponse) => {
  return {
    type: types.EXPORT_POBO_ORDER.REQUEST,
    payload,
    callback,
  };
};

export const exportWithDraw = (payload: ExportWithDrawInput, callback: CallbackResponse) => {
  return {
    type: types.EXPORT_WITH_DRAW.REQUEST,
    payload,
    callback,
  };
};
