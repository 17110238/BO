

import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.GET_DATA_DASHBOARD_TICKET.REQUEST;
}

const SQL_QUERY = `
query getDataDashBoardTicket($input:GetDashboardTicketInput!){
    SupportTicket{
      Dashboard(input:$input) {
        succeeded
        message
          data {
          merchantName
          merchantId
          ticketId
          email
          title
          content
          state
          assignTarget
            accountInfo {
            id
            name
          }
          ticketImages
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
        input: { ...payload.filter },
    });
    const listDashBoradTicket = data?.data?.SupportTicket?.Dashboard;
    if (listDashBoradTicket?.succeeded) {
        yield put({
            type: types.GET_DATA_DASHBOARD_TICKET.SUCCESS,
            payload: listDashBoradTicket?.data,
        });
        callback && callback(true, listDashBoradTicket?.data);
    } else {
        yield put({
            type: types.GET_DATA_DASHBOARD_TICKET.FAILURE,
        });

        callback && callback(false, listDashBoradTicket?.data);
    }
    } catch (error) {
        yield put({
            type: types.GET_DATA_DASHBOARD_TICKET.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_DATA_DASHBOARD_TICKET.REQUEST, doAction);
}