import { callGraphql } from 'api/graphql';
import { SagaAction, WalletKYC } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<Pick<WalletKYC, 'identifyIC' | 'id'>> {
  type?: string;
}

const SQL_QUERY = `
    mutation rejectWalletKYC_IC($input: RejectICInput){
      EwalletKycBo{
        RejectIC(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const rejected = data?.data?.EwalletKycBo?.RejectIC;

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
  yield takeLatest(types.REJECT_EWALLET_KYC_IC.REQUEST, doAction);
}
