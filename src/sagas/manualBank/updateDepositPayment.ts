import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../redux/types/manualBankTypes';
import { UpdateEwalletDepositPaymentInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<UpdateEwalletDepositPaymentInput> {
    type?: typeof types.UPDATE_BANK_PAYMENT.REQUEST
}

const SQL_QUERY = `
  mutation updateBankPayment($input: UpdateEwalletDepositPaymentInput!) {
    EwalletPaymentBo{
        Update(input : $input){
        message
        succeeded
      }
    }  
  }`;

function* update({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload }
        })
        const bankPayment = data.data.EwalletPaymentBo.Update
        if (bankPayment?.succeeded) {
            yield put({
                type: types.UPDATE_BANK_PAYMENT.SUCCESS,
            });
            callback && callback(true, bankPayment);
        } else {
            yield put({
                type: types.UPDATE_BANK_PAYMENT.FAILURE,
            });

            callback && callback(false, bankPayment);
        }
    } catch (err) {
        yield put({
            type: types.UPDATE_BANK_PAYMENT.FAILURE,
        });
    }
}


export default function* watchAction() {
    yield takeLatest(types.UPDATE_BANK_PAYMENT.REQUEST, update)
}