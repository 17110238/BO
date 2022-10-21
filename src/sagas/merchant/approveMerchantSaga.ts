import { callGraphql } from 'api/graphql';
import { PayloadApproveMerchant, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadApproveMerchant> {
  type?: typeof types.APPROVING_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation ApprovingMc($input:UpdateMcInput!){
    Merchant{
      UpdateMc (input: $input) {
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
    const updated = data?.data?.Merchant?.UpdateMc;
    if (updated?.succeeded) {
      yield put({
        type: types.APPROVING_MERCHANT.SUCCESS,
        payload: updated?.message,
      });
      callback && callback(true, updated);
    } else {
      yield put({
        type: types.APPROVING_MERCHANT.FAILURE,
      });

      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.APPROVING_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.APPROVING_MERCHANT.REQUEST, doAction);
}
