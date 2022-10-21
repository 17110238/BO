import * as types from 'redux/types';
import { CallbackResponse } from 'models';
/* ----------------------------------- Login - Logout API GROUP ------------------------------------- */
export const handleDowloadSaga = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.DOWLOAD_URL.REQUEST,
    payload,
    callback,
  };
};
export const exportFileFailure = () => {
  return {
    type: types.DOWLOAD_URL.FAILURE,
  };
};
