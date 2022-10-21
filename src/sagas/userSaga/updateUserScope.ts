//import { CreateUser } from 'components/User/CreateUser';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import { updateUserType } from 'models/user/userState';
interface SagaSearch extends SagaAction<updateUserType> {
  type?: typeof types.SEARCH_USER_MERCHANT.REQUEST;
}
const SQL_QUERY = `
mutation UpdateAccountScope($input: UpdateAccountScopeInput!) {
  Account {
    UpdateAccountScope(input: $input) 
    {
      message
      succeeded
    }
  }
}
`;
function* updateUserScope({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    if (data?.Account?.Create?.succeeded) {
      yield put({
        type: types.UPDATE_USER_SCOPE.SUCCESS,
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.UPDATE_USER_SCOPE.FAILURE,
      });

      callback && callback(false, data ?? {});
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.UPDATE_USER_SCOPE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_USER_SCOPE.REQUEST, updateUserScope);
}
