
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaUpdate extends SagaAction<any>{
    type?: typeof types.GET_ASSIGN_TARGET.REQUEST;
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
        input: { ...payload.filter },
    });
    const dataCreateTicket = data?.data?.SupportTicket?.CreateSupportTicket;
    if (dataCreateTicket?.succeeded) {
        yield put({
            type: types.GET_ASSIGN_TARGET.SUCCESS,
        });
        callback && callback(true, dataCreateTicket);
    } else {
        yield put({
            type: types.GET_ASSIGN_TARGET.FAILURE,
        });

        callback && callback(false, dataCreateTicket);
    }
    } catch (error) {
        yield put({
            type: types.GET_ASSIGN_TARGET.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_ASSIGN_TARGET.REQUEST, doAction);
}