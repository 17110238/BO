import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_OVERVIEW_REPORT_WALLET.REQUEST;
}

const SQL_QUERY = `
query GetDataOverviewReportWallet{
  EwalletStateBankReportBo{
    GetBalance
    {
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
    const resData = data?.data?.EwalletStateBankReportBo?.GetBalance;

    if (Object.keys(resData).length > 0) {
      // yield put({
      //   type: types.GET_OVERVIEW_REPORT_WALLET.SUCCESS,
      //   payload: resData?.data,
      // });
      callback && callback(true, resData ?? {});
    } else {
      // yield put({
      //   type: types.GET_OVERVIEW_REPORT_WALLET.FAILURE,
      // });
      callback && callback(false, resData ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_OVERVIEW_REPORT_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_OVERVIEW_REPORT_WALLET.REQUEST, doAction);
}
