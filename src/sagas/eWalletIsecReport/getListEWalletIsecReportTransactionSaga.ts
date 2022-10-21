import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getListEwalletIsecReportTransaction($input: ReportIsecBulkEwalletIsecReportInput!) {
    EwalletIsecReportBo{
      ReportIsecBulk(input: $input){
        id
        accountId
        destinationAccountId
        bulkId
        gateTransactionId
        createdAt
        amount
        quantity
        state
        totalAmount
        phone
      }
    }
}
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const list = data?.data?.EwalletIsecReportBo?.ReportIsecBulk;

    if (list?.length) {
      yield delay(500);
      callback && callback(true, list ?? {});
    } else {
      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_EWALLET_ISEC_REPORT_TRANSACTION.REQUEST, doAction);
}
