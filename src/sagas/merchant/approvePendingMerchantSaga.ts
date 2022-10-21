import { callGraphql } from 'api/graphql';
import { AprrovedPendingRequestInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<AprrovedPendingRequestInput> {
  type?: typeof types.APPROVE_PENDING_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation ApproveMc($input: ApproveRequestInput!){
    RequestChange {
      ApproveRequest (input: $input) {
        message
        succeeded
      }
    }
  }`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const aprroved = data?.data?.RequestChange?.ApproveRequest;
    if (aprroved?.succeeded) {
      yield put({
        type: types.APPROVE_PENDING_MERCHANT.SUCCESS,
        payload: aprroved?.message,
      });
      callback && callback(true, aprroved);
    } else {
      yield put({
        type: types.APPROVE_PENDING_MERCHANT.FAILURE,
      });

      callback && callback(false, aprroved);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.APPROVE_PENDING_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.APPROVE_PENDING_MERCHANT.REQUEST, doAction);
}
