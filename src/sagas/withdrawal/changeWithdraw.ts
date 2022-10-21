import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { ChangeWithdrawInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<ChangeWithdrawInput> {
  type?: typeof types.CHANGE_WITHDRAW.REQUEST;
}

const SQL_QUERY = `mutation changeWithdrawState($input: ChangeWithdrawInput) {
  Transaction {
    ChangeWithdrawState(input: $input) {
      message
      succeeded
      data
      totalRow
    }
  }
}
`
function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const transaction = data?.data?.Transaction?.ChangeWithdrawState;
    if (transaction?.succeeded) {
      yield put({
        type: types.CHANGE_WITHDRAW.SUCCESS,
        payload: transaction,
      });
      callback && callback(true, transaction ?? {});
    } else {
      yield put({
        type: types.CHANGE_WITHDRAW.FAILURE,
        payload: transaction,
      });

      callback && callback(false, transaction);
    }
  } catch (error) {
    yield put({
      type: types.CHANGE_WITHDRAW.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CHANGE_WITHDRAW.REQUEST, doAction)
}
