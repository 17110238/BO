import { LoanPackageReducerTypes } from 'models';
import { ActionReducer } from 'models';
import * as types from '../types';

const initialState: LoanPackageReducerTypes = {
  loading: false,
  listData: [],
};

const loanPackageReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_WALLET_LOAN_PACKAGE.REQUEST:
      return { ...state, loading: true };
    case types.GET_WALLET_LOAN_PACKAGE.SUCCESS:
      return { ...state, listData: action.payload, loading: false };
    case types.GET_WALLET_LOAN_PACKAGE.FAILURE:
      return { ...state, loading: false };
    case types.UPDATE_WALLET_LOAN_PACKAGE.REQUEST:
      return { ...state, loading: true };
    case types.UPDATE_WALLET_LOAN_PACKAGE.SUCCESS:
      return { ...state, loading: false };
    case types.UPDATE_WALLET_LOAN_PACKAGE.FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default loanPackageReducer;
