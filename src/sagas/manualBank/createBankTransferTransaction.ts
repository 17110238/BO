import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../redux/types/manualBankTypes';
import { CreateEwalletPaymentBoInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<CreateEwalletPaymentBoInput> {
  type?: typeof types.CREATE_BANK_TRANSFER_TRANSACTION.REQUEST
}

const SQL_QUERY = `
  mutation createBankTransferTransaction($input: CreateEwalletPaymentBoInput!) {
    EwalletPaymentBo{
        Create(input : $input){
        message
        succeeded
      }
    }  
  }`;

function* createBankTransferTransaction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    })
    const bankTransfer = data.data.EwalletPaymentBo.Create
    if (bankTransfer?.succeeded) {
      callback && callback(true, bankTransfer);
    } else {
      callback && callback(false, bankTransfer);
    }
  } catch (err) {
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}


export default function* watchAction() {
  yield takeLatest(types.CREATE_BANK_TRANSFER_TRANSACTION.REQUEST, createBankTransferTransaction)
}