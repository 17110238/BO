import { callGraphql } from 'api/graphql';
import { SagaAction, WalletKYC } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<Pick<WalletKYC, 'id' | 'identifyNumber'>> {
  type?: string;
}

const SQL_QUERY = `
    mutation requestWalletKYC_IC($input: ApproveICInput){
      EwalletKycBo{
        ApproveIC(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const approved = data?.data?.EwalletKycBo?.ApproveIC;

    if (approved?.succeeded) {
      callback && callback(true, approved ?? {});
    } else {
      callback && callback(false, approved);
    }
  } catch (error) {
    console.log('error get saga: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_EWALLET_KYC_IC.REQUEST, doAction);
}
