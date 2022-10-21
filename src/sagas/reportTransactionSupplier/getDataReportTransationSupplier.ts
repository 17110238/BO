import { filter } from 'rxjs';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.REQUEST;
}

const SQL_QUERY = `
query getPayments($input: CountMessageInput!) {
  ReportMerchant{
   CountMessage(input: $input) {
       mobifone
      vinaphone
      viettel
      vietnammobile
      gmobile
      total
      itelecom
      sfone
   }
  }
}
`;

function* getReportTransactionSuplier({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload.filter },
    });
    const reportSupplier = data.data.ReportMerchant.CountMessage;
    if (reportSupplier) {
      yield put({
        type: types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.SUCCESS,
        payload: reportSupplier,
      });
      callback && callback(true, reportSupplier);
    } else {
      yield put({
        type: types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get report wallet saga: ', error);
    yield put({
      type: types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DATA_REPORT_TRANSACTION_SUPPLIER.REQUEST, getReportTransactionSuplier);
}
