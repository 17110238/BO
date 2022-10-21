import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.ACCOUNT_MANAGE_EXPORT.REQUEST;
}
const SQL_QUERY = '';
function* exportFileAccount({ payload, callback }: SagaExport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    //handle data later
    if (data?.data) {
      yield put({
        type: types.ACCOUNT_MANAGE_EXPORT.SUCCESS,
        payload: data?.data,
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.ACCOUNT_MANAGE_EXPORT.FAILURE,
      });

      callback && callback(false, data ?? {});
    }
  } catch (error) {
    console.log('error GETAcount saga: ', error);
    yield put({
      type: types.ACCOUNT_MANAGE_EXPORT.FAILURE,
      payload: error,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.ACCOUNT_MANAGE_EXPORT.REQUEST, exportFileAccount);
}
