import { ActionReducer } from 'models';
import * as types from '../types';

const initialState = {
  loading: false,
  listPrice: [],
  listDate: [],
};

const ReportTelcoReducer = (state = initialState, action: ActionReducer) => {
  switch (action.type) {
    case types.GET_TELCO_PRICE.REQUEST:
      return { ...state, loading: true };
    case types.GET_TELCO_PRICE.SUCCESS:
      return { ...state, listPrice: action.payload, loading: false };
    case types.GET_TELCO_PRICE.FAILURE:
      return { ...state, loading: false };
    case types.GET_TELCO_DATE.REQUEST:
      return { ...state, loading: true };
    case types.GET_TELCO_DATE.SUCCESS:
      return { ...state, listDate: action.payload, loading: false };
    case types.GET_TELCO_DATE.FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default ReportTelcoReducer;
