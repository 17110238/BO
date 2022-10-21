import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { SearchEwalletAccountInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<SearchEwalletAccountInput> {
  type?: typeof types.GET_MERCHANT_SESSIONS.REQUEST;
}

const SQL_QUERY = `
  query GetMerchantSessions ($input: SearchEwalletAccountInput!) {
    EwalletAccount {
      GetSessions (input: $input) {
        message
        succeeded
        data {
          id
          ip
          deviceId
          deviceInfo
          platform
          version
          clientChannel
          loginTime
          logoutTime
          createdAt
          accountId
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.EwalletAccount?.GetSessions;

    if (result?.succeeded) {
      yield put({
        type: types.GET_MERCHANT_SESSIONS.SUCCESS,
        payload: result?.data,
      });
      callback && callback(true, result?.data ?? []);
    } else {
      yield put({
        type: types.GET_MERCHANT_SESSIONS.FAILURE,
      });

      callback && callback(false, result?.data ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_MERCHANT_SESSIONS.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_SESSIONS.REQUEST, doAction);
}
