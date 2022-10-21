import {  SagaAction } from "models";
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_DATA_REPORT_MC_AMOUNT.REQUEST;
}

const SQL_QUERY = `
query getReportMechantsAmount($input: ReportMerchantAmountInput) {
  ReportMerchant {
    ReportMerchantAmount(input:$input) {
        total {
            key
            total
            pendingAmount
            activeAmount
            approvedAmount
          }
          data{
            key
            total
            pendingAmount
            approvedAmount
            activeAmount
          }
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const dataQuantityMCAmount = data?.data?.ReportMerchant?.ReportMerchantAmount;
    if (dataQuantityMCAmount) {
      yield put({
        type: types.GET_DATA_REPORT_MC_AMOUNT.SUCCESS,
        payload: {...payload},
      });
      callback && callback(true, dataQuantityMCAmount ?? {});
    } else {
      yield put({
        type: types.GET_DATA_REPORT_MC_AMOUNT.FAILURE,
      });

      callback && callback(false, dataQuantityMCAmount);
    }
  } catch (error) {
    console.log('error get processing flow list: ', error);
    yield put({
      type: types.GET_DATA_REPORT_MC_AMOUNT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DATA_REPORT_MC_AMOUNT.REQUEST, doAction)
}
