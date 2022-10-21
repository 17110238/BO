import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_COMPANY.REQUEST;
}

const SQL_QUERY = `
  query GetListCompany{
    EwalletAccount{
      GetListCompany{
        data {
          id
          name
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
    const resData = data?.data?.EwalletAccount?.GetListCompany?.data;

    if (resData?.length > 0) {
      yield put({
        type: types.GET_LIST_COMPANY.SUCCESS,
        payload: resData,
      });
      callback && callback(true, resData ?? []);
    } else {
      yield put({
        type: types.GET_LIST_COMPANY.FAILURE,
      });

      callback && callback(false, resData ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_LIST_COMPANY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_COMPANY.REQUEST, doAction);
}