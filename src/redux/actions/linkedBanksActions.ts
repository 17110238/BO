import { CallbackResponse } from 'models';
import { getLinkedBanksInput, LinkedBanksType, unlinkBankInput } from 'models/linkedBanks';
import * as types from 'redux/types';

export const getLinkedBanksAction = (payload: getLinkedBanksInput, callback: CallbackResponse) => {
  return {
    type: types.GET_LINKED_BANKS.REQUEST,
    payload,
    callback,
  };
};
export const unlinkBankAction = (payload: unlinkBankInput, callback: CallbackResponse) => {
  return {
    type: types.UNLINK_BANK.REQUEST,
    payload,
    callback,
  };
};
