import * as types from 'redux/types/roleManageTypes';
import { roleReducer, roleAction } from 'models/role/listRole';
const initialState: roleReducer = {
  loading: false,
  listScope: [],
  listRole: [],
  error: false,
};

export default function roleManageReducer(state = initialState, { payload, type }: roleAction) {
  switch (type) {
    case types.GET_LIST_SCOPE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_SCOPE.SUCCESS:
      return {
        ...state,
        loading: false,
        listScope: payload,
      };
    case types.GET_LIST_SCOPE.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    case types.GET_LIST_ROLE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_ROLE.SUCCESS:
      return {
        ...state,
        loading: false,
        listRole: payload,
      };
    case types.GET_LIST_ROLE.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    case types.UPDATE_SCOPE_ROLE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.UPDATE_SCOPE_ROLE.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.UPDATE_SCOPE_ROLE.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
