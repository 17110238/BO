import { UPDATE_ACCOUNT_INFO_EWALLET } from './../../redux/types/merchantInfoTypes';
import { WalletKYC } from '../../models/walletKyc/walletKycState';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<WalletKYC> {
  type?: string;
}

const SQL_QUERY = `
    mutation updateAccountInfoEWallet($input: UpdateEwalletAccountInput!){
      EwalletAccount{
        Update(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const updated = data?.data?.EwalletAccount?.Update;

    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_ACCOUNT_INFO_EWALLET.SUCCESS,
      });
      callback && callback(true, updated ?? {});
    } else {
      yield put({
        type: types.UPDATE_ACCOUNT_INFO_EWALLET.FAILURE,
      });
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    yield put({
      type: types.UPDATE_ACCOUNT_INFO_EWALLET.FAILURE,
    });
    // callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_ACCOUNT_INFO_EWALLET.REQUEST, doAction);
}
