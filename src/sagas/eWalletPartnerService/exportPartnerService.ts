import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.EXPORT_PARTNER_SERVICE.REQUEST;
}
const SQL_QUERY = `
mutation exportPartnerService($input: SearchSupplierTransactionInput) {
  EwalletSupplierTransaction {
    ExportTransaction (input: $input){
        message
        succeeded
      }
    }
  }
`;
function* doAction({ payload, callback }: SagaExport) {


  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: {
        filter: { ...payload },
      },
    });
    //let dataPartnerService = data?.EwalletSupplierTransaction?.ExportTransaction
    let dataPartnerService = data
    yield put({
      type: types.EXPORT_PARTNER_SERVICE.PENDING,
    });
    callback && callback(true, data ?? {});
  } catch (error) {
    console.log('error GETMcExport saga: ', error);
    yield put({
      type: types.EXPORT_PARTNER_SERVICE.FAILURE,
      payload: error,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.EXPORT_PARTNER_SERVICE.REQUEST, doAction);
}