import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { GetProcessingFlowsInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetProcessingFlowsInput> {
  type?: typeof types.GET_LIST_PROCESSING_FLOW.REQUEST;
}

const SQL_QUERY = `query getProcessingFlow($input: GetProcessingFlowsInput!) {
  ProcessingFlow {
    GetProcessingFlows(input: $input) {
      totalRow
      data {
        eventId,
        eventName,
        processList {
          telegram
          state
          group
          order
          email
          user {
            username
            fullname
            accountId
            phone
          }
        }
      }
    }
  }
}
`

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const pendingList = data?.data?.ProcessingFlow?.GetProcessingFlows;
    if (pendingList) {
      yield put({
        type: types.GET_LIST_PROCESSING_FLOW.SUCCESS,
        payload: pendingList?.data,
      });
      callback && callback(true, pendingList ?? {});
    } else {
      yield put({
        type: types.GET_LIST_PROCESSING_FLOW.FAILURE,
      });

      callback && callback(false, pendingList);
    }
  } catch (error) {
    console.log('error get processing flow list: ', error);
    yield put({
      type: types.GET_LIST_PROCESSING_FLOW.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_PROCESSING_FLOW.REQUEST, doAction)
}
