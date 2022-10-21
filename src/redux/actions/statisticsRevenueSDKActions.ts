import { CallbackResponse, SearchRevenuePayload } from 'models';
import * as types from 'redux/types';

export const getRevenueStatisticsSDK = (
  payload: SearchRevenuePayload,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_REVENUE_STATISTICS_SDK.REQUEST,
    callback,
    payload,
  };
};
