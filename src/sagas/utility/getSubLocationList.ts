import { callGraphql } from 'api/graphql';
import { FilterSearchParams, SagaAction } from 'models';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_SUB_LOCATION_LIST.REQUEST;
}

const SQL_QUERY = `query getSubLocation($input: SearchLocationInput!){
        Location{
          Search(input: $input){
            data{
              id
              identifyCode
              path
              title
              parentIdentifyCode
              parentPath {
                identifyCode
                path
                title
              }
            }
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const locations = data?.data?.Location?.Search;

    if (locations?.data.length) {
      yield put({
        type: types.GET_SUB_LOCATION_LIST.SUCCESS,
        payload: locations?.data,
      });
      callback && callback(true, locations ?? {});
    } else {
      yield put({
        type: types.GET_SUB_LOCATION_LIST.FAILURE,
      });

      callback && callback(false, locations);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    yield put({
      type: types.GET_SUB_LOCATION_LIST.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeEvery(types.GET_SUB_LOCATION_LIST.REQUEST, doAction);
}
