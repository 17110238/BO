
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.GET_LIST_CUSTOMER_SUPPORT.REQUEST;
}

const SQL_QUERY = `
query getListCustomer($input : GetSupportTicketInput!){
    SupportTicket{
      GetSupportTicket(input : $input) {
          succeeded
          message
          data {
              id
              contactPhone
              customerPhone
              customerEmail
              ticketType
              summary
              content
              feedbackContent
              status
              assignTarget
              supportStaff
              otherImages
              createdAt
              updatedAt
              remindCount
              referId
              ticketKey
              contentEmail
              level
              category
              method
              classify
          }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const listDataCustomer = data?.data?.SupportTicket?.GetSupportTicket;
    if (listDataCustomer?.succeeded) {
        yield put({
            type: types.GET_LIST_CUSTOMER_SUPPORT.SUCCESS,
            payload: listDataCustomer?.data,
        });
        callback && callback(true, listDataCustomer?.data);
    } else {
        yield put({
            type: types.GET_LIST_CUSTOMER_SUPPORT.FAILURE,
        });

        callback && callback(false, listDataCustomer?.data);
    }
    } catch (error) {
        yield put({
            type: types.GET_LIST_CUSTOMER_SUPPORT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_CUSTOMER_SUPPORT.REQUEST, doAction);
}