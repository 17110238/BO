import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { DeleteScopeBoInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaUpdate extends SagaAction<DeleteScopeBoInput> {
  type?: typeof types.DELETE_MC_SCOPE.REQUEST;
}

const SQL_QUERY = `
mutation deleteMCScope($input: DeleteScopeBoInput!){
    Account{
      DeleteMCScopeBo(input:$input){
        succeeded
        message
      }
    }
  }
`;

function* deleteMCScope({ payload, callback }: SagaUpdate) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const deleteScope = data.data.Account.DeleteMCScopeBo;
    if (deleteScope.succeeded) {
        yield put({
            type: types.DELETE_MC_SCOPE.SUCCESS,
        });
      callback && callback(true, deleteScope);
    } else {
        yield put({
            type: types.DELETE_MC_SCOPE.SUCCESS,
        });
      callback && callback(false, deleteScope);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.DELETE_MC_SCOPE.FAIL,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.DELETE_MC_SCOPE.REQUEST, deleteMCScope);
}
