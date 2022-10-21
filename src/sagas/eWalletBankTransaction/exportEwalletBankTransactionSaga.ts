import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `mutation exportBankTransaction($input: EWalletTransactionBankInput) {
    EWalletTransactionBank{
      ExportEwalletTransactionBank(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const exports = data?.data?.EWalletTransactionBank?.ExportEwalletTransactionBank;

    if (exports?.succeeded) {
      yield delay(500);
      callback && callback(true, exports ?? {});
    } else {
      callback && callback(false, {});
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.EXPORT_EWALLET_BANK_TRANSACTION.REQUEST, doAction);
}
