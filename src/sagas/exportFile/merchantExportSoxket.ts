import { dataMerchantType } from './../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest, delay } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.MERCHANT_EXPORT_SOXKET.REQUEST;
}
const SQL_QUERY = `
subscription subExportMc {
  SubExport{
      SubExportExcel{
          message
          succeeded
          type
          accountId
          url
          data
      }
  }
  }
`;
function* exportFileMerchant({ payload, callback }: SagaExport) {
  try {
    // yield call<any>(callGraphql, SQL_QUERY);
    const { data } = yield call<any>(callGraphql, SQL_QUERY);

    let dataMerchant = data?.SubExport?.SubExportExcel;

    if (!dataMerchant?.succeeded) {
      yield put({
        type: types.MERCHANT_EXPORT_SOXKET.SUCCESS,
        // payload: data?.data,
      });
      callback && callback(true, data ?? {});
    }
    if (dataMerchant?.succeeded) {
      if (dataMerchant?.type === 'EXPORT_MERCHANT' && dataMerchant?.accountId === 5789587639) {
        yield put({
          type: types.MERCHANT_EXPORT_SOXKET.SUCCESS,
          // payload: data?.data,
        });
        callback && callback(true, dataMerchant ?? {});
      } else {
        yield put({
          type: types.MERCHANT_EXPORT_SOXKET.FAILURE,
        });

        callback && callback(false, dataMerchant ?? {});
      }
    }
  } catch (error) {
    console.log('error GETMcExport saga: ', error);
    yield put({
      type: types.MERCHANT_EXPORT_SOXKET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.MERCHANT_EXPORT_SOXKET.REQUEST, exportFileMerchant);
}
