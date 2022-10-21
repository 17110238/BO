import { CallbackResponse } from 'models';
import * as types from '../types/loginHistoryTypes';

export const getLoginHistory = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.LOGIN_HISTORY_CTT.REQUEST,
    payload,
    callback,
  };
};

export const exportFileLoginHistory = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.EXPORT_LOGIN_HISTORY_CTT.REQUEST,
    payload,
    callback,
  };
};
