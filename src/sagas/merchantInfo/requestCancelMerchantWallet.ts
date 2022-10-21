import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { RequestCancelAccountInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<RequestCancelAccountInput> {
  type?: typeof types.REQUEST_CANCEL_MERCHANT_WALLET.REQUEST;
}

const SQL_QUERY = `
  mutation RequestCancelMerchantWallet($input: RequestCancleAccountInput) {
    EwalletAccount {
      RequestCancleAccount(input: $input) {
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
    const result = data?.data?.EwalletAccount?.RequestCancleAccount;

    if (result?.succeeded) {
      yield put({
        type: types.REQUEST_CANCEL_MERCHANT_WALLET.SUCCESS,
        payload: result?.message,
      });
      callback && callback(true, result?.message ?? '');
    } else {
      yield put({
        type: types.REQUEST_CANCEL_MERCHANT_WALLET.FAILURE,
      });

      callback && callback(false, result?.message ?? '');
    }
  } catch (error) {
    yield put({
      type: types.REQUEST_CANCEL_MERCHANT_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_CANCEL_MERCHANT_WALLET.REQUEST, doAction);
}
