import { CallbackResponse, ProfileAliasInput, SearchEwalletAccountInput, UpdateEwalletAccountInput } from 'models';
import * as types from 'redux/types';

export const getListAvatarImage = (payload: SearchEwalletAccountInput, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_AVATAR_IMAGE.REQUEST,
    payload,
    callback,
  };
};

export const confirmAvatarImage = (payload: UpdateEwalletAccountInput, callback: CallbackResponse) => {
  return {
    type: types.REFUSE_AVATAR_IMAGE.REQUEST,
    payload,
    callback,
  };
};


export const updateRefundAliasName = (payload: ProfileAliasInput, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_ALIASNAME.REQUEST,
    payload,
    callback,
  };
};

export const confirmAliasName = (payload: ProfileAliasInput, callback: CallbackResponse) => {
  return {
    type: types.REFUSE_ALIASNAME.REQUEST,
    payload,
    callback,
  };
};


