import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { PayloadRequestEKYC } from '../../models/walletKyc/walletKycState';

interface SagaSearch extends SagaAction<PayloadRequestEKYC> {
  type?: string;
}

const SQL_QUERY = `
    mutation requestWalletKYC($input: ApproveAutoKycEwalletKycBoInput){
      EwalletKycBo{
        ApproveAutoKyc(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const approved = data?.data?.EwalletKycBo?.ApproveAutoKyc;

    if (approved?.succeeded) {
      yield delay(500);
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
  yield takeLatest(types.REQUEST_APRROVAL_AUTO_EWALLET_KYC.REQUEST, doAction);
}
