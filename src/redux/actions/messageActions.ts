import * as types from 'redux/types';

import { CallbackResponse, GetChangedInfoInput } from 'models';
import { requestMessageType, SendMailInput, SendTestMailInput } from 'models/message';

export const requestMessage = (payload: requestMessageType, callback?: CallbackResponse) => {
  return {
    type: types.REQUEST_MESSAGE.REQUEST,
    payload,
    callback,
  };
};

export const requestChangedMessage = (
  payload: GetChangedInfoInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.REQUEST_CHANGED_MESSAGE.REQUEST,
    payload,
    callback,
  };
};

export const sendMail = (payload: SendMailInput, callback?: CallbackResponse) => {
  return {
    type: types.REQUEST_SEND_MAIL.REQUEST,
    payload,
    callback,
  };
};

export const sendTestMailAction = (payload: SendTestMailInput, callback?: CallbackResponse) => {
  return {
    type: types.SEND_TEST_MAIL.REQUEST,
    payload,
    callback,
  };
};
