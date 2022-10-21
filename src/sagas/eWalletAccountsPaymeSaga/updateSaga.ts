import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.UPDATE_ACCOUNTS_WALLET_PAYME.REQUEST;
}

const SQL_QUERY = `
  mutation Update($input: UpdateEmployeeInput!){
    EwalletAccount{
      UpdateEmployee(input: $input){
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
    const resData = data?.data?.EwalletAccount?.UpdateEmployee;

    if (resData?.succeeded) {
      yield put({
        type: types.UPDATE_ACCOUNTS_WALLET_PAYME.SUCCESS,
        payload: resData?.data,
      });
      callback && callback(true, resData ?? {});
    } else {
      yield put({
        type: types.UPDATE_ACCOUNTS_WALLET_PAYME.FAILURE,
      });

      callback && callback(false, resData ?? {});
    }
  } catch (error) {
    yield put({
      type: types.UPDATE_ACCOUNTS_WALLET_PAYME.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_ACCOUNTS_WALLET_PAYME.REQUEST, doAction);
}