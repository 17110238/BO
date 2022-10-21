import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';
import { SearchConnectedUserInput, SagaAction } from 'models';

interface SagaSearch extends SagaAction<SearchConnectedUserInput> {
  type?: typeof types.UNLINK_CONNECTED_USER.REQUEST;
}

const SQL_QUERY = `
mutation unlinkConnectedUser($input: SearchUnlinkConnectedUserInput) {
  EwalletAccount{
    UnlinkConnectedUser(input: $input) {
        succeeded
        message
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const list = data?.data?.EwalletAccount?.UnlinkConnectedUser;

    if (list) {
      yield put({
        type: types.UNLINK_CONNECTED_USER.SUCCESS,
        payload: list,
      });
      callback && callback(true, list ?? []);
    } else {
      yield put({
        type: types.UNLINK_CONNECTED_USER.FAILURE,
      });

      callback && callback(false, list);
    }
  } catch (error) {
    yield put({
      type: types.UNLINK_CONNECTED_USER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UNLINK_CONNECTED_USER.REQUEST, doAction);
}
