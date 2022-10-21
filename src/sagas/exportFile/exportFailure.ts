import { dataMerchantType } from './../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.MERCHANT_EXPORT.REQUEST;
}

function* exportFileMerchantFailure({ payload, callback }: SagaExport) {
  yield put({
    type: types.MERCHANT_EXPORT.FAILURE,
  });
}

export default function* watchAction() {
  yield takeLatest(types.MERCHANT_EXPORT_SOXKET.FAILURE, exportFileMerchantFailure);
}
