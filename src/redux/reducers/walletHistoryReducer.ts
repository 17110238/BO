import { ActionReducer } from 'models';
import { WalletHistoryState } from 'models/walletHistory/walletHistoryState';
import * as types from 'redux/types/walletHistoryTypes';

const initialState: WalletHistoryState = {
  loading: false,
  walletHistory: [],
};

export default function walletHistory(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_WALLET_HISTORY.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_WALLET_HISTORY.SUCCESS:
      return {
        ...state,
        loading: false,
        walletHistory: action.payload.data,
      };

    case types.GET_WALLET_HISTORY.FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}