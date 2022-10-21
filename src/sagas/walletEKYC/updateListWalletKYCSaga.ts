import { WalletKYC } from './../../models/walletKyc/walletKycState';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<WalletKYC> {
  type?: string;
}

const SQL_QUERY = `
    mutation updateWalletKYC($input: UpdateEwalletKycBoInput!){
      EwalletKycBo{
        Update(input: $input){
          message
          succeeded
          warningBlackList
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const updated = data?.data?.EwalletKycBo?.Update;

    if (updated?.succeeded) {
      callback && callback(true, updated ?? {});
    } else {
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_EWALLET_KYC.REQUEST, doAction);
}
