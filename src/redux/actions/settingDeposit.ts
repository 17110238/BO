import {
  CallbackResponse,
  PayloadSearchDeposit,
  PayloadUpdateDeposit,
  SettingDeposit,
} from 'models';
import * as types from 'redux/types';

export const getSettingDeposit = (payload: PayloadSearchDeposit, callback?: CallbackResponse) => {
  return {
    type: types.GET_SETTING_DEPOSIT.REQUEST,
    callback,
    payload,
  };
};

export const updateSettingDeposit = (
  payload: PayloadUpdateDeposit,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_SETTING_DEPOSIT.REQUEST,
    callback,
    payload,
  };
};

export const createSettingDeposit = (payload: SettingDeposit, callback?: CallbackResponse) => {
  return {
    type: types.CREATE_SETTING_DEPOSIT.REQUEST,
    callback,
    payload,
  };
};
