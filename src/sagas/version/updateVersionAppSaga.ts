import { callGraphql } from 'api/graphql';
import { SagaAction, VersionType } from 'models';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<VersionType> {
  type?: string;
}

const SQL_QUERY = `
    mutation updateVersion($input:UpdateVersionInput!){
      Version{
        UpdateVersion(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const versions = data?.data?.Version?.UpdateVersion;

    if (versions?.succeeded) {
      callback && callback(true, versions ?? {});
    } else {
      callback && callback(false, versions);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeEvery(types.UPDATE_VERSION_APP.REQUEST, doAction);
}
