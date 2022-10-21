import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `
query FormBankReportEwallet($input: FormReportMerchantInput!){
  EwalletStateBankReportBo {
    FormReportEwallet(input: $input){
      coopBank{
        data{
          id
          name
          activeDate
        }
        total
      }
      userInfo{
        totalUserPersonalReg
        totalUserPersonalKyc
        balanceUserPersonal
        totalUserBusinessReg
        totalUserBusinessKyc
        balanceUserBusiness
      }
      transaction{
        successAmount
        successCount
        paymentCount
        paymentAmount
        depositCount
        depositAmount
        withdrawCount
        withdrawAmount
        failAmount
        failCount
        transCountHight
        transAmountHight
        month
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
    const list = data?.data?.EwalletStateBankReportBo.FormReportEwallet;

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
  yield takeLatest(types.GET_LIST_EWALLET_BANK_REPORT_EWALLET_TT23.REQUEST, doAction);
}
