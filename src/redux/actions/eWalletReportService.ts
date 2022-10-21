import { CallbackResponse } from 'models';
import { ReportCustomerInput } from 'models/eWalletReportService';
import * as types from 'redux/types';

export const getReportCustomer = (payload: ReportCustomerInput , callback: CallbackResponse) => {
  return {
    type: types.GET_REPORT_CUSTOMER.REQUEST,
    payload,
    callback,
  };
};
