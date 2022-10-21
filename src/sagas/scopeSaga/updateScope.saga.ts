import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaUpdate extends SagaAction<any> {
  type?: typeof types.UPDATE_SCOPE.REQUEST;
}

const SQL_QUERY = `
mutation updateScope($input: UpdateScopeInput){
    Account{
      UpdateScope(input:$input){
        succeeded
        message
      }
    }
  }
`;

function* UpdateScope({ payload, callback }: SagaUpdate) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const updateData = data.data.Account.UpdateScope;
    if (updateData.succeeded) {
      callback && callback(true, updateData);
    } else {
      callback && callback(false, updateData);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.GET_SCOPE.FAIL,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_SCOPE.REQUEST, UpdateScope);
}
