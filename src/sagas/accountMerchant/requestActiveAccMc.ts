import { callGraphql } from 'api/graphql';
import { RequestActiveInput, SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<RequestActiveInput> {
  type?: typeof types.REQUEST_ACTIVE_ACCOUNT.REQUEST;
}

const SQL_QUERY = `
  mutation requestActiveAccount($input:RequestActiveInput!){
    RequestChange{
      RequestActiveAccount (input: $input) {
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
    const requested = data?.data?.RequestChange?.RequestActiveAccount;
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
  yield takeLatest(types.REQUEST_ACTIVE_ACCOUNT.REQUEST, doAction);
}
