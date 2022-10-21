import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
  type?: typeof types.GET_CHANGE_STATE_COBO_POBO.REQUEST;
}

const SQL_QUERY = `
  query getChangeStateCoboPobo($input: GetChangedInfoInput!){
    RequestChange {
      GetChangedStateCoboPobo (input: $input) {
        succeeded
        message
        transaction
        data {
          path
          before
          after
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
    const changedInfo = data?.data?.RequestChange?.GetChangedStateCoboPobo;
    if (changedInfo?.succeeded) {
      yield put({
        type: types.GET_CHANGE_STATE_COBO_POBO.SUCCESS,
        payload: changedInfo,
      });
      callback && callback(true, changedInfo);
    } else {
      yield put({
        type: types.GET_CHANGE_STATE_COBO_POBO.FAILURE,
      });

      callback && callback(false, changedInfo);
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    yield put({
      type: types.GET_CHANGE_STATE_COBO_POBO.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_CHANGE_STATE_COBO_POBO.REQUEST, doAction);
}
