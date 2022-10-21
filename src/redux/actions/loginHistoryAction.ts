import {
    CallbackResponse
} from 'models';
import * as types from 'redux/types';
export const getListSearchLoginHistory = (payload: any, callback: CallbackResponse) => {
    return {
      type: types.GET_LIST_E_WALLET_HISTORY_LOGIN.REQUEST,
      payload,
      callback,
    };
  };
  