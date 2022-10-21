import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { PayloadRequestEKYC } from '../../models/walletKyc/walletKycState';

interface SagaSearch extends SagaAction<PayloadRequestEKYC> {
  type?: string;
}

const SQL_QUERY = `
    mutation requestWalletKYC($input: ApproveEwalletKycBoInput!){
      EwalletKycBo{
        Approve(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const approved = data?.data?.EwalletKycBo?.Approve;

    if (approved?.succeeded) {
      callback && callback(true, approved ?? {});
    } else {
      callback && callback(false, approved);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_EWALLET_KYC.REQUEST, doAction);
}
