import { RESET_MERCHANT_PASSWORD } from './../../redux/types/merchantInfoTypes';
import { WalletKYC } from '../../models/walletKyc/walletKycState';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { NewPasswordWalletInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<NewPasswordWalletInput> {
  type?: string;
}

const SQL_QUERY = `
  mutation updateAccountInfoEWallet($input: NewPasswordWalletInput!){
    EwalletAccount{
      NewPasswordWallet(input: $input){
        message
        succeeded
        data {
          password
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const updated = data?.data?.EwalletAccount?.NewPasswordWallet;

    if (updated?.succeeded) {
      yield put({
        type: types.RESET_MERCHANT_PASSWORD.SUCCESS,
      });
      callback && callback(true, updated ?? {});
    } else {
      yield put({
        type: types.RESET_MERCHANT_PASSWORD.FAILURE,
      });
      callback && callback(false, updated);
    }
  } catch (error) {
    yield put({
      type: types.RESET_MERCHANT_PASSWORD.FAILURE,
    });
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.RESET_MERCHANT_PASSWORD.REQUEST, doAction);
}
