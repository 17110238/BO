import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetAllTransactionsInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetAllTransactionsInput> {
  type?: typeof types.GET_LIST_TRANSACTION.REQUEST;
}

const SQL_QUERY = `query getPayments($input: GetPaymentListInput!) {
  Transaction {
    GetPaymentList(input: $input) {
      totalRow
      data {
        id,
        cardType,
        cardNumber,
        country
        accountId
        transactionId
        orderId
        partnerTransaction
        supplierId
        supplierName
        supplierTransaction
        paymentId
        amount
        fee
        total
        method
        issuerName
        createdAt
        finishedAt
        updatedAt
        state
        clientIp
        description
        storeId
        merchantId
        paymentSubType
        paymentMainType
        crossCheckState
        crossCheckId
        storeName
        merchantName
        transactionType
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
    const transactions = data?.data?.Transaction?.GetPaymentList;
    if (transactions) {
      yield put({
        type: types.GET_LIST_TRANSACTION.SUCCESS,
        payload: transactions?.data,
      });
      callback && callback(true, transactions ?? {});
    } else {
      yield put({
        type: types.GET_LIST_TRANSACTION.FAILURE,
      });

      callback && callback(false, transactions);
    }
  } catch (error) {
    console.log('error get transaction list: ', error);
    yield put({
      type: types.GET_LIST_TRANSACTION.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_TRANSACTION.REQUEST, doAction);
}
