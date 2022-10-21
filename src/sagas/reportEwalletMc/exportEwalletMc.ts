import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.EXPORT_REPORT_EWALLET_MC.REQUEST;
}
const SQL_QUERY = `
mutation exportReportEwalletMc($input: ReportMerchantEwalletInput) {
  MerchantEwallet {
    ExportReport (input: $input){
        message
        succeeded
      }
    }
  }
`;
function* doAction({ payload, callback }: SagaExport) {


  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: payload
    });
    //let dataPartnerService = data?.EwalletSupplierTransaction?.ExportTransaction
    let dataReportEwalletMc = data
    yield put({
      type: types.EXPORT_REPORT_EWALLET_MC.PENDING,
    });
    callback && callback(true, data ?? {});
  } catch (error) {
    console.log('error GETMcExport saga: ', error);
    yield put({
      type: types.EXPORT_REPORT_EWALLET_MC.FAILURE,
      payload: error,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.EXPORT_REPORT_EWALLET_MC.REQUEST, doAction);
}