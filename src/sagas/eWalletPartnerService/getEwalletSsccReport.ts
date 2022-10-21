import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/ewalletPartnerService';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_EWALLET_SSCC_REPORT.REQUEST;
}

const SQL_QUERY = `
query getListEwalletSsccReport($input: GetEwalletSsccReportInput!){
  EWalletSupplier{
    GetEwalletSsccReport(input: $input){
      data {
        count
        amount
        fee
        total
      }
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const ssccReport = data?.data?.EWalletSupplier?.GetEwalletSsccReport?.data;


    if (ssccReport?.length) {
      yield put({
        type: types.GET_EWALLET_SSCC_REPORT.SUCCESS,
        payload: ssccReport,
      });
      callback && callback(true, ssccReport ?? []);
    } else {
      yield put({
        type: types.GET_EWALLET_SSCC_REPORT.FAILURE,
      });
      callback && callback(false, ssccReport ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_EWALLET_SSCC_REPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_EWALLET_SSCC_REPORT.REQUEST, doAction);
}
