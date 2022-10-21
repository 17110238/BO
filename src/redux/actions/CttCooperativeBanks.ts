import { CallbackResponse } from 'models';
import * as types from 'redux/types';
export const getCttCoopBankListAction = (callback?: CallbackResponse) => {
  return {
    type: types.GET_CTT_COOPBANK_LIST.REQUEST,
    callback,
  };
};


export const createCttCoopBankAction = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.ADD_CTT_COOPBANK.REQUEST,
    callback,
    payload,
  };
};

export const updateCttCoopBankAction = (payload: any, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_CTT_COOPBANK.REQUEST,
    callback,
    payload,
  };
};
