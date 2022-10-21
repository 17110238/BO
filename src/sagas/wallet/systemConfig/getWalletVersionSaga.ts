import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getWalletVersion  {
  EwalletVersion {
    GetAllAppVersion {
      message,
      succeeded,
      data {
        id,
        clientInfo {
          platform,
          versionNotSupported,
          versionNewest
        }
        ,
        updateTitle,
        updateURL,
      }
    }
  }
}
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const {
      data: {
        data: { EwalletVersion },
      },
    } = yield call<any>(callGraphql, SQL_QUERY);

    const results = EwalletVersion.GetAllAppVersion;

    if (results.succeeded) {
      yield put({
        type: types.GET_WALLET_VERSION.SUCCESS,
        payload: results?.data || [],
      });
      callback &&
        callback(
          results.succeeded,
          { data: results?.data || [], message: results?.message || null } ?? {}
        );
    } else {
      yield put({
        type: types.GET_WALLET_VERSION.FAILURE,
        payload: results || [],
      });
      callback && callback(results.succeeded, results || {});
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  } finally {
    yield put({
      type: types.GET_WALLET_VERSION.REFRESH,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_WALLET_VERSION.REQUEST, doAction);
}
