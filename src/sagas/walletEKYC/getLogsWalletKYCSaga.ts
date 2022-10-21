import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getLogsWalletKYC($input: GetAccountMerchantLogInput!){
      LogSystem{
        GetEwalletKycLog(input: $input){
          jsonData
          action
          ip
          userName
          fullName
          internalAccountId
          createdAt
          updatedAt
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const logs = data?.data?.LogSystem?.GetEwalletKycLog;

    if (logs?.length) {
      callback && callback(true, logs ?? {});
    } else {
      callback && callback(false, logs);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LOGS_EWALLET_KYC.REQUEST, doAction);
}
