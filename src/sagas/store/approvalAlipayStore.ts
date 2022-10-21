import { SagaAction, InputAlipayStore } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<InputAlipayStore> {
  type?: typeof types.APPROVAL_ALIPAY_TYPES.REQUEST;
}

const SQL_QUERY = `
mutation RequestApprovalAlipay($input:RequestApproveAlipayInput!) {
  Store {
    RequestApproveAlipay(input:$input){
      message
      succeeded
    }
  }
}
`;
function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const stores = data?.data?.Store?.RequestApproveAlipay;
    if (stores.succeeded) {
      callback && callback(true, stores ?? {});
    } else {
      callback && callback(false, stores);
    }
  } catch (error) {
    console.log('error approval alipay store: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.APPROVAL_ALIPAY_TYPES.REQUEST, doAction);
}
