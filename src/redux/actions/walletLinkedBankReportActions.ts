import { CallbackResponse, GetReportLinkedBankPayLoad } from 'models';
import * as types from 'redux/types';

export const getWalletLinkedBankReport = (
  payload: GetReportLinkedBankPayLoad,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LINKED_BANK_LIST.REQUEST,
    payload,
    callback,
  };
};
