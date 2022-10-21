import * as types from 'redux/types';
import { ActionReducer } from 'models';

const initialState = {
  loading: false,
  filter: {},
};

export default function eWalletLoginHistoryReducers(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_E_WALLET_HISTORY_LOGIN.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_E_WALLET_HISTORY_LOGIN.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LIST_E_WALLET_HISTORY_LOGIN.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
