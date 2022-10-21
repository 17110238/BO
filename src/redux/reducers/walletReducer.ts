import * as types from 'redux/types';
import { ActionReducer, WalletState } from 'models';

const initState: WalletState = {
  appVersion: {
    data: [],
    loading: false,
    error: false,
  },
};

const walletReducer = (state = initState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_WALLET_VERSION.REQUEST:
      return {
        ...state,
        appVersion: {
          ...state.appVersion,
          loading: true,
        },
      };
    case types.GET_WALLET_VERSION.SUCCESS:
      return {
        ...state,
        appVersion: {
          ...state.appVersion,
          loading: false,
          data: action.payload,
        },
      };
    case types.GET_WALLET_VERSION.FAILURE:
      return {
        ...state,
        appVersion: {
          ...state.appVersion,
          loading: false,
          data: [],
          error: action.payload,
        },
      };
    case types.GET_WALLET_VERSION.REFRESH:
      return {
        ...state,
        appVersion: {
          ...state.appVersion,
          loading: false,
          error: false,
        },
      };
    default:
      return state;
  }
};

export default walletReducer;
