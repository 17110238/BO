import { callGraphql } from 'api/graphql';
import { SagaAction, SettingWalletAdvanceType } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<SettingWalletAdvanceType> {
  type?: string;
}

const SQL_QUERY = `
      mutation updateWalletSettingAdvance($input: UpdateAppSettingSystemInput!){
        EWalletSettingSystem{
          AppSettingUpdate(input: $input){
            message
            succeeded
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });

    const updated = data?.data?.EWalletSettingSystem?.AppSettingUpdate;

    if (updated?.succeeded) {
      callback && callback(true, updated ?? {});
    } else {
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_SETTING_ADVANCE_SYSTEM.REQUEST, doAction);
}
