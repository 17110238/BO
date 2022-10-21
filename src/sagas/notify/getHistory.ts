import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/notifyTypes';
import { SagaAction, GetLogInput } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<GetLogInput> {
  type?: typeof types.GET_HISTORY.REQUEST;
}

const SQL_QUERY = `
  query GetHistory($input: GetLogInput!) {
    SendEmailSmsMerchant{
      GetLog(input: $input) {
        succeeded
        message,
        totalRow,
        data {
          createdAt,
          phone
          email
          campaign
          description
          state
          content
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
    const history = data?.data?.SendEmailSmsMerchant?.GetLog;

    if (history?.succeeded) {
      yield put({
        type: types.GET_HISTORY.SUCCESS,
        payload: history?.data,
      });
      callback && callback(true, history?.data ?? []);
    } else {
      yield put({
        type: types.GET_HISTORY.FAILURE,
      });

      callback && callback(false, history?.data ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_HISTORY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_HISTORY.REQUEST, doAction);
}
