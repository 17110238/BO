import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.REVIEW_PAYINT.REQUEST;
}

const SQL_QUERY = `query GetPayintLogs($input: GetPayinLogsInput!) {
  Transaction{
    GetPayinLogs(input: $input) {
        succeeded
        message,
        totalRow,
        data {
          merchantId
          storeId
          accountId
          campaign
          amount
          paymentMethod
          state
          createdAt
          id
          submittedAccountId
          paidAt
          description
          partnerTransaction
        }
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    if (data.data.Transaction.GetPayinLogs.succeeded) {
      callback && callback(true, data.data.Transaction.GetPayinLogs);
    } else {
      callback && callback(false, data.data.Transaction.GetPayinLogs);
    }
  } catch (error) {
    callback && callback(false,{});
  }
}

export default function* watchAction() {
  yield takeLatest(types.REVIEW_PAYINT.REQUEST, doAction);
}
