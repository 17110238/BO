import { SagaAction, InputAlipayStore } from 'models';
import { call, takeLatest, put } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<InputAlipayStore> {
  type?: typeof types.CHECK_STATUS_ALIPAY.REQUEST;
}

const SQL_QUERY = `
query CheckAlipayStatus($input:CheckAlipayStatusInput!) {
    Store {
        CheckAlipayStatus(input:$input){
            message
            succeeded
            data {
              merchantId
              merchantName
              type
              state
              reason
              contact { email, phone}
              registration {
                address
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
    const stores = data?.data?.Store?.CheckAlipayStatus;
    if (stores.succeeded) {
      callback && callback(true, stores ?? {});
    } else {
      callback && callback(false, stores);
    }
  } catch (error) {
    console.log('error check alipay store: ', error);
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.CHECK_STATUS_ALIPAY.REQUEST, doAction);
}
