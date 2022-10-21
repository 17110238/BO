import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.SEARCH_ACCOUNTS_WALLET_PAYME.REQUEST;
}

const SQL_QUERY = `
  query Search($input: SearchEmployeeInput){
    EwalletAccount{
      SearchEmployee(input: $input){
        data {
          id
          phone
          fullname
          company
          accountStatus
          ewalletAccount
          createdAt
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const resData = data?.data?.EwalletAccount?.SearchEmployee?.data;

    if (resData?.length > 0) {
      yield put({
        type: types.SEARCH_ACCOUNTS_WALLET_PAYME.SUCCESS,
        payload: resData,
      });
      callback && callback(true, resData ?? []);
    } else {
      yield put({
        type: types.SEARCH_ACCOUNTS_WALLET_PAYME.FAILURE,
      });

      callback && callback(false, resData ?? []);
    }
  } catch (error) {
    yield put({
      type: types.SEARCH_ACCOUNTS_WALLET_PAYME.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEARCH_ACCOUNTS_WALLET_PAYME.REQUEST, doAction);
}