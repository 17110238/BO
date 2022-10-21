

import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.GET_LIST_E_WALLET_HISTORY_LOGIN.REQUEST;
}

const SQL_QUERY = `
query getSearchSessionLoginHistory($input:SearchSessionsInput) {
    EwalletAccount{
      SearchSessions(input:$input) {
        message
        succeeded
        data {
          id
          userId
          appName
          clientId
          userAgent
          clientVersion
          loginTime
          logoutTime
          ip
          os
          clientChannel
          createdAt
          updatedAt
          
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const listDataHistoryLogin = data?.data?.EwalletAccount?.SearchSessions;
    if (listDataHistoryLogin?.succeeded) {
        yield put({
            type: types.GET_LIST_E_WALLET_HISTORY_LOGIN.SUCCESS,
            payload: listDataHistoryLogin?.data,
        });
        callback && callback(true, listDataHistoryLogin?.data);
    } else {
        yield put({
            type: types.GET_LIST_E_WALLET_HISTORY_LOGIN.FAILURE,
        });

        callback && callback(false, listDataHistoryLogin?.data);
    }
    } catch (error) {
        yield put({
            type: types.GET_LIST_E_WALLET_HISTORY_LOGIN.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_E_WALLET_HISTORY_LOGIN.REQUEST, doAction);
}