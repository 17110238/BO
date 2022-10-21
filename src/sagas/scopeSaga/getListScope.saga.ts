import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/scopeTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_SCOPE.REQUEST;
}

const SQL_QUERY = `
    query getScopes($input:GetListScopeInput){
    Account{
      GetListScope(input:$input){
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
    const listScope = data.data.Account.GetListScope;
    if (Array.isArray(listScope) && listScope.length > 0) {
      callback && callback(true, listScope);
      return;
    } else {
      callback && callback(false, null);
      return;
    }
  } catch (error) {
    callback && callback(false, null);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_SCOPE.REQUEST, getListScope);
}
