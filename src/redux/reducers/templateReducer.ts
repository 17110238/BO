import * as types from 'redux/types';
import { ActionReducer, TemplateState } from 'models';

const initialState: TemplateState = {
  loading: false,
  templateList: [],
  templateListWallet: [],
};

export default function template(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.GET_LIST_TEMPLATE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_TEMPLATE.SUCCESS:
      return {
        ...state,
        loading: false,
        templateList: action.payload,
      };
    case types.GET_LIST_TEMPLATE.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_LIST_TEMPLATE_WALLET.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_LIST_TEMPLATE_WALLET.SUCCESS:
      return {
        ...state,
        loading: false,
        templateListWallet: action.payload,
      };
    case types.GET_LIST_TEMPLATE_WALLET.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
