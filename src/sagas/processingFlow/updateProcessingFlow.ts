import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { UpdateProcessingFlowInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<UpdateProcessingFlowInput> {
  type?: typeof types.UPDATE_PROCESSING_FLOW.REQUEST;
}

const SQL_QUERY = `mutation updateProcessingFlow($input: UpdateProcessingFlowsInput) {
  ProcessingFlow {
    Update(input: $input) {
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
    const processingFlow = data?.data?.ProcessingFlow?.Update;
    if (processingFlow) {
      yield put({
        type: types.UPDATE_PROCESSING_FLOW.SUCCESS,
        payload: processingFlow?.data,
      });
      callback && callback(true, processingFlow ?? {});
    } else {
      yield put({
        type: types.UPDATE_PROCESSING_FLOW.FAILURE,
      });

      callback && callback(false, processingFlow);
    }
  } catch (error) {
    console.log('error create processing flow : ', error);
    yield put({
      type: types.UPDATE_PROCESSING_FLOW.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_PROCESSING_FLOW.REQUEST, doAction)
}
