import { callGraphql } from 'api/graphql';
import { GetAppInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetAppInfoInput> {
  type?: typeof types.GET_APP_INFO_LIST.REQUEST;
}

const SQL_QUERY = `
  query getAppInfo($input: GetAppInfoInput){
    Utility {
        GetAppInfo (input: $input) {
        message
        succeeded
        data{
          store{
            name
            id
            merchantId
          }
          tags{
            key
            value
          }
          services{
            key
            value
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

    const getAppInfo = data?.data?.Utility?.GetAppInfo;

    if (getAppInfo?.succeeded) {
      yield put({
        type: types.GET_APP_INFO_LIST.SUCCESS,
        payload: getAppInfo?.data,
      });
      callback && callback(true, getAppInfo?.data ?? {});
    } else {
      yield put({
        type: types.GET_APP_INFO_LIST.FAILURE,
      });

      callback && callback(false, getAppInfo);
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    yield put({
      type: types.GET_APP_INFO_LIST.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_APP_INFO_LIST.REQUEST, doAction);
}
