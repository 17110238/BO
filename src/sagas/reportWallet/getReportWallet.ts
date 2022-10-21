import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_REPORT_WALLET.REQUEST;
}

const SQL_QUERY = `
    query getReportWallet($input:ReportPoboOrderInput!) {
        EwalletStateBankReportBo {
            ReportAccountAmount(input:$input){
                month
                total
                kycAmount
                activeAccountAmount
            }
        }
    }
`;

function* getReportWallet({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const reportWallet = data.data.EwalletStateBankReportBo.ReportAccountAmount;
    if (Array.isArray(reportWallet)) {
      yield put({
        type: types.GET_REPORT_WALLET.SUCCESS,
        payload: reportWallet,
      });
      callback && callback(true, reportWallet);
    } else {
      yield put({
        type: types.GET_REPORT_WALLET.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get report wallet saga: ', error);
    yield put({
      type: types.GET_REPORT_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_WALLET.REQUEST, getReportWallet);
}
