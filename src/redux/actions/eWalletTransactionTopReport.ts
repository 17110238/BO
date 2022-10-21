import * as types from "redux/types";
import { CallbackResponse ,typeGetTopTransactionByDateInput,typeGetTopTransactionByAccountInput} from "models";

export const getTopTransactionReportDate =(payload:typeGetTopTransactionByDateInput,callback:CallbackResponse)=>{
    return{
        type:types.GET_TOP_TRANSACTION_BY_DATE.REQUEST,
        payload,
        callback
    }
}
export const deleteTopTransaction =()=>{
    return{
        type:types.GET_TOP_TRANSACTION_BY_DATE.DELETE,
      
    }
}
export const getTopTransactionReportAccount =(payload:typeGetTopTransactionByDateInput,callback:CallbackResponse)=>{
    return{
        type:types.GET_TOP_TRANSACTION_BY_ACCOUNT.REQUEST,
        payload,
        callback
    }
}
export const getTopTransactionReportAccountAmount =(payload:typeGetTopTransactionByDateInput,callback:CallbackResponse)=>{
    return{
        type:types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.REQUEST,
        payload,
        callback
    }
}