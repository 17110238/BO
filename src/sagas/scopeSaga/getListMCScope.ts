import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { GetListMCScopeInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<GetListMCScopeInput> {
  type?: typeof types.GET_LIST_MC_SCOPE.REQUEST;
}

const SQL_QUERY = `
    query GetListMCScope($input:GetListMCScopeInput){
    Account{
      GetListMCScope(input:$input){
        id
        service
        scope
        description
        group
      }
    }
  }
`;

function* getListScope({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const listScope = data.data.Account.GetListMCScope;
    if (Array.isArray(listScope)) {
      callback?.(true, listScope);
    }
    else {
      callback?.(false, []);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    callback?.(false, {message: 'Lỗi kết nối Server!'});
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_MC_SCOPE.REQUEST, getListScope);
}
