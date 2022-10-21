import { CallbackResponse, ReportAgentInput, ReportSystemTransactionInput } from 'models';
import * as types from 'redux/types';
export const getlistReportAgent = (payload:ReportAgentInput, callback:CallbackResponse) => {
    return {
        type: types.GET_LIST_REPORT_AGENT.REQUEST,
        payload,
        callback
    }
}
export const getlistReportSystemTransaction = (payload:ReportSystemTransactionInput, callback:CallbackResponse) => {
    return {
        type: types.GET_LIST_REPORT_SYSTEM_TRANSACTION.REQUEST,
        payload,
        callback
    }
}
