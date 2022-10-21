import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getVersion {
  Version{
    GetAllVersion{
      message
      succeeded
      data{
        id
        clientInfo{
          platform
          versionNotSupported
          versionNewest
        }
        updateTitle
        updateURL
        createdAt
        updatedAt
      }
    }
  }
}
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const versions = data?.data?.Version?.GetAllVersion;

    if (versions?.succeeded) {
      yield put({
        type: types.GET_VERSION_APP.SUCCESS,
        payload: versions?.data,
      });
      callback && callback(true, versions ?? {});
    } else {
      callback && callback(false, versions);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_VERSION_APP.REQUEST, doAction);
}
