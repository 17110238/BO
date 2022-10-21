import * as types from 'redux/types';
import { authState, ActionReducer } from 'models';

const initialState: authState = {
  loading: false,
  error: false,
  accessToken: '',
  show: false,
  listRole: [],
  accountInfo: {
    profile: {},
    scope: [],
    link: '',
    refcode: '',
  },
};

export default function authReducers(state = initialState, action: ActionReducer) {
  const { type, payload } = action;
  switch (type) {
    case types.CHECK_AUTH.CHECK_AUTH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.CHECK_AUTH.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        accessToken: payload.accessToken,
        accountInfo: {
          profile: payload.accountInfo,
          scope: payload.scope,
          link: payload.link,
          refcode: payload.refcode,
        },
      };
    case types.GET_LIST_ROLE_USER.SUCCESS:
      return {
        ...state,
        listRole: payload,
      };
    case types.CHECK_AUTH.CHECK_AUTH_REFRESH:
      return {
        ...state,
        error: false,
        loading: false,
      };

    case types.GET_ACCOUNT_INFO.GET_ACCOUNT_INFO_REQUEST:
      return {
        ...state,
        accountInfo: {
          ...state.accountInfo,
          loading: true,
        },
      };
    case types.GET_ACCOUNT_INFO.GET_ACCOUNT_INFO_FAILURE:
      return {
        ...state,
        accountInfo: {
          ...state.accountInfo,
          loading: false,
          error: payload.error,
        },
      };
    case types.SHOW_MODAL_CHANGE_PASSWORD.SHOW:
      return {
        ...state,
        show: true,
      };
    case types.SHOW_MODAL_CHANGE_PASSWORD.ClOSE:
      return {
        ...state,
        show: false,
      };

    default:
      return state;
  }
}
