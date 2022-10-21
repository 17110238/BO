import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/transferTypes';
import { SagaAction } from 'models';
import { SearchMismatchTransactionInput } from 'models/transfer';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<SearchMismatchTransactionInput> {
  type?: typeof types.GET_MISMATCH_TRANSACTIONS.REQUEST;
}

const SQL_QUERY = `
  query GetMismatchTransactions($input: SearchMismatchTransactionInput!) {
    Transaction{
      SearchMismatchTransaction(input: $input) {
        succeeded
        message,
        data {
          paymentId
          supplierTransaction
          amount
          description
          cardNumber
          supplierState
          paymentState
          actions
          merchantName
          brandName
          merchantId
          sourceType
          sender
          isMatch
          createdAt
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.Transaction?.SearchMismatchTransaction;

    if (result?.succeeded) {
      yield put({
        type: types.GET_MISMATCH_TRANSACTIONS.SUCCESS,
        payload: result?.data,
      });
      callback && callback(true, result?.data ?? []);
    } else {
      yield put({
        type: types.GET_MISMATCH_TRANSACTIONS.FAILURE,
      });

      callback && callback(false, result?.data ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_MISMATCH_TRANSACTIONS.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MISMATCH_TRANSACTIONS.REQUEST, doAction);
}
