// import * as types from 'redux/types/accountMcType';
// import * as typess from 'redux/types/utilityType';
import { ActionReducer } from 'models';
import { AccountMerchantState } from 'models/account/accountMerchant';
import * as types from 'redux/types';
/* eslint-disable no-case-declarations */
const initialState: AccountMerchantState = {
  loading: false,
  isTabList: false,
  showFilter: false,
  accountMerchantInfoArray: [],
  roles: [],
};

export default function AccountMerchant(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.SEARCH_ACCOUNT_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.SEARCH_ACCOUNT_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        accountMerchantInfoArray: action.payload,
      };
    case types.SEARCH_ACCOUNT_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.DELETE_ACCOUNT_MC: {
      return {
        ...state,
        loading: false,
        accountMerchantInfoArray: [],
      };
    }
    case types.GET_LIST_ROLE_ACCOUNT_MC.SUCCESS: {
      return {
        ...state,
        loading: false,
        roles: action.payload,
      };
    }
    case types.GET_LIST_ROLE_ACCOUNT_MC.FAILURE: {
      return {
        ...state,
        loading: false,
      };
    }
    case types.GET_LOGS.REQUEST  : {
      return {
        ...state,
        loading : true
      }
    }
    case types.GET_LOGS.SUCCESS : {
      return {
        ...state,
        loading : false
      }
    }
    case types.GET_LOGS.FAILURE : {
      return {
        ...state,
        loading : false
      }
    }
    default:
      return state;
  }
}
