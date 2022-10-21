import { SagaAction, InputSearchLogStore } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<InputSearchLogStore> {
  type?: typeof types.GET_DELEGATE_STORE.REQUEST;
}

const SQL_QUERY = `
query getDelegateStore($input:GetDelegatesInput!) {
    Store {
      GetDelegates(input:$input){
        accountId
        fullname
        username
        phone
        isAllowCancel
        isActive
        createdAt
        expiryAt
        role
        storeName
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const delegate = data?.data?.Store?.GetDelegates;
    if (delegate) {
      yield put({
        type: types.GET_DELEGATE_STORE.SUCCESS,
        payload: delegate?.data,
      });
      callback && callback(true, delegate ?? {});
    } else {
      yield put({
        type: types.GET_DELEGATE_STORE.FAILURE,
      });

      callback && callback(false, delegate);
    }
  } catch (error) {
    console.log('error get delegate store list: ', error);
    yield put({
      type: types.GET_DELEGATE_STORE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DELEGATE_STORE.REQUEST, doAction);
}
