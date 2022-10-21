import { ActionReducer, initialStateManualBank } from 'models';
import * as types from '../types/manualBankTypes';

const initialState: initialStateManualBank = {
  loading: false,
  listBank: [],
  listAccountBank: [],
  listManualDeposit: [],
  manualBank: {
    data: [],
    total: undefined,
  },
};

const manualBankReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_LIST_BANK.REQUEST:
      return { ...state, loading: true };
    case types.GET_LIST_BANK.SUCCESS:
      return { ...state, loading: false, listBank: action.payload };
    case types.GET_LIST_BANK.FAILURE:
      return { ...state, loading: false };
    case types.GET_LIST_ACCOUNT_BANK.REQUEST:
      return { ...state, loading: true };
    case types.GET_LIST_ACCOUNT_BANK.SUCCESS:
      return { ...state, loading: false, listAccountBank: action.payload };
    case types.GET_LIST_ACCOUNT_BANK.FAILURE:
      return { ...state, loading: false };
    case types.GET_LIST_MANUAL_BANK.REQUEST:
      return { ...state, loading: true };
    case types.GET_LIST_MANUAL_BANK.SUCCESS:
      return { ...state, loading: false, manualBank: action.payload };
    case types.GET_LIST_MANUAL_BANK.FAILURE:
      return { ...state, loading: false };

    case types.GET_LIST_MANUAL_BANK_DEPOSIT.REQUEST:
      return {
         ...state, loading: true 
        };
    case types.GET_LIST_MANUAL_BANK_DEPOSIT.SUCCESS:
      return { 
        ...state, loading: false, 
        listManualDeposit: action.payload 
      };
    case types.GET_LIST_MANUAL_BANK_DEPOSIT.FAILURE:
      return { 
        ...state, loading: false
       };

    case types.CREATE_DEPOSIT_BANK.REQUEST:
      return {
        ...state, loading: true 
        };
    case types.CREATE_DEPOSIT_BANK.SUCCESS:
      return { 
        ...state, loading: false, 
      };
    case types.CREATE_DEPOSIT_BANK.FAILURE:
      return { 
        ...state, loading: false
      };

      case types.UPDATE_BANK_PAYMENT.REQUEST:
        return {
          ...state, loading: true 
          };
      case types.UPDATE_BANK_PAYMENT.SUCCESS:
        return { 
          ...state, loading: false, 
        };
      case types.UPDATE_BANK_PAYMENT.FAILURE:
        return { 
          ...state, loading: false
        };

    default:
      return state;
  }
};
export default manualBankReducer;
