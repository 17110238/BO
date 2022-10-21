import { CallbackResponse, PayloadGetSettingSystem, SettingSystemType } from 'models';
import * as types from 'redux/types';

export const getAdvancedConfig = (payload: PayloadGetSettingSystem, callback: CallbackResponse) => {
  return {
    type: types.GET_SETTING_SYSTEM.REQUEST,
    payload,
    callback,
  };
};

export const updateSettingSystem = (payload: SettingSystemType, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_SETTING_SYSTEM.REQUEST,
    payload,
    callback,
  };
};
