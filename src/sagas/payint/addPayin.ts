import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphQlFormData } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.ADD_PAYINT.REQUEST;
}

const SQL_QUERY = `mutation addPayinFile($file: Upload!, $merchantId: BigInt!) {
    Transaction {
      AddPayinFile(file: $file, merchantId: $merchantId) {
        message
        succeeded
        campaign
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  const variables = {...payload,phonesList:payload.phones}
  try {
    const { data } = yield call<any>(
      callGraphQlFormData,
      SQL_QUERY,
      payload,
      payload.file
    );
    if (data.data.Transaction.AddPayinFile.succeeded) {
      callback && callback(true, data.data.Transaction.AddPayinFile);
    } else {
      callback && callback(false, data.data.Transaction.AddPayinFile);
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.ADD_PAYINT.REQUEST, doAction);
}
