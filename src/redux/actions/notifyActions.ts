import { CallbackResponse } from 'models';
import * as types from 'redux/types/notifyTypes';
import { GetLogInput, SendSmsInput } from 'models/notify'

export const getHistory = (payload: GetLogInput, callback: CallbackResponse) => {
  return {
    type: types.GET_HISTORY.REQUEST,
    payload,
    callback,
  };
};

export const sendSms = (payload: SendSmsInput, callback: CallbackResponse) => {
  return {
    type: types.SEND_SMS.REQUEST,
    payload,
    callback,
  };
};