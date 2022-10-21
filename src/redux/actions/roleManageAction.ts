import { CallbackResponse } from 'models';
import { payloadUpdateScopeRole } from 'models/role/listRole';
import * as types from 'redux/types/roleManageTypes';

export const getListScope = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const getListRole = (callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_ROLE.REQUEST,
    callback,
  };
};

export const updateScopeRole = (payload: payloadUpdateScopeRole, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_SCOPE_ROLE.REQUEST,
    payload,
    callback,
  };
};
