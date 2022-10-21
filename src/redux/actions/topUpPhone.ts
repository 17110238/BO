import * as types from 'redux/types'
import { CallbackResponse } from "models";
import {FilterGetReportCardTelcoInput} from 'models/topUpPhone'
export const getListTopUpPhone = (payload:FilterGetReportCardTelcoInput, callback:CallbackResponse) => {
    return {
        type: types.GET_TOP_UP_PHONE.REQUEST,
        payload,
        callback
    };
}
export const deleteListTopUpPhone = () => {
    return {
        type: types.GET_TOP_UP_PHONE.DELETE,
       
    };
}
