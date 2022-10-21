import { callGraphql } from 'api/graphql';
import { PayloadRejectMerchant, RejectPendingRequestInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<RejectPendingRequestInput> {
  type?: typeof types.REJECT_PENDING_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation RejectMc($input:RejectRequestInput!) {
    RequestChange {
      RejectRequest (input: $input) {
        message
        succeeded
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const rejected = data?.data?.RequestChange?.RejectRequest;
    if (rejected?.succeeded) {
      yield put({
        type: types.REJECT_PENDING_MERCHANT.SUCCESS,
        payload: rejected?.message,
      });
      callback && callback(true, rejected);
    } else {
      yield put({
        type: types.REJECT_PENDING_MERCHANT.FAILURE,
      });

      callback && callback(false, rejected);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.REJECT_PENDING_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REJECT_PENDING_MERCHANT.REQUEST, doAction);
}
