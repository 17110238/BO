import { callGraphql } from 'api/graphql';
import { SagaAction, SettingDeposit } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<SettingDeposit> {
  type?: string;
}

const SQL_QUERY = `
      mutation updateDeposit($input: createSettingDepositInput!){
        SettingDeposit{
          createSettingDeposit(input: $input){
            message
            succeeded
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const created = data?.data?.SettingDeposit?.createSettingDeposit;

    if (created?.succeeded) {
      yield put({
        type: types.CREATE_SETTING_DEPOSIT.SUCCESS,
        payload: created?.data,
      });
      callback && callback(true, created ?? {});
    } else {
      callback && callback(false, created ?? { message: 'Thất bại' });
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.CREATE_SETTING_DEPOSIT.REQUEST, doAction);
}
