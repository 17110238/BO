import { Account } from './../../models/account/accountState';
import * as types from 'redux/types';
import { ActionReducer } from 'models';
import { UserBoState } from 'models/user/accountMerchant';
/* eslint-disable no-case-declarations */
const initialState: UserBoState = {
  loading: false,
  userBoInfoArray: [],
  detailUser: {},
};

export default function userReducers(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.SEARCH_USER_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.SEARCH_USER_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        userBoInfoArray: action.payload,
      };
      case types.SEARCH_USER_MERCHANT.DELETE:
        return {
          ...state,
          loading: false,
          userBoInfoArray: [],
        };
    case types.SEARCH_USER_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
      case types.UPDATE_USER.REQUEST:
        return {
          ...state,
          loading: true,
      };
      case types.UPDATE_USER.SUCCESS:
        return {
          ...state,
          loading:  false,
        };
      case types.UPDATE_USER.FAILURE:
        return {
          ...state,
          loading:  false,
        };
    case types.GET_DETAIL_USER.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DETAIL_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        detailUser: action.payload,
      };
    case types.GET_DETAIL_USER.DELETE:
      return {
        ...state,
        detailUser: {},
      };
    default:
      return state;
  }
}
