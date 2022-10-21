import { CallbackResponse } from 'models';
import { CreateEmailSmsProductInput, GetEmailSmsMerchantInput, GetEmailSmsProductInput, GetHistoryMerchantInput, UpdateEmailSmsProductInput } from 'models/emailSms/emailSms';
import * as types from 'redux/types/emailSmsTypes';

export const getEmailSmsProduct = (payload: GetEmailSmsProductInput , callback: CallbackResponse) => {
  return {
    type: types.EMAIL_SMS_PRODUCT.REQUEST,
    payload,
    callback,
  };
};

export const getEmailSmsMerchant = (payload: GetEmailSmsMerchantInput , callback: CallbackResponse) => {
  return {
    type: types.EMAIL_SMS_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const getEmailSmsHistory = (payload: GetHistoryMerchantInput , callback: CallbackResponse) => {
  return {
    type: types.EMAIL_SMS_HISTORY.REQUEST,
    payload,
    callback,
  };
};

export const createEmailSmsProduct = (payload: CreateEmailSmsProductInput , callback: CallbackResponse) => {
  return {
    type: types.CREATE_EMAIL_SMS_PRODUCT.REQUEST,
    payload,
    callback,
  };
};

export const updateEmailSmsProduct = (payload: UpdateEmailSmsProductInput , callback: CallbackResponse) => {
  return {
    type: types.UPDATE_EMAIL_SMS_PRODUCT.REQUEST,
    payload,
    callback,
  };
};