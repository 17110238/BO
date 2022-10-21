import { ActionReducer } from 'models';
import { LockedCardState } from 'models/lockedCards/lockedCardsState';
import * as types from 'redux/types/lockedCardTypes';

const initialState: LockedCardState = {
  loading: false,
  loadingUpdate: false,
  lockedCards: [],
};

export default function lockedCards(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LOCKED_CARDS.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_LOCKED_CARDS.SUCCESS:
      return {
        ...state,
        loading: false,
        lockedCards: action.payload,
      };

    case types.GET_LOCKED_CARDS.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.UPDATE_LOCKED_CARD.REQUEST:
      return {
        ...state,
        loadingUpdate: true,
      };

    case types.UPDATE_LOCKED_CARD.SUCCESS:
      return {
        ...state,
        loadingUpdate: false,
        message: action.payload,
      };

    case types.UPDATE_LOCKED_CARD.FAILURE:
      return {
        ...state,
        loadingUpdate: false,
        message: action.payload,
      };

    default:
      return state;
  }
}
