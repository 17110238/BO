import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { CreateScopeMCInput } from 'models/scope';

interface SagaCreate extends SagaAction<CreateScopeMCInput> {
    type?: typeof types.CREATE_MC_SCOPE.REQUEST;
}

const SQL_QUERY = `
mutation createMCScopeBo($input: CreateScopeMCInput!){
    Account{
        CreateMCScopeBo(input:$input){
        succeeded
        message
      }
    }
  }
`;

function* createMCScope({ payload, callback }: SagaCreate) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload },
        });
        const createMCScope = data.data.Account.CreateMCScopeBo;
        if (createMCScope.succeeded) {
            callback && callback(true, createMCScope);
        } else {
            callback && callback(false, createMCScope);
        }
    } catch (error) {
        console.log('error get list role saga: ', error);
        yield put({
            type: types.CREATE_MC_SCOPE.FAIL,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.CREATE_MC_SCOPE.REQUEST, createMCScope);
}
