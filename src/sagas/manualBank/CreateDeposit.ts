import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../redux/types/manualBankTypes';
import { CreateDepositBankInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<CreateDepositBankInput> {
  type?: typeof types.CREATE_DEPOSIT_BANK.REQUEST
}

const SQL_QUERY = `
  mutation createDepositBank($input: CreateDepositBankInput!) {
    EwalletPaymentBo{
        CreateDepositBank(input : $input){
        message
        succeeded
      }
    }  
  }`;


function* CreateDeposit({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    })
    const bankDeposit = data.data.EwalletPaymentBo.CreateDepositBank
    if (bankDeposit?.succeeded) {
      callback && callback(true, bankDeposit);
    } else {
      callback && callback(false, bankDeposit);
    }
  } catch (err) {
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CREATE_DEPOSIT_BANK.REQUEST, CreateDeposit)
}