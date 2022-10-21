import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_INFO_KYC_REPORT_WALLET.REQUEST;
}

const SQL_QUERY = `
query getKycReportWallet {
    EwalletStateBankReportBo {
      GetTotalUser {
        userReg
        userKyc
        userLinked
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const dataKyc = data.data.EwalletStateBankReportBo?.GetTotalUser;
    if (dataKyc && Object.keys(dataKyc).length > 0) {
      yield put({
        type: types.GET_INFO_KYC_REPORT_WALLET.SUCCESS,
        payload: dataKyc,
      });
      callback && callback(true, dataKyc);
    } else {
      yield put({
        type: types.GET_INFO_KYC_REPORT_WALLET.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get dataKyc report wallet saga: ', error);
    yield put({
      type: types.GET_INFO_KYC_REPORT_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_INFO_KYC_REPORT_WALLET.REQUEST, doAction);
}
