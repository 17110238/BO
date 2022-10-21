import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/ewalletPartnerService';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_BANK_REPORT.REQUEST;
}

const SQL_QUERY = `query getListBankReport($input: GetBankReportInput!){
  EWalletSupplier{
    GetBankReport(input : $input){
      totalDeposit
      countDeposit
      totalWithdraw
      countWithdraw
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
    const bankReport = data?.data?.EWalletSupplier?.GetBankReport;

    if (bankReport && Object.keys(bankReport).length > 0) {
      yield put({
        type: types.GET_BANK_REPORT.SUCCESS,
        payload: bankReport
      });
      callback && callback(true, bankReport ?? {});
    } else {
      yield put({
        type: types.GET_BANK_REPORT.FAILURE,
      });

      callback && callback(false, bankReport ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_BANK_REPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_BANK_REPORT.REQUEST, doAction);
}
