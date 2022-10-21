
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaCustomerSupport extends SagaAction<any>{
    type?: typeof types.GET_LOG_CUSTOMER_SUPPORT.REQUEST;
}

const SQL_QUERY = `
query getLogs($input:GetSupportTicketLogInput!){
    SupportTicket {
      GetLog(input:$input) {
        message 
        succeeded
        data{
          id
          targetId
          ownerId
          ownerName
          content
          jsonContent
          attachImages
          createdAt
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { id:payload?.filter?.id,paging:payload?.paging },
    });
    const getLogsData = data?.data?.SupportTicket?.GetLog;
    if (getLogsData?.succeeded) {
        yield put({
            type: types.GET_LOG_CUSTOMER_SUPPORT.SUCCESS,
            // payload: getLogsData?.data,
        });
        callback && callback(true, getLogsData?.data);
    } else {
        yield put({
            type: types.GET_LOG_CUSTOMER_SUPPORT.FAILURE,
        });

        callback && callback(false, getLogsData?.message);
    }
    } catch (error) {
        yield put({
            type: types.GET_LOG_CUSTOMER_SUPPORT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LOG_CUSTOMER_SUPPORT.REQUEST, doAction);
}