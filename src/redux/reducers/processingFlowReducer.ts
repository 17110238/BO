import * as types from 'redux/types';
import { ProcessingFlowState, ActionReducer } from 'models';

const initialState: ProcessingFlowState = {
  loading: false,
  loadingModal: false,
  processingFlowArray: [],
  updateProcessingFlowInfo: {},
  createProcessingFlowInfo: {},
}

export default function processingFlow(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_PROCESSING_FLOW.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_PROCESSING_FLOW.SUCCESS:
      return {
        ...state,
        loading: false,
        processingFlowArray: action.payload,
      };
    case types.GET_LIST_PROCESSING_FLOW.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.CREATE_PROCESSING_FLOW.REQUEST:
      return {
        ...state,
        loadingModal: true,
      };
    case types.CREATE_PROCESSING_FLOW.SUCCESS:
      return {
        ...state,
        loadingModal: false,
        createProcessingFlowInfo: action.payload,
      };
    case types.CREATE_PROCESSING_FLOW.FAILURE:
      return {
        ...state,
        loadingModal: false,
      };
    case types.UPDATE_PROCESSING_FLOW.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.UPDATE_PROCESSING_FLOW.SUCCESS:
      return {
        ...state,
        loading: false,
        updateProcessingFlowInfo: action.payload,
      };
    case types.UPDATE_PROCESSING_FLOW.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}