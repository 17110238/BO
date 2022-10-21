import * as types from 'redux/types';
import {
  CallbackResponse,
  SearchConnectedUserInput,
  UnlinkConnectedUserInput,
} from 'models';

export const getListConnectedUser = (
  payload: SearchConnectedUserInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_CONNECTED_USER.REQUEST,
    payload,
    callback,
  };
};

export const unlinkConnectedUser = (
  payload: UnlinkConnectedUserInput,
  callback: CallbackResponse
) => {
  return {
    type: types.UNLINK_CONNECTED_USER.REQUEST,
    payload,
    callback,
  };
};
