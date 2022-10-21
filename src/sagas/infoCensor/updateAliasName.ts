import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { ProfileAliasInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<ProfileAliasInput> {
  type?: typeof types.UPDATE_ALIASNAME.REQUEST;
}

const SQL_QUERY = `
    mutation refuseAvtarImage($input: ProfileAliasInput!) {
        EwalletAccount {
            ProfileAlias(input: $input) {
            message
            succeeded
        }
    }
}
`
function* refuseAvatar({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const updateAliasName = data?.data?.EwalletAccount?.ProfileAlias;
    if (updateAliasName?.succeeded) {
      yield put({
        type: types.UPDATE_ALIASNAME.SUCCESS,
      });
      callback && callback(true, updateAliasName ?? {});
    } else {
      yield put({
        type: types.UPDATE_ALIASNAME.FAILURE,
      });

      callback && callback(false, updateAliasName);
    }
  } catch (error) {
    yield put({
      type: types.UPDATE_ALIASNAME.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_ALIASNAME.REQUEST, refuseAvatar)
}
