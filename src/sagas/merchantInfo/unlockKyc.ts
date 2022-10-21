import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { UnlockKycInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<UnlockKycInput> {
  type?: typeof types.UNLOCK_MERCHANT_KYC.REQUEST;
}

const SQL_QUERY = `
  mutation UnlockKyc($input: UnLockKycInput) {
    EwalletAccount {
      UnLockKyc(input: $input) {
        succeeded
        message
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.EwalletAccount?.UnLockKyc;

    if (result?.succeeded) {
      yield put({
        type: types.UNLOCK_MERCHANT_KYC.SUCCESS,
        payload: result?.message,
      });
      callback && callback(true, result?.message ?? '');
    } else {
      yield put({
        type: types.UNLOCK_MERCHANT_KYC.FAILURE,
      });

      callback && callback(false, result?.message ?? '');
    }
  } catch (error) {
    yield put({
      type: types.UNLOCK_MERCHANT_KYC.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UNLOCK_MERCHANT_KYC.REQUEST, doAction);
}
