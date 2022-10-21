import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import { PayloadAddDelegate } from 'redux/actions';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadAddDelegate> {
  type?: typeof types.ALERT_LOGS.REQUEST;
}

const SQL_QUERY = `
  query getAlertLogs($input: SearchAlertLogsInput){
    eWalletTransactionBo{
        SearchAlertLogs(input:$input){
            data{
                id
                message
                tags
                createdAt
                source
                type
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
    const alertLogsData = data.data.eWalletTransactionBo.SearchAlertLogs;
    if (alertLogsData && alertLogsData.data.length > 0) {
      callback && callback(true, alertLogsData);
    } else {
      callback && callback(false, alertLogsData);
    }
  } catch (error) {
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.ALERT_LOGS.REQUEST, doAction);
}
