import { callGraphql } from 'api/graphql';
import { PayloadChangePasswordMerchant, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadChangePasswordMerchant> {
  type?: typeof types.CHANGE_PASSWORD_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation ChangePasswordMc($input:ChangePassInput!){
    Account{
      ChangePass (input: $input) {
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
    const changed = data?.data?.Account?.ChangePass;
    if (changed?.succeeded) {
      yield put({
        type: types.CHANGE_PASSWORD_MERCHANT.SUCCESS,
        payload: changed?.message,
      });
      callback && callback(true, changed);
    } else {
      yield put({
        type: types.CHANGE_PASSWORD_MERCHANT.FAILURE,
      });

      callback && callback(false, changed);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.CHANGE_PASSWORD_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CHANGE_PASSWORD_MERCHANT.REQUEST, doAction);
}
