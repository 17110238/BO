import * as types from 'redux/types';
import { ActionReducer, StoreState } from 'models';

const initialState = {
  loading: false,
  data: {},
};

export default function dowloadUrlReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.DOWLOAD_URL.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.DOWLOAD_URL.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.DOWLOAD_URL.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
