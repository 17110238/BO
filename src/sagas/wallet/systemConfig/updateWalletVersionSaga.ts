import { callGraphql } from 'api/graphql';
import { SagaAction, WalletAppVersionType } from 'models';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<WalletAppVersionType> {
  type?: string;
}

const SQL_QUERY = `
    mutation updateVersion($input:UpdateAppVersionInput!){
      EwalletVersion {
        UpdateAppVersion(input:$input){
          message,
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const versions = data?.data?.EwalletVersion?.UpdateAppVersion;

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
  yield takeEvery(types.UPDATE_WALLET_VERSION.REQUEST, doAction);
}
