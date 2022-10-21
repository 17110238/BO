import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/ewalletPartnerService';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_EWALLET_GATE_REPORT.REQUEST;
}

const SQL_QUERY = `
query getListEwalletGateReport($input: GetEwalletGateReportInput!){
  EWalletSupplier{
    GetEwalletGateReport(input : $input){
      data{
        type
        data {
          supplier
          total
          discount
          cashback
          count
          amount
        }
        total {
          total
          amount
          discount
          cashback
          count
        }
      }
      total {
        total
        amount
        discount
        cashback
        count
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
    const gateReport = data?.data?.EWalletSupplier?.GetEwalletGateReport;
    if (gateReport?.length) {
      yield put({
        type: types.GET_EWALLET_GATE_REPORT.SUCCESS,
        payload: gateReport,
      });
      callback && callback(true, gateReport ?? []);
    } else {
      yield put({
        type: types.GET_EWALLET_GATE_REPORT.FAILURE,
      });

      callback && callback(false, gateReport ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_EWALLET_GATE_REPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_EWALLET_GATE_REPORT.REQUEST, doAction);
}
