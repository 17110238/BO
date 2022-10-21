import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_REPORT_TRANSACTION_CTT.REQUEST;
}

const SQL_QUERY = `
query getReportTransactionCtt($input:createdFilter!) {
  ReportMerchant {
    ReportTransaction(input:$input){
      data{
        month
        successCount
        successAmount
        failAmount
        failCount
      }
      total {
        successCount
        successAmount
        failAmount
        failCount
      }
    }
  }
}
`;

function* getReportTransaction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const reportTransaction = data.data.ReportMerchant.ReportTransaction;
    if (reportTransaction && Object.keys(reportTransaction).length > 0) {
      callback && callback(true, reportTransaction);
    } else {
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get report transaction saga: ', error);
    callback && callback(false, null);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_TRANSACTION_CTT.REQUEST, getReportTransaction);
}
