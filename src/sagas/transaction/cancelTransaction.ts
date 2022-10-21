import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { CancelTransactionInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<CancelTransactionInput> {
  type?: typeof types.CANCEL_TRANSACTION.REQUEST;
}

const SQL_QUERY = `mutation cancelTransaction($input: CancelTransactionInput!) {
  Transaction {
    CancelTransaction(input: $input) {
      transaction
      message
      succeeded
    }
  }
}
`

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });

    const transaction = data?.data?.Transaction?.CancelTransaction;
    if (transaction?.succeeded) {
      
      yield put({
        type: types.CANCEL_TRANSACTION.SUCCESS,
        payload: transaction,
      });
      callback && callback(true, transaction ?? {});
    } else {
      yield put({
        type: types.CANCEL_TRANSACTION.FAILURE,
        payload: transaction,
      });

      callback && callback(false, transaction);
    }
  } catch (error) {
    console.log('error refund transaction: ', error);
    yield put({
      type: types.CANCEL_TRANSACTION.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CANCEL_TRANSACTION.REQUEST, doAction)
}
