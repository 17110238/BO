import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query {
  Utility {
    GetPaymentMethods {
      paymentMethod {
        payCode
        name
      }
      supplier
      issuer
    }
  }
}
`;

function* doAction({ callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {});
    const methods = data?.data?.Utility?.GetPaymentMethods;

    if (methods) {
      yield put({
        type: types.GET_PAYMENT_METHOD_FULL_TYPE.SUCCESS,
        payload: methods,
      });
      callback && callback(true, methods ?? {});
    } else {
      yield put({
        type: types.GET_PAYMENT_METHOD_FULL_TYPE.FAILURE,
      });

      callback && callback(false, methods);
    }
  } catch (error) {
    console.log('error get payment method saga: ', error);
    yield put({
      type: types.GET_PAYMENT_METHOD_FULL_TYPE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_PAYMENT_METHOD_FULL_TYPE.REQUEST, doAction);
}
