import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getListBankTransaction($input: EWalletTransactionBankInput) {
    EWalletTransactionBank{
      EwalletTransactionBank(input: $input){
          message
          succeeded
          data{
            transactionId
            phone
            accountId
            feeAmount
            transactionAmount
            transactionType
            status
            content
            supplierTransactionId
            supplierAccountId
            supplierResponse
            transactionTime
            ip
            deviceInfo
            description
            supplierName
            supplierAccountNumber
          }
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const trans = data?.data?.EWalletTransactionBank?.EwalletTransactionBank;

    if (trans?.succeeded) {
      yield delay(500);
      callback && callback(true, trans ?? {});
    } else {
      callback && callback(false, { data: [] });
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_EWALLET_BANK_TRANSACTION.REQUEST, doAction);
}
