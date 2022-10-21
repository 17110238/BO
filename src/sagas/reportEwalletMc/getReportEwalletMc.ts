import { callGraphql } from 'api/graphql';
import { ReportMerchantEwalletInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `
query getReportEwalletMc($input : ReportMerchantEwalletInput){
  MerchantEwallet{
    Report(input : $input){
      data{
        merchantId
        merchantName
        amountEwalletBefore
        crossCheck
        topUp
        withdraw
        pobo
        feePobo
        wallet
      }
      total{
        amountEwalletBefore
        crossCheck
        topUp
        withdraw
        pobo
        feePobo
        wallet
      }
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {

    

    delete payload?.paging
    delete payload?.sort
    
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const details = data?.data?.MerchantEwallet?.Report;
    
    if (Array.isArray(details?.data)) {
      callback && callback(true, details);
    } else {
      callback && callback(false, { data: [], total: {} });
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_EWALLET_MC.REQUEST, doAction);
}
