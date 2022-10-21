import {  SagaAction } from "models";
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_TOP_MERCHANT_CATEGORY.REQUEST;
}

const SQL_QUERY = `
query getReportMerchantCategory ($input:MerchantFilterInput) {
    ReportMerchant {
      ReportMerchantCategory (input:$input){
        categoryCode
        category
        amount
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const dataTopMerchant = data?.data?.ReportMerchant?.ReportMerchantCategory;
    if (dataTopMerchant) {
      yield put({
        type: types.GET_TOP_MERCHANT_CATEGORY.SUCCESS,
        payload: dataTopMerchant?.data,
      });
      callback && callback(true, dataTopMerchant ?? {});
    } else {
      yield put({
        type: types.GET_TOP_MERCHANT_CATEGORY.FAILURE,
      });

      callback && callback(false, dataTopMerchant);
    }
  } catch (error) {
    console.log('error get processing flow list: ', error);
    yield put({
      type: types.GET_TOP_MERCHANT_CATEGORY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TOP_MERCHANT_CATEGORY.REQUEST, doAction)
}
