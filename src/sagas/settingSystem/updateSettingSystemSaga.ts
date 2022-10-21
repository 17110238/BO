import { callGraphql } from 'api/graphql';
import { SagaAction, SettingSystemType } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<SettingSystemType> {
  type?: string;
}

const SQL_QUERY = `
      mutation updateSettingSystem($input: UpdateSettingSystemInput!){
        SettingSystem{
          UpdateSettingSystem(input: $input){
            message
            succeeded
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });

    const updated = data?.data?.SettingSystem?.UpdateSettingSystem;

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
  yield takeLatest(types.UPDATE_SETTING_SYSTEM.REQUEST, doAction);
}
