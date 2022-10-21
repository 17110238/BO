import { callGraphql } from 'api/graphql';
import { GetReportLinkedBankPayLoad, SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetReportLinkedBankPayLoad> {
  type?: string;
}

const SQL_QUERY = `
      query getEwalletReport($input: GetReportLinkedBankInput!){
        EwalletReportBo{
          ReportLinkedBank(input: $input){
            quantityLinkedCard,
            quantityNewLinkedCard,
            quantityUnlinkedCard,
            quantityDepositTransaction,
            totalDepositTransaction,
            quantityWithdrawTransaction,
            totalWithdrawTransaction,
            date
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const rawData = data?.data?.EwalletReportBo?.ReportLinkedBank;
    if (rawData) {
      callback && callback(true, rawData);
    } else {
      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LINKED_BANK_LIST.REQUEST, doAction);
}
