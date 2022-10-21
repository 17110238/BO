import { CallbackResponse, VersionType } from 'models';
import * as types from 'redux/types';

export const getVersionApp = (callback?: CallbackResponse) => {
  return {
    type: types.GET_VERSION_APP.REQUEST,
    callback,
  };
};

export const updateConfigVersion = (payload: VersionType, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_VERSION_APP.REQUEST,
    callback,
    payload
  };
};
