import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../redux/types/manualBankTypes';
import { CreateEwalletPaymentBoInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<CreateEwalletPaymentBoInput> {
    type?: typeof types.UPDATE_BANK_TRANSFER_TRANSACTION.REQUEST
}

const SQL_QUERY = `
  mutation updateBankTransaction($input: CreateEwalletPaymentBoInput!) {
    EwalletPaymentBo{
        Create(input : $input){
        message
        succeeded
      }
    }  
  }`;

function* updateBankTransaction({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload }
        })
        const bankTransfer = data.data.EwalletPaymentBo.Create
        if (bankTransfer?.succeeded) {
            yield put({
                type: types.UPDATE_BANK_TRANSFER_TRANSACTION.SUCCESS,
            });
            callback && callback(true, bankTransfer);
        } else {
            yield put({
                type: types.UPDATE_BANK_TRANSFER_TRANSACTION.FAILURE,
            });

            callback && callback(false, bankTransfer);
        }
    } catch (err) {
        yield put({
            type: types.UPDATE_BANK_TRANSFER_TRANSACTION.FAILURE,
        });
    }
}


export default function* watchAction() {
    yield takeLatest(types.UPDATE_BANK_TRANSFER_TRANSACTION.REQUEST, updateBankTransaction)
}