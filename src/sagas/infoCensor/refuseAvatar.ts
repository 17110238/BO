import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { SagaAction, UpdateEwalletAccountInput } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<UpdateEwalletAccountInput> {
  type?: typeof types.REFUSE_AVATAR_IMAGE.REQUEST;
}

const SQL_QUERY = `
    mutation refuseAvtarImage($input: UpdateEwalletAccountInput) {
        EwalletAccount {
            Update(input: $input) {
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
    const res = data?.data?.EwalletAccount?.Update;
    if (res?.succeeded) {
      yield put({
        type: types.REFUSE_AVATAR_IMAGE.SUCCESS,
      });
      callback && callback(true, res ?? {});
    } else {
      yield put({
        type: types.REFUSE_AVATAR_IMAGE.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    yield put({
      type: types.REFUSE_AVATAR_IMAGE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REFUSE_AVATAR_IMAGE.REQUEST, refuseAvatar)
}
