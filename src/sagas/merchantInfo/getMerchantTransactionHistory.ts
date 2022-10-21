import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { SearchEWalletTransactionInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<SearchEWalletTransactionInput> {
  type?: typeof types.GET_MERCHANT_TRANSACTION_HISTORY.REQUEST;
}

const SQL_QUERY = `
  query GetMerchantTransactionHistory ($input: SearchEWalletTransactionInput) {
    eWalletTransactionBo {
      SearchTransaction(input: $input) {
        message
        succeeded
        data {
          transactionId
          changed
          amount
          fee
          state
          description
          createdAt
          service {
            state
            code
          }
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
    const result = data?.data?.eWalletTransactionBo?.SearchTransaction;

    if (result?.succeeded) {
      yield put({
        type: types.GET_MERCHANT_TRANSACTION_HISTORY.SUCCESS,
        payload: result?.data,
      });
      callback && callback(true, result?.data ?? []);
    } else {
      yield put({
        type: types.GET_MERCHANT_TRANSACTION_HISTORY.FAILURE,
      });

      callback && callback(false, result?.data ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_MERCHANT_TRANSACTION_HISTORY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_TRANSACTION_HISTORY.REQUEST, doAction);
}
