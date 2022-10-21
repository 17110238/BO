import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.REPORT_EWALLET_DAILY.REQUEST;
}

const SQL_QUERY = `
  query GetMerchantTransactionReport($input: ReportEwalletAccountInput) {
    EwalletStateBankReportBo {
      ReportEwalletDaily(input: $input)
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.EwalletStateBankReportBo?.ReportEwalletDaily;

    if (result.length > 2) {
      yield put({
        type: types.REPORT_EWALLET_DAILY.SUCCESS,
        payload: result,
      });
      callback && callback(true, result ?? '');
    } else {
      yield put({
        type: types.REPORT_EWALLET_DAILY.FAILURE,
      });

      callback && callback(false, result ?? '');
    }
  } catch (error) {
    yield put({
      type: types.REPORT_EWALLET_DAILY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REPORT_EWALLET_DAILY.REQUEST, doAction);
}