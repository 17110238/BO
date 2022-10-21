import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../redux/types/manualBankTypes';
import { GetEwalletPaymentsInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<GetEwalletPaymentsInput> {
  type?: typeof types.GET_LIST_MANUAL_BANK_DEPOSIT.REQUEST;
}

const SQL_QUERY = `
  query getListManualBankDeposit($input:GetEwalletPaymentsInput!) {
    EwalletPaymentBo {
        GetList(input:$input){
            id
            bankId
            transaction
            username
            total
            account
            bankName
            description
            reason
            state
            bankTransaction
            createdAt
      }
    }
  }
`;

function* getList({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const manualDeposit = data.data.EwalletPaymentBo.GetList;
    if (Array.isArray(manualDeposit)) {
      yield put({
        type: types.GET_LIST_MANUAL_BANK_DEPOSIT.SUCCESS,
        payload: manualDeposit,
      });
      callback && callback(true, manualDeposit);
    } else {
      yield put({
        type: types.GET_LIST_MANUAL_BANK_DEPOSIT.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get list manual deposit saga: ', error);
    yield put({
      type: types.GET_LIST_MANUAL_BANK_DEPOSIT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_MANUAL_BANK_DEPOSIT.REQUEST, getList);
}
