import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_DATA_NATIONAL.REQUEST;
}

const SQL_QUERY = `query {
    Utility {
      GetNationality {
        data {
          name
          value
        }
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const national = data?.data?.Utility?.GetNationality;

    if (national?.data.length) {
      yield put({
        type: types.GET_DATA_NATIONAL.SUCCESS,
        payload: national?.data,
      });
      callback && callback(true, national.data ?? {});
    } else {
      yield put({
        type: types.GET_DATA_NATIONAL.FAILURE,
      });

      callback && callback(false, national);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    yield put({
      type: types.GET_DATA_NATIONAL.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeEvery(types.GET_DATA_NATIONAL.REQUEST, doAction);
}
