import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/eWalletReportService';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_REPORT_CUSTOMER.REQUEST;
}

const SQL_QUERY = `query getListReportCustomer($input: ReportCustomerInput!){
  EwalletReportBo{
    ReportCustomer(input : $input){
      data {
        date
        totalNewWallet
        walletKyc
        rejectedWallet
        sumWalletKyc
        allWalletActive
        allUserWalletActive
        allBusinessWalletActive
        totalBalanceUser
        totalBalanceBusiness
        totalTransactions
      }
      sumData {
        sumAllNewWallet
        sumAllWalletKyc
        sumAllTransaction
      }
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    delete payload?.paging;
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const reportCustomer = data?.data?.EwalletReportBo?.ReportCustomer;

    if (reportCustomer?.data?.length > 0) {
      yield put({
        type: types.GET_REPORT_CUSTOMER.SUCCESS,
        payload: reportCustomer
      });
      callback && callback(true, reportCustomer ?? {});
    } else {
      yield put({
        type: types.GET_REPORT_CUSTOMER.FAILURE,
      });

      callback && callback(false, reportCustomer ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_REPORT_CUSTOMER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_CUSTOMER.REQUEST, doAction);
}
