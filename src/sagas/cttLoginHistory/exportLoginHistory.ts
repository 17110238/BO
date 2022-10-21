import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaLoginHistory extends SagaAction<any> {
  type?: typeof types.EXPORT_LOGIN_HISTORY_CTT.REQUEST;
}

const SQL_QUERY = `
mutation ExportLoginHistory($input:GetHistoryAccountLoginInput){
    HistoryAccountLogin{
      ExportHistoryAccountLogin(input:$input
      ){
        message
        succeeded
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaLoginHistory) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const exportLoginHistory = data?.data?.HistoryAccountLogin?.ExportHistoryAccountLogin;
    if (exportLoginHistory?.succeeded) {
      callback && callback(true, exportLoginHistory);
    } else {
      callback && callback(false, null);
    }
  } catch (error) {
    callback && callback(false, null);
  }
}

export default function* watchAction() {
  yield takeLatest(types.EXPORT_LOGIN_HISTORY_CTT.REQUEST, doAction);
}
