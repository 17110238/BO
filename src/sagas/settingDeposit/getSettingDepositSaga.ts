import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { PayloadSearchDeposit, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<PayloadSearchDeposit> {
  type?: string;
}

const SQL_QUERY = `
      query getSettingDeposit($input: GetSettingDepositInput){
        SettingDeposit{
          settingDepositData(input: $input){
            data{
              id
              merchantName
              merchantId
              sumBalanceDay
              minBalanceRate
              minBalanceAmount
              description
            }
            succeeded
            message
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const settings = data?.data?.SettingDeposit?.settingDepositData;

    if (settings?.succeeded) {
      yield put({
        type: types.GET_SETTING_DEPOSIT.SUCCESS,
        payload: settings?.data,
      });
      yield delay(500);
      callback && callback(true, settings ?? {});
    } else {
      callback && callback(false, settings);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_SETTING_DEPOSIT.REQUEST, doAction);
}
