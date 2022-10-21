

import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.GET_DATA_RELY_TICKET.REQUEST;
}

const SQL_QUERY = `
query getListReplyTicket($input:GetReplyInput!) {
    SupportTicket{
      GetReply(input:$input) {
        succeeded
        message
         data {
          content
            accountInfo {
            id
            name
            avatar
          }
          replyId
        
          images
          merchantId
          ticketId
          accountInternalId
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
    const listDataReplyTicket = data?.data?.SupportTicket?.GetReply;
    if (listDataReplyTicket?.succeeded) {
        yield put({
            type: types.GET_DATA_RELY_TICKET.SUCCESS,
            payload: listDataReplyTicket?.data,
        });
        callback && callback(true, listDataReplyTicket?.data);
    } else {
        yield put({
            type: types.GET_DATA_RELY_TICKET.FAILURE,
        });

        callback && callback(false, listDataReplyTicket?.data);
    }
    } catch (error) {
        yield put({
            type: types.GET_DATA_RELY_TICKET.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_DATA_RELY_TICKET.REQUEST, doAction);
}