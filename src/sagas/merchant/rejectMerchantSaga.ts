import { callGraphql } from 'api/graphql';
import { PayloadRejectMerchant, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadRejectMerchant> {
  type?: typeof types.REJECT_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation RejectMc($input:RejectMcInput){
    Merchant{
      RejectMc (input: $input) {
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
    const rejected = data?.data?.Merchant?.RejectMc;
    if (rejected?.succeeded) {
      yield put({
        type: types.REJECT_MERCHANT.SUCCESS,
        payload: rejected?.message,
      });
      callback && callback(true, rejected);
    } else {
      yield put({
        type: types.REJECT_MERCHANT.FAILURE,
      });

      callback && callback(false, rejected);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.REJECT_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REJECT_MERCHANT.REQUEST, doAction);
}
