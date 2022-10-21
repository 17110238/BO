import { callGraphql } from 'api/graphql';
import { MerchantAccount, PayloadApproveMerchant, SagaAction } from 'models';
import { element } from 'prop-types';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadApproveMerchant> {
  type?: typeof types.UPDATE_ACTIVE_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation UpdateActive($input:UpdateActiveMcInput){
    Merchant{
      UpdateActiveMc (input: $input) {
        message
        succeeded
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const updated = data?.data?.Merchant?.UpdateActiveMc;
    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_ACTIVE_MERCHANT.SUCCESS,
        payload: updated?.message,
      });
      callback && callback(true, updated);
    } else {
      yield put({
        type: types.UPDATE_ACTIVE_MERCHANT.FAILURE,
      });

      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.UPDATE_ACTIVE_MERCHANT.FAILURE,
    });
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_ACTIVE_MERCHANT.REQUEST, doAction);
}
