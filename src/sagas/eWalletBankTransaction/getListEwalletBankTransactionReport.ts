import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getListBankTransactionReport($input: EWalletReportTransactionBankInput) {
    EWalletTransactionBank{
      EwalletReportTransactionBank(input: $input){
          message
          succeeded
          totalDeposit
          totalCountDeposit
          totalWithdraw
          totalCountWithdraw
          data {
            bankCode
            supplierName
            totalDeposit
            countDeposit
            totalWithdraw
            countWithdraw
          }
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  delete payload?.paging;
  
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const trans = data?.data?.EWalletTransactionBank?.EwalletReportTransactionBank;

    if (trans?.succeeded) {
      callback && callback(true, trans ?? {});
    } else {
      callback && callback(false, trans);
    }
  } catch (error) {
    console.log('error get transaction report: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_EWALLET_BANK_TRANSACTION_REPORT.REQUEST, doAction);
}
