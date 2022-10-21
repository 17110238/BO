import { callGraphql } from 'api/graphql';
import { GetSettingWalletAdvancePayload, SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetSettingWalletAdvancePayload> {
  type?: string;
}

const SQL_QUERY = `
      query getWalletSettingAdvance($input: GetAppSettingSystemInput){
        EWalletSettingSystem{
          AppSettingGet(input: $input){
            message
            succeeded
            totalRow
            data{
              id
              key
              value
              description
              type
              appId
              appName
            }
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const settings = data?.data?.EWalletSettingSystem?.AppSettingGet;

    if (settings?.succeeded) {
      callback && callback(true, settings ?? {});
    } else {
      callback && callback(false, settings);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_SETTING_ADVANCE_SYSTEM.REQUEST, doAction);
}
