import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetRequestChangeInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<GetRequestChangeInput> {
  type?: typeof types.GET_TOTAL_PENDING_MERCHANT.REQUEST;
}

const SQL_QUERY = `query getChangeRequest($input: GetRequestChangeInput!) {
    RequestChange {
      GetRequestChange(input: $input) {
        message
        succeeded
        data {
          id
        }
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const merchantPendingList = data?.data?.RequestChange?.GetRequestChange;
    if (merchantPendingList) {
      yield put({
        type: types.GET_TOTAL_PENDING_MERCHANT.SUCCESS,
        payload: merchantPendingList?.data?.length,
      });
      callback && callback(true, merchantPendingList ?? {});
    } else {
      yield put({
        type: types.GET_TOTAL_PENDING_MERCHANT.FAILURE,
      });

      callback && callback(false, merchantPendingList);
    }
  } catch (error) {
    yield put({
      type: types.GET_TOTAL_PENDING_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TOTAL_PENDING_MERCHANT.REQUEST, doAction);
}
