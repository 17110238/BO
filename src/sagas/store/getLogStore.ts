import { SagaAction, InputSearchLogStore } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<InputSearchLogStore> {
  type?: typeof types.GET_LOG_STORE.REQUEST;
}

const SQL_QUERY = `
    query getLogStore($input:GetAccountMerchantLogInput!) {
        LogSystem {
            GetStoreLog(input:$input){
                succeeded
                message
                data {
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
    }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const stores = data?.data?.LogSystem?.GetStoreLog;
    if (stores) {
      yield put({
        type: types.GET_LOG_STORE.SUCCESS,
        payload: stores?.data,
      });
      callback && callback(true, stores ?? {});
    } else {
      yield put({
        type: types.GET_LOG_STORE.FAILURE,
      });

      callback && callback(false, stores);
    }
  } catch (error) {
    console.log('error get store list: ', error);
    yield put({
      type: types.GET_LOG_STORE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LOG_STORE.REQUEST, doAction);
}
