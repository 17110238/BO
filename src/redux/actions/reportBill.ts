import * as types from "redux/types";
import { CallbackResponse } from "models";

export const getListReportBill = (payload: any) => {
    return {
      type: types.GET_LIST_REPORT_BILL.REQUEST,
      payload,
    }
}
export const getListReportTop = (payload: any,callback:CallbackResponse) => {
  return {
    type: types.GET_LIST_REPORT_TOP.REQUEST,
    payload,
    callback
  }
}
export const deleteListReportBill = () => {
  return {
    type: types.GET_LIST_REPORT_BILL.DELETE,
    
  }
}