import * as types from "redux/types";
import { CallbackResponse } from "models";


export const getListWordFillter = (payload: any, callback: CallbackResponse) => {
    return {
        type: types.GET_LIST_EWALLET_WORD_FILLTER.REQUEST,
        payload,
        callback
    }
    
}

export const createWordFillter = (payload: any, callback:CallbackResponse) => {
    return {
        type: types.CREATE_EWALLET_WORD_FILLTER.REQUEST,
        payload,
        callback
    }
}

export const updateWordFillter = (payload: any, callback:CallbackResponse) => {
    return {
        type: types.UPDATE_EWALLET_WORD_FILLTER.REQUEST,
        payload,
        callback
    }
}