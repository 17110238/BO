import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { RefundTransactionInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<RefundTransactionInput> {
  type?: typeof types.REFUND_TRANSACTION.REQUEST;
}

const SQL_QUERY = `mutation refundTransaction($input: RefundTransactionInput!) {
  Transaction {
    RefundTransaction(input: $input) {
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

    const transaction = data?.data?.Transaction?.RefundTransaction;
    if (transaction?.succeeded) {
      
      yield put({
        type: types.REFUND_TRANSACTION.SUCCESS,
        payload: transaction,
      });
      callback && callback(true, transaction ?? {});
    } else {
      yield put({
        type: types.REFUND_TRANSACTION.FAILURE,
        payload: transaction,
      });

      callback && callback(false, transaction);
    }
  } catch (error) {
    console.log('error refund transaction: ', error);
    yield put({
      type: types.REFUND_TRANSACTION.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REFUND_TRANSACTION.REQUEST, doAction)
}
