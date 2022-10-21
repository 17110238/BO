import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/eWalletReportTransactionTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_REPORT_TRANSACTION.REQUEST;
}

const SQL_QUERY = `
    query getHistoryTransaction($input:ReportEwalletHistoryInput!) {
        EwalletStateBankReportBo {
            ReportEwalletHistory(input:$input){
                data {
                    month
                    successCount
                    successAmount
                    failCount
                    failAmount
                    paymentCount
                    paymentAmount
                    depositCount
                    depositAmount
                    withdrawCount
                    withdrawAmount
                }
                total {
                    successCount
                    successAmount
                    failCount
                    failAmount
                    paymentCount
                    paymentAmount
                    depositCount
                    depositAmount
                    withdrawCount
                    withdrawAmount
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
    const reportTransaction = data.data.EwalletStateBankReportBo.ReportEwalletHistory;
    if (reportTransaction && Object.keys(reportTransaction).length > 0) {
      yield put({
        type: types.GET_REPORT_TRANSACTION.SUCCESS,
        payload: reportTransaction,
      });
      callback && callback(true, reportTransaction);
    } else {
      yield put({
        type: types.GET_REPORT_TRANSACTION.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get report transaction saga: ', error);
    yield put({
      type: types.GET_REPORT_TRANSACTION.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_TRANSACTION.REQUEST, getReportTransaction);
}
