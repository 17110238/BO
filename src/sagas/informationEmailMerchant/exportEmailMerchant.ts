import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
  type?: typeof types.EXPORT_EMAIL_MERCHANT.REQUEST;
}
const SQL_QUERY = `
mutation eww($input:FilterEwalletMerchantExportingInput) {
  EwalletAnnounce {
      EwalletAnnounceExport (input:$input){ 
        succeeded
        message
    }
  }
}
`;
function* exportFileEmailMerchant({ payload, callback }: SagaExport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: {
        filter: { ...payload },
      },
    });
    let dataMerchant = data?.EwalletAnnounce?.EwalletAnnounceExport;

    yield put({
      type: types.EXPORT_EMAIL_MERCHANT.PENDING,
    });
    callback && callback(true, data ?? {});
  } catch (error) {
    yield put({
      type: types.EXPORT_EMAIL_MERCHANT.FAILURE,
      payload: error,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.EXPORT_EMAIL_MERCHANT.REQUEST, exportFileEmailMerchant);
}
