import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import { createUserType } from 'models/user/userState';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.TRANSACTION_MANAGE_EXPORT.REQUEST;
}
const SQL_QUERY = `mutation exportTransaction($input:ExportTransactionInput){
  Transaction{
    ExportTransaction(input:$input){
      message
      succeeded
    }
  }
}`;

function* exportFileTransaction({ payload, callback }: SagaExport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: {
        filter: { ...payload },
      },
    });
    const dataDes = data?.Transaction?.ExportTransaction;
    //handle data later

    yield put({
      type: types.TRANSACTION_MANAGE_EXPORT.PENDING,
    });
    callback && callback(true, dataDes ?? {});
  } catch (error) {
    console.log('error GETMC saga: ', error);
    yield put({
      type: types.TRANSACTION_MANAGE_EXPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.TRANSACTION_MANAGE_EXPORT.REQUEST, exportFileTransaction);
}
