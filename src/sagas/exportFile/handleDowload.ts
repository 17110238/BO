import { callGraphql, callGraphqlExport } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import apiPGServiceClient from 'api/lib/apiPGServiceClient_bk_nouse';

import FileSaver, { saveAs } from 'file-saver';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.DOWLOAD_URL.REQUEST;
}

function* dowloadUrlAPI({ payload, callback }: SagaExport) {
  try {
    const { data } = yield call<any>(
      apiPGServiceClient.callAPIExport,
      'POST',
      payload,
      '/sys/export'
    );
    // handle data later
    if (!data?.successed) {
      yield put({
        type: types.DOWLOAD_URL.SUCCESS,
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.DOWLOAD_URL.FAILURE,
      });

      callback && callback(false, data ?? {});
    }
  } catch (error) {
    console.log('error GETAcount saga: ', error);
    yield put({
      type: types.DOWLOAD_URL.FAILURE,
      payload: error,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.DOWLOAD_URL.REQUEST, dowloadUrlAPI);
}
