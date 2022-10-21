import { dataMerchantType } from './../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/transferTypes';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.EXPORT_MISMATCH_TRANSACTIONS.REQUEST;
}
const SQL_QUERY = `
  mutation ExportMismatchTransactions($input: SearchMismatchTransactionInput) {
    Transaction {
      ExportMismatchTransaction(input: $input) {
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
    let dataRes = data?.Transaction?.ExportMismatchTransaction;

    yield put({
      type: types.EXPORT_MISMATCH_TRANSACTIONS.PENDING,
    });
    callback && callback(true, dataRes ?? {});
  } catch (error) {
    console.log('error GETMcExport saga: ', error);
    yield put({
      type: types.EXPORT_MISMATCH_TRANSACTIONS.FAILURE,
      payload: error,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.EXPORT_MISMATCH_TRANSACTIONS.REQUEST, doAction);
}
