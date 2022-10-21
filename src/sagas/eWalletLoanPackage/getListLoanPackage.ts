import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaCustomerSupport extends SagaAction<any> {
  type?: typeof types.GET_WALLET_LOAN_PACKAGE.REQUEST;
}

const SQL_QUERY = `
query getLoanPackage($input:GetListServiceFastLoanBoInput!) {
    EwalletFastLoanBo {
      GetList(input:$input) {
        id,
        accountId,
        fullname,
        phone,
        email,
        termTitle,
        supplierInfo {
          title
        },
        amount,
        createdAt,
        updatedAt,
        state
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaCustomerSupport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const listLoanPackage = data?.data?.EwalletFastLoanBo?.GetList;
    if (Array.isArray(listLoanPackage)) {
      yield put({
        type: types.GET_WALLET_LOAN_PACKAGE.SUCCESS,
        payload: listLoanPackage,
      });
      callback && callback(true, listLoanPackage);
    } else {
      yield put({
        type: types.GET_WALLET_LOAN_PACKAGE.FAILURE,
      });
      callback && callback(false, []);
    }
  } catch (error) {
    yield put({
      type: types.GET_WALLET_LOAN_PACKAGE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_WALLET_LOAN_PACKAGE.REQUEST, doAction);
}
