import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
  type?: typeof types.GET_CHANGED_INFO_FEE.REQUEST;
}

const SQL_QUERY = `
  query getChangedFee($input: GetChangedInfoInput!){
    RequestChange {
      GetChangedFee (input: $input) {
        message
        succeeded
        noteInfo {
          images
          description
        }
        data {
          method
          data {
            type
            changedInfo {
              path
              before
              after
            }
          }
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
    const changedInfo = data?.data?.RequestChange?.GetChangedFee;
    if (changedInfo?.succeeded) {
      yield put({
        type: types.GET_CHANGED_INFO_FEE.SUCCESS,
        payload: changedInfo?.data,
      });
      callback && callback(true, changedInfo);
    } else {
      yield put({
        type: types.GET_CHANGED_INFO_FEE.FAILURE,
      });

      callback && callback(false, changedInfo);
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    yield put({
      type: types.GET_CHANGED_INFO_FEE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_CHANGED_INFO_FEE.REQUEST, doAction);
}
