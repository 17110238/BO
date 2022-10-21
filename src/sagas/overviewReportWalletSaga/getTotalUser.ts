import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_TOTAL_USER.REQUEST;
}

const SQL_QUERY = `
query GetTotalUser{
  EwalletStateBankReportBo{
    GetTotalUser
    {
      userReg
      userKyc
      userLinked
      userOpen
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const resData = data?.data?.EwalletStateBankReportBo?.GetTotalUser;

    if (Object.keys(resData).length > 0) {
      // yield put({
      //   type: types.GET_TOTAL_USER.SUCCESS,
      //   payload: resData?.data,
      // });
      callback && callback(true, resData ?? {});
    } else {
      // yield put({
      //   type: types.GET_TOTAL_USER.FAILURE,
      // });
      callback && callback(false, resData ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_TOTAL_USER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TOTAL_USER.REQUEST, doAction);
}
