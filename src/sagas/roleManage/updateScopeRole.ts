import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/roleManageTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { payloadUpdateScopeRole } from 'models/role/listRole';

interface SagaSearch extends SagaAction<payloadUpdateScopeRole> {
  type?: typeof types.UPDATE_SCOPE_ROLE.REQUEST;
}

const SQL_QUERY = `
  mutation updateScope($input:AddRemoveScopeRoleInput){
    Account {
      AddRemoveScopeRole(input:$input){
        message
        succeeded
      }
    }
  }
`;

function* updateScopeRole({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const roleUpdateScope = data.data.Account.AddRemoveScopeRole;
    if (roleUpdateScope.message && roleUpdateScope.succeeded) {
      yield put({
        type: types.UPDATE_SCOPE_ROLE.SUCCESS,
        payload: roleUpdateScope,
      });
      callback && callback(true, roleUpdateScope);
    } else {
      yield put({
        type: types.UPDATE_SCOPE_ROLE.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error update scope role saga: ', error);
    yield put({
      type: types.UPDATE_SCOPE_ROLE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_SCOPE_ROLE.REQUEST, updateScopeRole);
}
