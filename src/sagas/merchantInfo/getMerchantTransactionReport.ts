import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { ReportEwalletAccountInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<ReportEwalletAccountInput> {
  type?: typeof types.GET_MERCHANT_TRANSACTION_REPORT.REQUEST;
}

const SQL_QUERY = `
  query GetMerchantTransactionReport($input: ReportEwalletAccountInput) {
    EwalletAccount {
      Report(input: $input)
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.EwalletAccount?.Report;

    if (result.length > 2) {
      yield put({
        type: types.GET_MERCHANT_TRANSACTION_REPORT.SUCCESS,
        payload: result,
      });
      callback && callback(true, result ?? '');
    } else {
      yield put({
        type: types.GET_MERCHANT_TRANSACTION_REPORT.FAILURE,
      });

      callback && callback(false, result ?? '');
    }
  } catch (error) {
    yield put({
      type: types.GET_MERCHANT_TRANSACTION_REPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_TRANSACTION_REPORT.REQUEST, doAction);
}
