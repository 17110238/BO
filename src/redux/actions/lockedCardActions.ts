import { CallbackResponse } from 'models';
import * as types from 'redux/types/lockedCardTypes';
import { CreateCardInput, GetLockedCardsInput, LockCardInput } from 'models/lockedCards/lockedCardsState';

export const getLockedCards = (
  payload: GetLockedCardsInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LOCKED_CARDS.REQUEST,
    payload,
    callback,
  };
};

export const updateLockedCard = (
  payload: LockCardInput,
  callback: CallbackResponse
) => {
  return {
    type: types.UPDATE_LOCKED_CARD.REQUEST,
    payload,
    callback,
  };
};

export const lockedCard = (
  payload: CreateCardInput,
  callback: CallbackResponse
) => {
  return {
    type: types.LOCKED_CARD.REQUEST,
    payload,
    callback,
  };
};