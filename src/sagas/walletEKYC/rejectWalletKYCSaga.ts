import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { PayloadRequestEKYC } from '../../models/walletKyc/walletKycState';

interface SagaSearch extends SagaAction<PayloadRequestEKYC> {
  type?: string;
}

const SQL_QUERY = `
    mutation rejectWalletKYC($input: RejectEWalletKycBoInput!){
      EwalletKycBo{
        Reject(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const rejected = data?.data?.EwalletKycBo?.Reject;

    if (rejected?.succeeded) {
      callback && callback(true, rejected ?? {});
    } else {
      callback && callback(false, rejected);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.REJECT_EWALLET_KYC.REQUEST, doAction);
}
