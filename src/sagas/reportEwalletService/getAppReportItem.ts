import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.APP_SERVICE_ITEM.REQUEST;
}

const SQL_QUERY = `
query EwalletService($input:filterAppIdInput) {
    EwalletHistoryApp {
      AppHistoryServiceItem(input:$input){
        data{
          serviceName
          payment
          totalAmount
          totalTransaction
          appName
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload, appId: parseInt(payload?.appId) },
    });
    const listReport = data?.data?.EwalletHistoryApp?.AppHistoryServiceItem.data;
    callback && callback(true, listReport);
  } catch (error) {
    callback && callback(false, { message: 'Thất bại' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.APP_SERVICE_ITEM.REQUEST, doAction);
}
