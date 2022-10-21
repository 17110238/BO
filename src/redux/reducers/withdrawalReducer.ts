import * as types from 'redux/types';
import { ActionReducer } from 'models';

const initialState: any = {
  loading: false,
  loadingChange: false,
  withdrawInfoArray: [],
  changewithdrawInfo: {}
};

export default function withdrawalReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_WITHDRAW.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_WITHDRAW.SUCCESS:
      return {
        ...state,
        loading: false,
        withdrawInfoArray: action.payload,
      };
    case types.GET_LIST_WITHDRAW.FAILURE:
      return {
        ...state,
        loading: false,
        withdrawInfoArray: action.payload,
      };
    case types.CHANGE_WITHDRAW.REQUEST:
      return {
        ...state,
        loadingChange: true,
      };
    case types.CHANGE_WITHDRAW.SUCCESS:
      return {
        ...state,
        loadingChange: false,
        changewithdrawInfo: action.payload,
      };
    case types.CHANGE_WITHDRAW.FAILURE:
      return {
        ...state,
        loadingChange: false,
        changewithdrawInfo: action.payload,
      };
    default:
      return state;
  }
}
