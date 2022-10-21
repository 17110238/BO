import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_PAYMENT_METHOD_LIST.REQUEST;
}

const SQL_QUERY = `query {
  Utility{
    PaymentMethodList{
      message
      succeeded
      data{
        id
        name
        description
        paymentType
        subPaymentType
        payCode
        payMethod
        identifyCode
        path
        parentIdentifyCode
        iconUrl
      }
    }
  }
}
  `;

function* searchMC({ callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {});
    const methods = data?.data?.Utility?.PaymentMethodList;

    if (methods?.succeeded) {
      yield put({
        type: types.GET_PAYMENT_METHOD_LIST.SUCCESS,
        payload: methods?.data,
      });
      callback && callback(true, methods?.data ?? {});
    } else {
      yield put({
        type: types.GET_PAYMENT_METHOD_LIST.FAILURE,
      });

      callback && callback(false, methods);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.GET_PAYMENT_METHOD_LIST.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_PAYMENT_METHOD_LIST.REQUEST, searchMC);
}
