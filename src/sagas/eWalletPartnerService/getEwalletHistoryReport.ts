import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/ewalletPartnerService';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_EWALLET_HISTORY_REPORT.REQUEST;
}

const SQL_QUERY = `
query getListEwalletHistoryReport($input: GetEwalletHistoryReportInput){
  EWalletSupplier{
    GetEwalletHistoryReport(input: $input){
      total
      count
      amount
      fee
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const historyReport = data?.data?.EWalletSupplier?.GetEwalletHistoryReport;

    if (historyReport?.length) {
      yield put({
        type: types.GET_EWALLET_HISTORY_REPORT.SUCCESS,
        payload: historyReport,
      });
      callback && callback(true, historyReport ?? []);
    } else {
      yield put({
        type: types.GET_EWALLET_HISTORY_REPORT.FAILURE,
      });

      callback && callback(false, historyReport ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_EWALLET_HISTORY_REPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_EWALLET_HISTORY_REPORT.REQUEST, doAction);
}
