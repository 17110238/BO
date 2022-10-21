import * as types from 'redux/types';
import { CallbackResponse } from 'models';
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */
export const actionLogin = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.CHECK_AUTH.CHECK_AUTH_REQUEST,
    payload,
    callback,
  };
};
export const getListRoleOfAppUserAPI = () => {
  return {
    type: types.GET_LIST_ROLE_USER.REQUEST,
  };
};
export const showModalChangePassword = () => {
  return {
    type: types.SHOW_MODAL_CHANGE_PASSWORD.SHOW,
  };
};
export const closeModalChangePassword = () => {
  return {
    type: types.SHOW_MODAL_CHANGE_PASSWORD.ClOSE,
  };
};
export const changePassAuth = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_PASSWORD_AUTH.REQUEST,
    payload,
    callback,
  };
};
