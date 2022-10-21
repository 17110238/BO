import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { RefundEWalletTransactionInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<RefundEWalletTransactionInput> {
  type?: typeof types.REFUND_E_WALLET_TRANSACTION.REQUEST;
}

const SQL_QUERY = `
    mutation refundEwalletTransaction($input: RefundEWalletTransactionInput) {
        eWalletTransactionBo {
        RefundEwalletTransaction(input: $input) {
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
    const refund = data?.data?.eWalletTransactionBo?.RefundEwalletTransaction;
    if (refund?.succeeded) {
      callback?.(true, refund ?? {});
    } else {
      callback?.(false, refund);
    }
  } catch (error) {
    callback?.(false, {message: 'Lỗi kết nối từ Server'});
  }
}

export default function* watchAction() {
  yield takeLatest(types.REFUND_E_WALLET_TRANSACTION.REQUEST, doAction)
}
