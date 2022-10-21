import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaCustomerSupport extends SagaAction<any> {
  type?: typeof types.GET_SUPPORT_STAFF.REQUEST;
}

const SQL_QUERY = `
query getSupportStaff {
    SupportTicket{
      GetSupportStaff 
    }
  }
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY);
    const dataSStaff = data?.data?.SupportTicket?.GetSupportStaff;
    if (dataSStaff) {
      yield put({
        type: types.GET_SUPPORT_STAFF.SUCCESS,
      
      });
      callback && callback(true, dataSStaff);
    } else {
      yield put({
        type: types.GET_SUPPORT_STAFF.FAILURE,
      });

      callback && callback(false, dataSStaff);
    }
  } catch (error) {
    yield put({
      type: types.GET_SUPPORT_STAFF.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_SUPPORT_STAFF.REQUEST, doAction);
}
