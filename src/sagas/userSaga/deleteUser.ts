//import { CreateUser } from 'components/User/CreateUser';

import { callGraphql } from "api/graphql";
import { SagaAction } from "models";
import { call, put, takeLatest } from "redux-saga/effects";
import * as types from "redux/types";

interface SagaDelete extends SagaAction<any> {
  type?: typeof types.DELETE_USER.REQUEST;
}
const SQL_QUERY = `
mutation DeleteAccount($input: DeleteInput!) {
  Account {
    Delete(input: $input) 
    {
      message
      succeeded
    }
  }
}
`;

function* doAction({ payload, callback }: SagaDelete) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const dataUSer = data?.data?.Account?.Delete

    if (dataUSer?.succeeded) {
      yield put({
        type: types.DELETE_USER.SUCCESS,
      });
      callback && callback(true, dataUSer ?? {});
    } else {
      yield put({
        type: types.DELETE_USER.FAILURE,
      });

      callback && callback(false, dataUSer ?? {});
    }
  } catch (error) {
    console.log("error searchMC saga: ", error);
    yield put({
      type: types.DELETE_USER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.DELETE_USER.REQUEST, doAction);
}