import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { SagaAction } from "models";
import { callGraphql } from '../../api/graphql';
import { ChangePoboOrderStateInput } from 'models/pobo/poboState';

interface SagaSearch extends SagaAction<ChangePoboOrderStateInput> {
  type?: typeof types.CHANGE_POBO.REQUEST;
}

const SQL_QUERY = `
    mutation changePoboOrderState($input: ChangePoboOrderStateInput) {
    Transaction {
        ChangePoboOrderState(input: $input) {
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
    const transaction = data?.data?.Transaction?.ChangePoboOrderState;
    if (transaction?.succeeded) {
      yield put({
        type: types.CHANGE_POBO.SUCCESS,
        payload: transaction,
      });
      callback && callback(true, transaction ?? {});
    } else {
      yield put({
        type: types.CHANGE_POBO.FAILURE,
        payload: transaction,
      });

      callback && callback(false, transaction);
    }
  } catch (error) {
    yield put({
      type: types.CHANGE_POBO.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CHANGE_POBO.REQUEST, doAction)
}
