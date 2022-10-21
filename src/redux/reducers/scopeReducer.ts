import * as types from 'redux/types/scopeTypes';
import { ActionReducer } from 'models';
import { scopeReducerType } from 'models/scope';
/* eslint-disable no-case-declarations */
const initialState: scopeReducerType = {
  loading: false,
  scopes: [],
  mcScopeArray: [],
};

export default function scopeReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_MC_SCOPE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_MC_SCOPE.SUCCESS:
      return {
        ...state,
        loading: false,
        mcScopeArray: action.payload,
      };
    case types.GET_LIST_MC_SCOPE.FAIL:
      return {
        ...state,
        loading: false,
      };

    case types.DELETE_MC_SCOPE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.DELETE_MC_SCOPE.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.DELETE_MC_SCOPE.FAIL:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
