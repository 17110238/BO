import * as types from 'redux/types';
import { EwalletPaymeTransferState, ActionReducer } from 'models';

const initialState: EwalletPaymeTransferState = {
  loading: false,
  eWalletTransferHistory: [],
  countSuccess: {},
};

export default function eWalletPaymeTransfer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_PAYME_TRANSFER_HISTORY.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_PAYME_TRANSFER_HISTORY.SUCCESS:
      return {
        ...state,
        loading: false,
        eWalletTransferHistory: action.payload,
      };
    case types.GET_LIST_PAYME_TRANSFER_HISTORY.FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
