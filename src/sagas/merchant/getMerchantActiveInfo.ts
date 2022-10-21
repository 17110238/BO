import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
  type?: typeof types.GET_MERCHANT_ACTIVE_INFO.REQUEST;
}

const SQL_QUERY = `
  query getChangedInfo($input: GetChangedInfoInput!){
    RequestChange {
      GetMerchantActiveInfo (input: $input) {
        merchantId
        title
        isActive
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const changedInfo = data?.data?.RequestChange?.GetMerchantActiveInfo;
    if (changedInfo) {
      yield put({
        type: types.GET_MERCHANT_ACTIVE_INFO.SUCCESS,
        payload: changedInfo,
      });
      callback && callback(true, changedInfo || {});
    } else {
      yield put({
        type: types.GET_MERCHANT_ACTIVE_INFO.FAILURE,
      });

      callback && callback(false, changedInfo || {});
    }
  } catch (error) {
    yield put({
      type: types.GET_MERCHANT_ACTIVE_INFO.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_ACTIVE_INFO.REQUEST, doAction);
}
