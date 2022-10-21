import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/utilityType';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LOGS.REQUEST;
}

const SQL_QUERY = `
query GetHistoryChange($input : GetAccountMerchantLogInput!){
    LogSystem {
            GetAccountMerchantLog(input : $input ){
                message
                succeeded
                data{
                    jsonData
                    userName
                    ip
                    action
                    fullName
                    internalAccountId
                    createdAt
                    updatedAt
                }
            }
        }
    }
`;

function* doAction({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const dataLogs = data.data.LogSystem.GetAccountMerchantLog;

    if (dataLogs?.succeeded) {
    yield put({
        type: types.GET_LOGS.SUCCESS,
        payload: dataLogs?.data,
      });
      callback && callback(true, dataLogs ?? {});
    } else {
      yield put({
        type: types.GET_LOGS.FAILURE,
      });

      callback && callback(false, dataLogs ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_LOGS.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LOGS.REQUEST, doAction);
}
