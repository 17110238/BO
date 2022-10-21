import * as types from 'redux/types';
import { ActionReducer, StoreState } from 'models';

const initialState: StoreState = {
  loading: false,
  storeList: [],
  listLogStore: [],
};

export default function storeReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_STORE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_STORE.SUCCESS:
      return {
        ...state,
        loading: false,
        storeList: action.payload,
      };
    case types.GET_LIST_STORE.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LOG_STORE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LOG_STORE.SUCCESS:
      return {
        ...state,
        loading: false,
        listLogStore: action.payload,
      };
    case types.GET_LOG_STORE.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
