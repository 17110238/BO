import { callGraphql } from 'api/graphql';
import { FormUpdateStore, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<FormUpdateStore> {
  type?: typeof types.UPDATE_STORE.REQUEST;
}

const SQL_QUERY = `
    mutation UpdateStoreMutation($input:UpdateStoreInput!) {
        Store {
            UpdateStore(input:$input){
                message
                succeeded
            }
        }
    } 
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const updated = data?.data?.Store?.UpdateStore;
    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_STORE.SUCCESS,
        payload: updated?.message,
      });
      callback && callback(true, updated);
    } else {
      yield put({
        type: types.UPDATE_STORE.FAILURE,
      });
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.UPDATE_STORE.FAILURE,
    });
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_STORE.REQUEST, doAction);
}
