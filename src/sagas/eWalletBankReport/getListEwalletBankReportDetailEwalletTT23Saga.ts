import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `
query FormBankReportDetailEwallet($inputPersonal: FormReportEwalletDetailInput!, $inputBusiness: FormReportEwalletDetailInput!) {
  EwalletStateBankReportBo{
    ReportPersonalDetail: FormReportEwalletDetail(input: $inputPersonal){
      transaction{
        successAmount
        successCount
        paymentCount
        paymentAmount
        depositCount
        depositAmount
        withdrawCount
        withdrawAmount
        month
      }
      topCount{
        accountId
        fullname
        identifyNumberTaxCode
        depositCount
        depositAmount
        withdrawCount
        withdrawAmount
        paymentCount
        paymentAmount
        totalCount
        totalAmount
      }
      topAmount{
        accountId
        fullname
        identifyNumberTaxCode
        depositCount
        depositAmount
        withdrawCount
        withdrawAmount
        paymentCount
        paymentAmount
        totalCount
        totalAmount
      }
    }
    ReportBusinessDetail: FormReportEwalletDetail(input: $inputBusiness){
      transaction{
        successAmount
        successCount
        paymentCount
        paymentAmount
        depositCount
        depositAmount
        withdrawCount
        withdrawAmount
        month
      }
      topCount{
        accountId
        fullname
        identifyNumberTaxCode
        depositCount
        depositAmount
        withdrawCount
        withdrawAmount
        paymentCount
        paymentAmount
        totalCount
        totalAmount
      }
      topAmount{
        accountId
        fullname
        identifyNumberTaxCode
        depositCount
        depositAmount
        withdrawCount
        withdrawAmount
        paymentCount
        paymentAmount
        totalCount
        totalAmount
      }
    }
  }
}

`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      inputPersonal: {
        ...payload,
        accountType: 'PERSONAL',
      },
      inputBusiness: {
        ...payload,
        accountType: 'BUSINESS',
      },
    });
    const list = data?.data?.EwalletStateBankReportBo;

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
  yield takeLatest(types.GET_LIST_EWALLET_BANK_REPORT_DETAIL_EWALLET_TT23.REQUEST, doAction);
}
