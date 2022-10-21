import { filter } from 'lodash';
import { SagaAction } from 'models';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_DATA_TOP_10_WALLET.REQUEST;
}

const SQL_QUERY = `
query topCount($input: FormReportEwalletDetailInput!){
    EwalletStateBankReportBo {
     FormReportEwalletDetail(input:$input){
       topCount {
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
    // console.log('payload', payload);
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload.filter },
    });
    const res = data?.data?.EwalletStateBankReportBo?.FormReportEwalletDetail?.topCount;
    if (res) {
      callback && callback(true, res);
    } else {
      callback && callback(false, { message: 'Thất bại' });
    }
  } catch (error) {
    callback && callback(false, { message: 'Thất bại' });
  }
}

export default function* watchAction() {
  yield takeEvery(types.GET_DATA_TOP_10_WALLET.REQUEST, doAction);
}
