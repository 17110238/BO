
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaUpdate extends SagaAction<any>{
    type?: typeof types.ADD_RELY_DASHBOARD_TICKET.REQUEST;
}

const SQL_QUERY = `
mutation addReplyTicket($input:AddReplyInput!) {
    SupportTicket {
      AddReply(input:$input) {
   
        succeeded
        message
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaUpdate) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const addReplyTicket = data?.data?.SupportTicket?.AddReply;
    if (addReplyTicket?.succeeded) {
        yield put({
            type: types.ADD_RELY_DASHBOARD_TICKET.SUCCESS,
        });
        callback && callback(true, addReplyTicket);
    } else {
        yield put({
            type: types.ADD_RELY_DASHBOARD_TICKET.FAILURE,
        });

        callback && callback(false, addReplyTicket);
    }
    } catch (error) {
        yield put({
            type: types.ADD_RELY_DASHBOARD_TICKET.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.ADD_RELY_DASHBOARD_TICKET.REQUEST, doAction);
}