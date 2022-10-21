import {  SagaAction } from "models";
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_DATA_QUANTITY_MERCHANT.REQUEST;
}

const SQL_QUERY = `
query getMechants($input: GetMerchantsInput) {
  ReportMerchant {
    GetMerchants(input:$input) {
      id
      title
      operator
      phone
      merchantType
      category
      approvedAt
      createdAt
      updatedAt
      state
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const dataQuantityMerchant = data?.data?.ReportMerchant?.GetMerchants;
    if (dataQuantityMerchant) {
      yield put({
        type: types.GET_DATA_QUANTITY_MERCHANT.SUCCESS,
        payload: dataQuantityMerchant?.data,
      });
      callback && callback(true, dataQuantityMerchant ?? {});
    } else {
      yield put({
        type: types.GET_DATA_QUANTITY_MERCHANT.FAILURE,
      });

      callback && callback(false, dataQuantityMerchant);
    }
  } catch (error) {
    console.log('error get processing flow list: ', error);
    yield put({
      type: types.GET_DATA_QUANTITY_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DATA_QUANTITY_MERCHANT.REQUEST, doAction)
}
