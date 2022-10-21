import {
  CallbackResponse,
  FilterSendMerchantReportCrossCheckInput,
  PayloadDetailMerchantRevenue,
  PayloadSearchMerchantRevenue,
  VersionType,
} from 'models';
import * as types from 'redux/types';

export const getRevenueStatistics = (
  payload: PayloadSearchMerchantRevenue,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_REVENUE_STATISTICS.REQUEST,
    callback,
    payload,
  };
};

export const getDetailRevenueStatistics = (
  payload: PayloadDetailMerchantRevenue,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_DETAIL_REVENUE_STATISTICS.REQUEST,
    callback,
    payload,
  };
};

export const sendMailMerchantReportCrossCheck = (payload: FilterSendMerchantReportCrossCheckInput, callback: CallbackResponse) => {
  return {
    type: types.SEND_MAIL_MERCHANT_REPORT_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
