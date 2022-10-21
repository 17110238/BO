import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/ewalletPartnerService';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_EWALLET_SERVICE_REPORT_BILL.REQUEST;
}

const SQL_QUERY = `
query getListPartnerService($input: GetEwalletServiceBillReportInput!){
  EWalletSupplier{
    GetEwalletServiceBillReport(input : $input){
      data{
        type
        count
        total
      }
      total {
        count
        total
      }
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    delete payload?.paging
    const { data, errors } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const serviceReportBill = data?.data?.EWalletSupplier?.GetEwalletServiceBillReport;


    if (serviceReportBill?.data?.length) {
      yield put({
        type: types.GET_EWALLET_SERVICE_REPORT_BILL.SUCCESS,
        payload: serviceReportBill,
      });
      callback && callback(true, serviceReportBill ?? {});
    } else {
      yield put({
        type: types.GET_EWALLET_SERVICE_REPORT_BILL.FAILURE,
      });
      callback && callback(false, serviceReportBill ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_EWALLET_SERVICE_REPORT_BILL.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_EWALLET_SERVICE_REPORT_BILL.REQUEST, doAction);
}
