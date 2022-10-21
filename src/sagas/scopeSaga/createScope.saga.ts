import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaCreate extends SagaAction<any> {
  type?: typeof types.CREATE_SCOPE.REQUEST;
}

const SQL_QUERY = `
mutation createScope($input: CreateScopeInput){
    Account{
      CreateScope(input:$input){
        succeeded
        message
      }
    }
  }
`;

function* CreateScope({ payload, callback }: SagaCreate) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const createScopeData = data.data.Account.CreateScope;
    if (createScopeData.succeeded) {
      callback && callback(true, createScopeData);
    } else {
      callback && callback(false, createScopeData);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.GET_SCOPE.FAIL,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CREATE_SCOPE.REQUEST, CreateScope);
}
