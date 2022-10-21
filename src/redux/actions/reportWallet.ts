import { CallbackResponse, SearchReportWallet } from 'models';
import * as types from '../types';

export const getReportWallet = (payload: SearchReportWallet, callback: CallbackResponse) => {
  return {
    type: types.GET_REPORT_WALLET.REQUEST,
    payload,
    callback,
  };
};
