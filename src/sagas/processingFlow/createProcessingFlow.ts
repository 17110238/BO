import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { CreateProcessingFlowInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<CreateProcessingFlowInput> {
  type?: typeof types.CREATE_PROCESSING_FLOW.REQUEST;
}

const SQL_QUERY = `mutation createProcessingFlow($input: CreateProcessingFlowsInput) {
  ProcessingFlow {
    Create(input: $input) {
      succeeded,
      message
    }
  }
}
`

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const processingFlow = data?.data?.ProcessingFlow?.Create;
    if (processingFlow) {
      yield put({
        type: types.CREATE_PROCESSING_FLOW.SUCCESS,
        payload: processingFlow?.data,
      });
      callback && callback(true, processingFlow ?? {});
    } else {
      yield put({
        type: types.CREATE_PROCESSING_FLOW.FAILURE,
      });

      callback && callback(false, processingFlow);
    }
  } catch (error) {
    console.log('error create processing flow : ', error);
    yield put({
      type: types.CREATE_PROCESSING_FLOW.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CREATE_PROCESSING_FLOW.REQUEST, doAction)
}
