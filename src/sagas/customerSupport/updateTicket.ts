
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.UPDATE_TICKET.REQUEST;
}

const SQL_QUERY = `
mutation update($input:UpdateSupportTicketInput!){
    SupportTicket{
      UpdateSupportTicket(input:$input) {
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
    const updateData = data?.data?.SupportTicket?.UpdateSupportTicket;
    if (updateData?.succeeded) {
        yield put({
            type: types.UPDATE_TICKET.SUCCESS,
      
        });
        callback && callback(true, updateData);
    } else {
        yield put({
            type: types.UPDATE_TICKET.FAILURE,
        });

        callback && callback(false, updateData);
    }
    } catch (error) {
        yield put({
            type: types.UPDATE_TICKET.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UPDATE_TICKET.REQUEST, doAction);
}