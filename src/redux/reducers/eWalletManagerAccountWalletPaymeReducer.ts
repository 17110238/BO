import { ActionReducer } from 'models';
import * as types from 'redux/types';

const initialState: any = {
  loading: false,
  data: [],
  dataCompany: [],
};

export default function ManagerAccountWalletPaymeReducer(
  state = initialState,
  action: ActionReducer
) {
  switch (action.type) {
    case types.SEARCH_ACCOUNTS_WALLET_PAYME.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.SEARCH_ACCOUNTS_WALLET_PAYME.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case types.SEARCH_ACCOUNTS_WALLET_PAYME.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LIST_COMPANY.REQUEST:
      return {
        ...state
      };
    case types.GET_LIST_COMPANY.SUCCESS:
      return {
        ...state,
        dataCompany: action.payload,
      };
    case types.GET_LIST_COMPANY.FAILURE:
      return {
        ...state
      };
    default:
      return state;
  }
}
