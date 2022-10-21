import { CallbackResponse, GetListMCScopeInput } from 'models';
import { CreateScopeMCInput, DeleteScopeBoInput, PostScope, Scope, scopeFilterInterface, UpdateScopeMCInput } from 'models/scope';

import * as types from 'redux/types/scopeTypes';

export const getScopeList = (payload: scopeFilterInterface, callback?: CallbackResponse) => {
  return {
    type: types.GET_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const createScope = (payload: PostScope, callback?: CallbackResponse) => {
  return {
    type: types.CREATE_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const updateScope = (payload: PostScope, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const deleteScope = (payload: PostScope, callback?: CallbackResponse) => {
  return {
    type: types.DELETE_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const getListMCScope = (payload: GetListMCScopeInput, callback?: CallbackResponse) => {
  return {
    type: types.GET_LIST_MC_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const deleteMCScope = (payload: DeleteScopeBoInput, callback?: CallbackResponse) => {
  return {
    type: types.DELETE_MC_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const updateMCScope = (payload: UpdateScopeMCInput, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_MC_SCOPE.REQUEST,
    payload,
    callback,
  };
};

export const createMCScope = (payload: CreateScopeMCInput, callback?: CallbackResponse) => {
  return {
    type: types.CREATE_MC_SCOPE.REQUEST,
    payload,
    callback,
  };
};

