import { MERCHANT_EXPORT } from './../types/merchantExportTypes';
import { BusinessDetailsType } from './../../models/account/merchantState';
import { ActionReducer } from 'models';
import { NotifyState } from 'models/notify';
import * as types from 'redux/types/notifyTypes';

const initialState: NotifyState = {
  loading: false,
  loadingSendSMS: false,
  history: [],
  message: '',
};

export default function notify(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_HISTORY.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_HISTORY.SUCCESS:
      return {
        ...state,
        loading: false,
        history: action.payload,
      };

    case types.GET_HISTORY.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.SEND_SMS.REQUEST:
      return {
        ...state,
        loadingSendSMS: true,
      };

    case types.SEND_SMS.SUCCESS:
      return {
        ...state,
        loadingSendSMS: false,
        message: action.payload,
      };

    case types.SEND_SMS.FAILURE:
      return {
        ...state,
        loadingSendSMS: false,
      };

    default:
      return state;
  }
}
