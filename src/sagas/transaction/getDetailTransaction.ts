import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetDetailPaymentInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetDetailPaymentInput> {
  type?: string;
}

const SQL_QUERY = `query getDetailTransaction($input: GetDetailPaymentInput!) {
  Transaction {
    GetDetail(input: $input) {
      id
      cardType
      cardNumber
      country
      accountId
      transactionId
      orderId
      partnerTransaction
      supplierId
      supplierName
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
      supplierTransaction
      transactionType
      paymeRequested
      extraData
      supplierResponsed
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const transaction = data?.data?.Transaction?.GetDetail;
    if (transaction) {
      yield put({
        type: types.GET_DETAIL_TRANSACTION.SUCCESS,
        payload: transaction,
      });
      callback && callback(true, transaction ?? {});
    } else {
      yield put({
        type: types.GET_DETAIL_TRANSACTION.FAILURE,
      });

      callback && callback(false, transaction);
    }
  } catch (error) {
    console.log('error get detail transaction list: ', error);
    yield put({
      type: types.GET_DETAIL_TRANSACTION.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DETAIL_TRANSACTION.REQUEST, doAction);
}
