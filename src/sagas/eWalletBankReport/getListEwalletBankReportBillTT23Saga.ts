import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `
query FormBankReportBillEwallet($input: FormReportMerchantInput!){
  EwalletStateBankReportBo {
    FormReportBill(input: $input){
      coopBank{
        data{
          id
          name
          activeDate
        }
        total
      }
      transaction{
        successAmount
        successCount
        failAmount
        failCount
        month
      }
      totalMerchant
    }
  }
}

`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const list = data?.data?.EwalletStateBankReportBo.FormReportBill;

    if (list && Object.keys(list).length) {
      callback && callback(true, list ?? {});
    } else {
      callback && callback(false, {});
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_EWALLET_BANK_REPORT_BILL_TT23.REQUEST, doAction);
}
