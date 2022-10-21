import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/transferTypes';
import { SagaAction } from 'models';
import { UpdateMismatchTransactionInput } from 'models/transfer';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<UpdateMismatchTransactionInput> {
  type?: typeof types.UPDATE_MISMATCH_TRANSACTIONS.REQUEST;
}

const SQL_QUERY = `
  mutation UpdateMismatchTransactions($input: UpdateMismatchTransactionInput!) {
    Transaction{
      UpdateMismatchTransaction(input: $input) {
        succeeded
        message
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.Transaction?.UpdateMismatchTransaction;

    if (result?.succeeded) {
      yield put({
        type: types.UPDATE_MISMATCH_TRANSACTIONS.SUCCESS,
        payload: result?.message,
      });
      callback && callback(true, result?.message ?? '');
    } else {
      yield put({
        type: types.UPDATE_MISMATCH_TRANSACTIONS.FAILURE,
        payload: result?.message,
      });

      callback && callback(false, result?.message ?? '');
    }
  } catch (error) {
    yield put({
      type: types.UPDATE_MISMATCH_TRANSACTIONS.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_MISMATCH_TRANSACTIONS.REQUEST, doAction);
}
