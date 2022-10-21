import * as types from 'redux/types';
import { ActionReducer, VersionReducerType } from 'models';
const initialState: VersionReducerType = {
  versions: [],
};

export default function merchant(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_VERSION_APP.SUCCESS:
      return {
        ...state,
        versions: action.payload,
      };

    default:
      return state;
  }
}
