
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaUpdate extends SagaAction<any>{
    type?: typeof types.ADD_TICKET.REQUEST;
}

const SQL_QUERY = `
mutation createSupportTicket($input :CreateSupportTicketInput!) {
    SupportTicket {
      CreateSupportTicket(input:$input) {
        message
        succeeded
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaUpdate) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const dataCreateTicket = data?.data?.SupportTicket?.CreateSupportTicket;
    if (dataCreateTicket?.succeeded) {
        yield put({
            type: types.ADD_TICKET.SUCCESS,
        });
        callback && callback(true, dataCreateTicket);
    } else {
        yield put({
            type: types.ADD_TICKET.FAILURE,
        });

        callback && callback(false, dataCreateTicket);
    }
    } catch (error) {
        yield put({
            type: types.ADD_TICKET.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.ADD_TICKET.REQUEST, doAction);
}