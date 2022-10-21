import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { UpdateScopeMCInput } from 'models/scope';

interface SagaUpdate extends SagaAction<UpdateScopeMCInput> {
    type?: typeof types.UPDATE_MC_SCOPE.REQUEST;
}

const SQL_QUERY = `
mutation updateMCScopeBo($input: UpdateScopeMCInput!){
    Account{
      UpdateMCScopeBo(input:$input){
        succeeded
        message
      }
    }
  }
`;

function* updateMCScope({ payload, callback }: SagaUpdate) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload },
        });
        const updateMCScope = data.data.Account.UpdateMCScopeBo;
        if (updateMCScope.succeeded) {
            callback && callback(true, updateMCScope);
        } else {
            callback && callback(false, updateMCScope);
        }
    } catch (error) {
        console.log('error get list role saga: ', error);
        yield put({
            type: types.UPDATE_MC_SCOPE.FAIL,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UPDATE_MC_SCOPE.REQUEST, updateMCScope);
}
