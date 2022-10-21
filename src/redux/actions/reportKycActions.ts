import * as types from "redux/types";
import { CallbackResponse } from "models";

export const getListReportKYC = (payload: any,callback?: CallbackResponse) => {
    return {
      type: types.GET_LIST_REPORT_KYC.REQUEST,
      callback,
      payload,
    }
}