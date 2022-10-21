import { callGraphql } from 'api/graphql';
import { PayloadUpdateActiveAccountMerchant, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadUpdateActiveAccountMerchant> {
  type?: typeof types.UPDATE_ACTIVE_ACCOUNT_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation updateDelegate($input:UpdateDelegateInput!) {
    Merchant{
      UpdateDelegate(input: $input) {
          succeeded,
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
    const updated = data?.data?.Merchant?.UpdateDelegate;

    console.log(updated);

    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_ACTIVE_ACCOUNT_MERCHANT.SUCCESS,
        payload: updated?.message,
      });

      yield put({
        type: types.GET_LIST_DELEGATE_MC.REQUEST,
        payload: {
          filter: {
            merchantId: +(payload?.merchantId || 0),
          },
        },
      });
      callback && callback(true, updated);
    } else {
      yield put({
        type: types.UPDATE_ACTIVE_ACCOUNT_MERCHANT.FAILURE,
      });

      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.UPDATE_ACTIVE_ACCOUNT_MERCHANT.FAILURE,
    });
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_ACTIVE_ACCOUNT_MERCHANT.REQUEST, doAction);
}
