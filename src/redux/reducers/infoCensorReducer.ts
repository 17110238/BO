import * as types from 'redux/types';
import { ActionReducer } from 'models';

const initialState: any = {
  loading: false,
  avatarImageInfoArray: [],
};

export default function infoCensorReducer(state = initialState, action: ActionReducer) {
  switch (action.type) {

    case types.GET_LIST_AVATAR_IMAGE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_AVATAR_IMAGE.SUCCESS:
      return {
        ...state,
        loading: false,
        avatarImageInfoArray: action.payload,
      };
    case types.GET_LIST_AVATAR_IMAGE.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.REFUSE_AVATAR_IMAGE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.REFUSE_AVATAR_IMAGE.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.REFUSE_AVATAR_IMAGE.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.UPDATE_ALIASNAME.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.UPDATE_ALIASNAME.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.UPDATE_ALIASNAME.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.REFUSE_ALIASNAME.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.REFUSE_ALIASNAME.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.REFUSE_ALIASNAME.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
