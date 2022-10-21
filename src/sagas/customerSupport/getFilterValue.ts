import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaCustomerSupport extends SagaAction<any> {
  type?: typeof types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.REQUEST;
}

const SQL_QUERY = `
query getFilterValueData {
    SupportTicket{
      GetFilterValue 
    }
  }
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY);
    const dataFilter = data?.data?.SupportTicket?.GetFilterValue;
    if (dataFilter) {
      yield put({
        type: types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.SUCCESS,
        payload: JSON.parse(dataFilter),
      });
      callback && callback(true, JSON.parse(dataFilter));
    } else {
      yield put({
        type: types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.FAILURE,
      });

      callback && callback(false, dataFilter);
    }
  } catch (error) {
    yield put({
      type: types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_FILTER_VALUE_CUSTOMER_SUPPORT.REQUEST, doAction);
}
