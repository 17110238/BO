import { GetRefundAmountInput, SagaAction } from "models";
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetRefundAmountInput> {
  type?: typeof types.GET_REFUND_AMOUNT_TRANSACTION.REQUEST;
}

const SQL_QUERY = `query getRefundAmount($input: GetRefundAmountInput!) {
  Transaction {
    GetRefundAmount(input: $input) {
      message
      succeeded
      refundAmount
    }
  }
}
`

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const refundAmount = data?.data?.Transaction?.GetRefundAmount;
    if (refundAmount) {
      yield put({
        type: types.GET_REFUND_AMOUNT_TRANSACTION.SUCCESS,
        payload: refundAmount,
      });
      callback && callback(true, refundAmount ?? {});
    } else {
      yield put({
        type: types.GET_REFUND_AMOUNT_TRANSACTION.FAILURE,
      });

      callback && callback(false, refundAmount);
    }
  } catch (error) {
    console.log('error get transaction list: ', error);
    yield put({
      type: types.GET_REFUND_AMOUNT_TRANSACTION.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REFUND_AMOUNT_TRANSACTION.REQUEST, doAction)
}
