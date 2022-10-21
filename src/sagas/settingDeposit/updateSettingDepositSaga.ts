import { callGraphql } from 'api/graphql';
import { PayloadUpdateDeposit, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadUpdateDeposit> {
  type?: string;
}

const SQL_QUERY = `
      mutation updateDeposit($input: updateSettingDepositInput!){
        SettingDeposit{
          updateSettingDeposit(input: $input){
            message
            succeeded
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const updated = data?.data?.SettingDeposit?.updateSettingDeposit;

    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_SETTING_DEPOSIT.SUCCESS,
        payload: updated?.data,
      });
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
  yield takeLatest(types.UPDATE_SETTING_DEPOSIT.REQUEST, doAction);
}
