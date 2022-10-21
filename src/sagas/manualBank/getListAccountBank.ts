import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as types from '../../redux/types/manualBankTypes';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_ACCOUNT_BANK.REQUEST;
}

const SQL_QUERY = `
  query accountBanks($input:GetDepositBanksInput) {
    EwalletPaymentBo {
      GetDepositBanks(input:$input){
        id
        fullName
        number
        city
        bankName
        branch
        totalDeposit
        balance
        isActive
      }
    }
  }
`;

function* getListAccount({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: payload,
    });
    const listAccount = data.data.EwalletPaymentBo.GetDepositBanks;
    if (Array.isArray(listAccount)) {
      yield put({
        type: types.GET_LIST_ACCOUNT_BANK.SUCCESS,
        payload: listAccount,
      });
      callback && callback(true, listAccount);
    } else {
      yield put({
        type: types.GET_LIST_ACCOUNT_BANK.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.GET_LIST_ACCOUNT_BANK.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_ACCOUNT_BANK.REQUEST, getListAccount);
}
