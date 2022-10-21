import { callGraphql } from 'api/graphql';
import { PayloadGetSettingSystem, SagaAction } from 'models';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadGetSettingSystem> {
  type?: string;
}

const SQL_QUERY = `
      query getSettingSystem($input: GetSettingSystemInput){
        SettingSystem{
          GetSettingSytem(input: $input){
            message
            succeeded
            totalRow
            data{
              id
              key
              value
              description
              type
            }
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const settings = data?.data?.SettingSystem?.GetSettingSytem;

    if (settings?.succeeded) {
      yield delay(500);
      callback && callback(true, settings ?? {});
    } else {
      callback && callback(false, { data: [] });
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_SETTING_SYSTEM.REQUEST, doAction);
}
