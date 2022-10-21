import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
  type?: typeof types.REQUEST_CHANGED_MESSAGE.REQUEST;
}

const SQL_QUERY = `
  query GetSendMailDetail($input: GetChangedInfoInput!){
    RequestChange {
      GetSendMailDetail (input: $input) {
        message
        succeeded
        data {
          content
          title
          accountList
          customer
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
    const changedInfo = data?.data?.RequestChange?.GetSendMailDetail;
    if (changedInfo?.succeeded) {
      yield put({
        type: types.REQUEST_CHANGED_MESSAGE.SUCCESS,
        payload: changedInfo?.data,
      });
      callback && callback(true, changedInfo);
    } else {
      yield put({
        type: types.REQUEST_CHANGED_MESSAGE.FAILURE,
      });

      callback && callback(false, changedInfo);
    }
  } catch (error) {
    console.log('error get changed message info: ', error);
    yield put({
      type: types.REQUEST_CHANGED_MESSAGE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_CHANGED_MESSAGE.REQUEST, doAction);
}
