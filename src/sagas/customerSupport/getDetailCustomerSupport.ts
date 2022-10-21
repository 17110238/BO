
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.GET_DETAIL_CUSTOMER_SUPPORT.REQUEST;
}

const SQL_QUERY = `
query getDeTailListCustomer($input : GetSupportTicketInput!){
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
              classify
              method
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
    const listDetailDataCustomer = data?.data?.SupportTicket?.GetSupportTicket;
    if (listDetailDataCustomer?.succeeded) {
        yield put({
            type: types.GET_DETAIL_CUSTOMER_SUPPORT.SUCCESS,
            payload: listDetailDataCustomer?.data,
        });
        callback && callback(true, listDetailDataCustomer?.data);
    } else {
        yield put({
            type: types.GET_DETAIL_CUSTOMER_SUPPORT.FAILURE,
        });

        callback && callback(false, listDetailDataCustomer?.data);
    }
    } catch (error) {
        yield put({
            type: types.GET_DETAIL_CUSTOMER_SUPPORT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_DETAIL_CUSTOMER_SUPPORT.REQUEST, doAction);
}