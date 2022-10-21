import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_REPORT_KYC.REQUEST;
}

const SQL_QUERY = `
query getReportKYC($input:ReportKycInput!){
  EwalletReportBo {
    ReportKyc (input:$input){
      data
      {date
      walletKyc
        sumWalletKyc
      }
    }
  }
}
`;

function* getReportKYC({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const reportWallet = data.data.EwalletReportBo.ReportKyc;
    if (reportWallet) {
      yield put({
        type: types.GET_LIST_REPORT_KYC.SUCCESS,
        payload: reportWallet,
      });
      callback && callback(true, reportWallet);
    } else {
      yield put({
        type: types.GET_LIST_REPORT_KYC.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get report wallet saga: ', error);
    yield put({
      type: types.GET_LIST_REPORT_KYC.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_REPORT_KYC.REQUEST, getReportKYC);
}
