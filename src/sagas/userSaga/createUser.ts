//import { CreateUser } from 'components/User/CreateUser';

import { call, put, takeLatest } from "redux-saga/effects";
import * as types from "redux/types";
import { SagaAction } from "models";
import { FilterSearchAccountMc } from "models/account/accountMerchant";
import { callGraphql } from "api/graphql";
import { createUserType } from 'models/user/userState';

interface SagaSearch extends SagaAction<createUserType> {
  type?: typeof types.SEARCH_USER_MERCHANT.REQUEST;
}
const SQL_QUERY = `
mutation CreateAccount($input: CreateInput!) {
  Account {
    Create(input: $input) 
    {
      message
      succeeded
      link
      refcode
    }
  }
}
`;

function* createUser({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    
    if (data?.Account?.Create?.succeeded) {
      yield put({
        type: types.CREATE_USER.SUCCESS,
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.CREATE_USER.FAILURE,
      });
      callback && callback(false, data ?? {});
    }
  } catch (error) {
    console.log("error searchMC saga: ", error);
    yield put({
      type: types.CREATE_USER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CREATE_USER.REQUEST, createUser);
}
