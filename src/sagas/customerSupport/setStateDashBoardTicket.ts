
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.SET_STATE_TICKET.REQUEST;
}

const SQL_QUERY = `
mutation setStateTicket($input: SetStateInput!) {
    SupportTicket{
      SetState(input: $input) {
          succeeded
          message
         
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const updateData = data?.data?.SupportTicket?.SetState;
    if (updateData?.succeeded) {
        yield put({
            type: types.SET_STATE_TICKET.SUCCESS,
      
        });
        callback && callback(true, updateData);
    } else {
        yield put({
            type: types.SET_STATE_TICKET.FAILURE,
        });

        callback && callback(false, updateData);
    }
    } catch (error) {
        yield put({
            type: types.SET_STATE_TICKET.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.SET_STATE_TICKET.REQUEST, doAction);
}