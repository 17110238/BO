import * as types from 'redux/types';
import { CallbackResponse, GetReportCardTelcoInput } from 'models';

export const getListTelcoByPrice = (
  payload: GetReportCardTelcoInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_TELCO_PRICE.REQUEST,
    payload,
    callback,
  };
};

export const getListTelcoByDate = (
  payload: GetReportCardTelcoInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_TELCO_DATE.REQUEST,
    payload,
    callback,
  };
};
