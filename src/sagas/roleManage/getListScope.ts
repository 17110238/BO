import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/roleManageTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_SCOPE.REQUEST;
}

const SQL_QUERY = `
  query getListScope($input:GetListScopeInput) {
    Account {
      GetListScope(input:$input){
        id
        scope
        description
      }
    }
  }
`;

// `
//   query getListScope($input:GetListScopeInput) {
//     Account {
//       GetListScope(input:$input){
//         id
//         service
//         scope
//         description
//         group
//       }
//     }
//   }
// `

function* getListScope({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const listScope = data.data.Account.GetListScope;
    if (Array.isArray(listScope) && listScope.length > 0) {
      yield put({
        type: types.GET_LIST_SCOPE.SUCCESS,
        payload: listScope,
      });
      callback && callback(true, listScope);
    } else {
      yield put({
        type: types.GET_LIST_SCOPE.FAILURE,
      });
      callback && callback(true, null);
    }
  } catch (error) {
    console.log('error get list scope saga: ', error);
    yield put({
      type: types.GET_LIST_SCOPE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_SCOPE.REQUEST, getListScope);
}
