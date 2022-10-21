import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_SUPPLIER_MANAGE.REQUEST;
}

const SQL_QUERY = `query Search{
  Supplier {
    Search {
      message
      succeeded
      data {
        id
        supplierName
        issuerList {
          supplierId
          issuerName
          methodName
          payCode
        }
        shortName
        displayName
        logo
        description
        isActive
        createdAt
      }
    }
  }
}`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY);

    const transaction = data?.data?.Supplier?.Search;
    // console.log('ádsadasdasdasdasdsadasdas', data.data);

    if (transaction) {
      yield put({
        type: types.GET_LIST_SUPPLIER_MANAGE.SUCCESS,
        payload: transaction?.data,
      });
      callback && callback(true, transaction?.data ?? {});
    } else {
      yield put({
        type: types.GET_LIST_SUPPLIER_MANAGE.FAILURE,
      });
      callback && callback(false, transaction);
    }
  } catch (error) {
    yield put({
      type: types.GET_LIST_SUPPLIER_MANAGE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_SUPPLIER_MANAGE.REQUEST, doAction);
}
