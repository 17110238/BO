import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.APPROVE_PAYINT.REQUEST;
}

const SQL_QUERY = `mutation ApprovePayint($input:ApprovePayinInput!) {
    Transaction{
      ApprovePayin(input: $input) {
        succeeded
        message
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    if (data.data.Transaction.ApprovePayin.succeeded) {
      callback && callback(true, data.data.Transaction.ApprovePayin);
    } else {
      callback && callback(false, data.data.Transaction.ApprovePayin);
    }
  } catch (error) {
    callback && callback(false,{});
  }
}

export default function* watchAction() {
  yield takeLatest(types.APPROVE_PAYINT.REQUEST, doAction);
}
