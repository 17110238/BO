import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaCustomerSupport extends SagaAction<any> {
  type?: typeof types.UPDATE_WALLET_LOAN_PACKAGE.REQUEST;
}

const SQL_QUERY = `
mutation updateLoanPackage($input:UpdateFastLoanBoInput!){
	EwalletFastLoanBo {
        Update(input:$input){
            message
            succeeded
        }
    }
}
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const updateLoanPackage = data?.data?.EwalletFastLoanBo?.Update;
    if (updateLoanPackage.succeeded) {
      yield put({
        type: types.UPDATE_WALLET_LOAN_PACKAGE.SUCCESS,
        payload: updateLoanPackage,
      });
      callback && callback(true, updateLoanPackage);
    } else {
      yield put({
        type: types.UPDATE_WALLET_LOAN_PACKAGE.FAILURE,
      });
      callback && callback(false, updateLoanPackage);
    }
  } catch (error) {
    yield put({
      type: types.UPDATE_WALLET_LOAN_PACKAGE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_WALLET_LOAN_PACKAGE.REQUEST, doAction);
}
