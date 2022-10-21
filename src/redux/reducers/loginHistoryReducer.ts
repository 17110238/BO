import { ReducerLoginHistory, ActionReducer } from 'models';
import * as types from 'redux/types/loginHistoryTypes';

const initialState: ReducerLoginHistory = {
  loading: false,
  dataLoginHistory: [],
};

const loginHistoryReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.LOGIN_HISTORY_CTT.REQUEST:
      return { ...state, loading: true };
    case types.LOGIN_HISTORY_CTT.SUCCESS:
      return { ...state, loading: false, dataLoginHistory: action.payload };
    case types.LOGIN_HISTORY_CTT.FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default loginHistoryReducer;
