import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetRefundAmountInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetRefundAmountInput> {
  type?: typeof types.GET_TRANSACTION_BANK_STATE.REQUEST;
}

const SQL_QUERY = `query getTransactionBankState($input: GetRefundAmountInput) {
    Transaction {
        GetTransactionBankState(input: $input) {
                message
                succeeded
                data {
                    supplierTransaction
                    transactionId
                    amount
                    description
                    state
                    requester
                    approveser
                }
        }
      }
    }
`;

function* getTransactionBankState({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const transaction = data?.data?.Transaction?.GetTransactionBankState;

    if (transaction.succeeded) {
      yield put({
        type: types.GET_TRANSACTION_BANK_STATE.SUCCESS,
        payload: transaction?.data,
      });
      callback?.(true, transaction?.data ?? {});
    } else {
      yield put({
        type: types.GET_TRANSACTION_BANK_STATE.FAILURE,
      });
      callback?.(false, transaction?.data);
    }
  } catch (error) {
    yield put({
      type: types.GET_TRANSACTION_BANK_STATE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TRANSACTION_BANK_STATE.REQUEST, getTransactionBankState);
}
