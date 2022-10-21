import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { GetAccountMerchantLogInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<GetAccountMerchantLogInput> {
  type?: typeof types.GET_MERCHANT_CHANGE_HISTORY.REQUEST;
}

const SQL_QUERY = `
  query GetChangeHistory($input: GetAccountMerchantLogInput!) {
    LogSystem {
      GetEwalletAccountLog(input: $input) {
        jsonData
        action
        ip
        userName
        fullName
        internalAccountId
        createdAt
        updatedAt
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.LogSystem?.GetEwalletAccountLog;

    if (result) {
      yield put({
        type: types.GET_MERCHANT_CHANGE_HISTORY.SUCCESS,
        payload: result,
      });
      callback && callback(true, result ?? []);
    } else {
      yield put({
        type: types.GET_MERCHANT_CHANGE_HISTORY.FAILURE,
      });

      callback && callback(false, result ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_MERCHANT_CHANGE_HISTORY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_CHANGE_HISTORY.REQUEST, doAction);
}
