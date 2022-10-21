import { ERROR_401, typeNameAccount } from "../redux.config"

/* eslint-disable no-case-declarations */
const initialState = {
  loading: false
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case types.SHOW_LOADING:
      return { ...state, loading: true };
    case types.HIDE_LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
} 