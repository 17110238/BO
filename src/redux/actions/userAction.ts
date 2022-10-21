import { CallbackResponse } from 'models';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';
import { createUserType, DeleteInput } from 'models/user/userState';
import * as types from 'redux/types';

export const searchUser = (payload: FilterSearchAccountMc, callback: CallbackResponse) => {
  return {
    type: types.SEARCH_USER_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const createUser = (payload: createUserType, callback: CallbackResponse) => {
  return {
    type: types.CREATE_USER.REQUEST,
    payload,
    callback,
  };
};
export const getListRoleUser = () => {
  return {
    type: types.GET_LIST_ROLE_USER.REQUEST,

  };
};
export const getDetailUser = (payload: createUserType, callback: CallbackResponse) => {
  return {
    type: types.GET_DETAIL_USER.REQUEST,
    payload,
    callback,
  };
};
export const deleteDetailUser = () => {
  return {
    type: types.GET_DETAIL_USER.DELETE,
  };
};
export const deleteUserBoList = () => {
  return {
    type: types.SEARCH_USER_MERCHANT.DELETE,
  };
};
export const updateUser = (payload: createUserType, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_USER.REQUEST,
    payload,
    callback,
  };
};
export const createUserScope = (payload: createUserType, callback: CallbackResponse) => {
  return {
    type: types.CREATE_USER_SCOPE.REQUEST,
    payload,
    callback,
  };
};
export const updateUserScope = (payload: createUserType, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_USER_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const deleteUser = (payload: DeleteInput, callback: CallbackResponse) => {
  return {
    type: types.DELETE_USER.REQUEST,
    payload,
    callback,
  };
};
