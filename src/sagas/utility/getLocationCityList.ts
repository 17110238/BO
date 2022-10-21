import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_LOCATION_CITY_LIST.REQUEST;
}

const SQL_QUERY = `query getLocationCityList($input: SearchLocationInput!){
        Location{
          Search(input: $input){
            data{
              id
              identifyCode
              path
              title
              parentIdentifyCode
            }
          }
        }
      }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const cities = data?.data?.Location?.Search;

    if (cities?.data.length) {
      yield put({
        type: types.GET_LOCATION_CITY_LIST.SUCCESS,
        payload: cities?.data,
      });
      callback && callback(true, cities ?? {});
    } else {
      yield put({
        type: types.GET_LOCATION_CITY_LIST.FAILURE,
      });

      callback && callback(false, cities);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    yield put({
      type: types.GET_LOCATION_CITY_LIST.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LOCATION_CITY_LIST.REQUEST, doAction);
}
