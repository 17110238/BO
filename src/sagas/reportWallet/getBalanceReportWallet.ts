import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_BALANCE_REPORT_WALLET.REQUEST;
}

const SQL_QUERY = `
query getBalance {
    EwalletStateBankReportBo {
      GetBalance {
        balance
        balanceOpen
        balanceLock
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const balance = data.data.EwalletStateBankReportBo?.GetBalance;
    if (balance && Object.keys(balance).length > 0) {
      yield put({
        type: types.GET_BALANCE_REPORT_WALLET.SUCCESS,
        payload: balance,
      });
      callback && callback(true, balance);
    } else {
      yield put({
        type: types.GET_BALANCE_REPORT_WALLET.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get balance report wallet saga: ', error);
    yield put({
      type: types.GET_BALANCE_REPORT_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_BALANCE_REPORT_WALLET.REQUEST, doAction);
}
