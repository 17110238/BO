import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
  type?: typeof types.GET_EWALLET_ENUM_SERVICE.REQUEST;
}

const SQL_QUERY = `
query ReportEwalletService($input: appHistoryTransactionInput) {
    EwalletHistoryApp {
      ReportHistory(input:$input)
      {
        dataEnumServices{
          id
          key
          value
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
    const listReport = data?.data?.EwalletHistoryApp?.ReportHistory;
    callback && callback(true, listReport);
  } catch (error) {
    callback && callback(false, { message: 'Thất bại' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_EWALLET_ENUM_SERVICE.REQUEST, doAction);
}
