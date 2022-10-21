import { CallbackResponse } from 'models';
import { UpdateNotificationCustomer } from 'models/notificationCustomer/updateNotificationCustomer';
import * as types from 'redux/types/notificationCustomerTypes';

export const updateNotificationCustomer = (
  payload: UpdateNotificationCustomer,
  callback: CallbackResponse
) => {
  return {
    type: types.UPDATE_NOTIFICATION_CUSTOMER.REQUEST,
    payload,
    callback,
  };
};
