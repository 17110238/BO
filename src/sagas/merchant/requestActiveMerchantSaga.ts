import { callGraphql } from 'api/graphql';
import { PayloadRequestActiveMerchant, SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadRequestActiveMerchant> {
  type?: typeof types.REQUEST_UPDATE_ACTIVE_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation requestActiveMerchant($input:RequestActiveInput!){
    RequestChange{
      RequestActiveMerchant (input: $input) {
        message
        succeeded
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: payload,
    });
    const requested = data?.data?.RequestChange?.RequestActiveMerchant;
    if (requested?.succeeded) {
      callback && callback(true, requested);
    } else {
      callback && callback(false, requested);
    }
  } catch (error) {
    console.log('error saga: ', error);
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_UPDATE_ACTIVE_MERCHANT.REQUEST, doAction);
}
