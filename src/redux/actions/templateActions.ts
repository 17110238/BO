import {
  CallbackResponse, CreateEmailTemplateInput, CreateEwalletTemplateInput, GetEmailTemplateInput, GetEwalletTemplateInput, MutationEmailTemplateResponse, UpdateEmailTemplateInput, UpdateEwalletTemplateInput
} from 'models';
import * as types from 'redux/types';

export const getListTemplate = (
  payload: GetEmailTemplateInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_TEMPLATE.REQUEST,
    payload,
    callback,
  };
};

export const createTemplate = (
  payload: CreateEmailTemplateInput,
  callback: CallbackResponse
) => {
  return {
    type: types.CREATE_TEMPLATE.REQUEST,
    payload,
    callback,
  };
};

export const updateTemplate = (
  payload: UpdateEmailTemplateInput,
  callback: CallbackResponse
) => {
  return {
    type: types.UPDATE_TEMPLATE.REQUEST,
    payload,
    callback,
  };
};


// Template E-wallet

export const getListTemplateWallet = (
  payload: GetEwalletTemplateInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_TEMPLATE_WALLET.REQUEST,
    payload,
    callback,
  };
};

export const createTemplateWallet = (
  payload: CreateEwalletTemplateInput,
  callback: CallbackResponse
) => {
  return {
    type: types.CREATE_TEMPLATE_WALLET.REQUEST,
    payload,
    callback,
  };
};

export const updateTemplateWallet = (
  payload: UpdateEwalletTemplateInput,
  callback: CallbackResponse
) => {
  return {
    type: types.UPDATE_TEMPLATE_WALLET.REQUEST,
    payload,
    callback,
  };
};
