import { CallbackResponse } from 'models';
import { getLogsInterface } from 'models/alertlogs/getLogs';
import * as types from '../types';

export const getAlertLogsAction = (payload: getLogsInterface, callback: CallbackResponse) => {
  return {
    type: types.ALERT_LOGS.REQUEST,
    payload,
    callback,
  };
};
