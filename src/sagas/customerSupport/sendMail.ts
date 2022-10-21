
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.SEND_EMAIL_CUSTOMER_SUPPORT.REQUEST;
}

const SQL_QUERY = `
mutation sendMail($input: SendSupportMailInput!) {
    SupportTicket{
      SendMail(input:$input) {
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
    const sendMailData = data?.data?.SupportTicket?.SendMail;
    if (sendMailData?.succeeded) {
        yield put({
            type: types.SEND_EMAIL_CUSTOMER_SUPPORT.SUCCESS,
           
        });
        callback && callback(true, sendMailData);
    } else {
        yield put({
            type: types.SEND_EMAIL_CUSTOMER_SUPPORT.FAILURE,
        });

        callback && callback(false, sendMailData);
    }
    } catch (error) {
        yield put({
            type: types.SEND_EMAIL_CUSTOMER_SUPPORT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.SEND_EMAIL_CUSTOMER_SUPPORT.REQUEST, doAction);
}