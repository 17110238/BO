import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaCreate extends SagaAction<any> {
  type?: typeof types.CREATE_SCOPE.REQUEST;
}

const SQL_QUERY = `
mutation deleteScope($input: DeleteScopeBoInput){
    Account{
      DeleteScopeBo(input:$input){
        succeeded
        message
      }
    }
  }
`;

function* DeleteScope({ payload, callback }: SagaCreate) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const deleteData = data.data.Account.DeleteScopeBo;
    if (deleteData.succeeded) {
      callback && callback(true, deleteData);
    } else {
      callback && callback(false, deleteData);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.DELETE_SCOPE.FAIL,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.DELETE_SCOPE.REQUEST, DeleteScope);
}
