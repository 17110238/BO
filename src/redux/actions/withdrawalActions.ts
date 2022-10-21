import * as types from 'redux/types';
import {
  CallbackResponse,
} from 'models';
import { GetWithdrawInput, ChangeWithdrawInput } from 'models';

export const getListWithdraw = (
  payload: GetWithdrawInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_WITHDRAW.REQUEST,
    payload,
    callback,
  };
};


export const changeWithdraw = (
  payload: ChangeWithdrawInput,
  callback: CallbackResponse
) => {
  return {
    type: types.CHANGE_WITHDRAW.REQUEST,
    payload,
    callback,
  };
};


