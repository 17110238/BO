import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
  type?: typeof types.GET_CHANGED_INFO_WALLET_ACCOUNT.REQUEST;
}

const SQL_QUERY = `
  query getChangedEwalletAccountInfo($input: GetChangedInfoInput!){
    RequestChange {
      GetChangedEwalletAccountInfo (input: $input) {
        path
        before
        after
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const changedInfo = data?.data?.RequestChange?.GetChangedEwalletAccountInfo;
    if (changedInfo) {
      yield put({
        type: types.GET_CHANGED_INFO_WALLET_ACCOUNT.SUCCESS,
        payload: changedInfo?.data,
      });
      callback && callback(true, changedInfo || {});
    } else {
      yield put({
        type: types.GET_CHANGED_INFO_WALLET_ACCOUNT.FAILURE,
      });

      callback && callback(false, changedInfo || {});
    }
  } catch (error) {
    yield put({
      type: types.GET_CHANGED_INFO_WALLET_ACCOUNT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_CHANGED_INFO_WALLET_ACCOUNT.REQUEST, doAction);
}
