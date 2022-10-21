import { dataMerchantType } from './../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.MERCHANT_EXPORT.REQUEST;
}
const SQL_QUERY = `
mutation exportMerchant($input:ExportMerchantInput!) {
  Merchant{
    ExportMerchant(input:$input){
    message
    succeeded
                                 }   
  }
}
`;
function* exportFileMerchant({ payload, callback }: SagaExport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: {
        filter: { ...payload },
      },
    });
    let dataMerchant = data?.Merchant?.ExportMerchant;

    yield put({
      type: types.MERCHANT_EXPORT.PENDING,
    });
    callback && callback(true, data ?? {});
  } catch (error) {
    console.log('error GETMcExport saga: ', error);
    yield put({
      type: types.MERCHANT_EXPORT.FAILURE,
      payload: error,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.MERCHANT_EXPORT.REQUEST, exportFileMerchant);
}
