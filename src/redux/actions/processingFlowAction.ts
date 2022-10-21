import * as types from 'redux/types';
import {
  GetProcessingFlowsInput,
  UpdateProcessingFlowInput,
  CreateProcessingFlowInput,
  CallbackResponse
} from 'models';

export const getListProcessingFlow = (
  payload: GetProcessingFlowsInput,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_LIST_PROCESSING_FLOW.REQUEST,
    payload,
    callback,
  };
};

export const createProcessingFlow = (
  payload: CreateProcessingFlowInput,
  callback: CallbackResponse
) => {
  return {
    type: types.CREATE_PROCESSING_FLOW.REQUEST,
    payload,
    callback,
  };
};

export const updateProcessingFlow = (
  payload: UpdateProcessingFlowInput,
  callback: CallbackResponse
) => {
  return {
    type: types.UPDATE_PROCESSING_FLOW.REQUEST,
    payload,
    callback,
  };
};