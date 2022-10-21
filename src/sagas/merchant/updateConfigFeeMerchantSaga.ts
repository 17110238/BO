import { callGraphql } from 'api/graphql';
import { MerchantAccount, MerchantFeeItem, SagaAction } from 'models';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MerchantFeeItem> {
  type?: typeof types.UPDATE_CONFIG_FEE_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation UpdateFee($input:UpdateConfigFeeMcInput){
    Merchant{
      UpdateFeeMc (input: $input) {
        message
        succeeded
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    delete payload?.paymentMethodName;
    const { data, errors } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const updated = data?.data?.Merchant?.UpdateFeeMc;
    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_CONFIG_FEE_MERCHANT.SUCCESS,
        payload: updated?.message,
      });
      callback && callback(true, updated);
    } else {
      yield put({
        type: types.UPDATE_CONFIG_FEE_MERCHANT.FAILURE,
      });
      callback && callback(false, data?.errors[0]);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.UPDATE_CONFIG_FEE_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeEvery(types.UPDATE_CONFIG_FEE_MERCHANT.REQUEST, doAction);
}
