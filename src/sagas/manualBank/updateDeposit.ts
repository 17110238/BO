import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../redux/types/manualBankTypes';
import { UpdateEwalletDepositBankBoInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<UpdateEwalletDepositBankBoInput> {
    type?: typeof types.UPDATE_BANK_DEPOSIT.REQUEST
}

const SQL_QUERY = `
  mutation updateBankDeposit($input: UpdateEwalletDepositBankBoInput!) {
    EwalletPaymentBo{
        UpdateDepositBank(input : $input){
        message
        succeeded
      }
    }  
  }`;

function* updateDeposit({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload }
        })
        const depositBank = data.data.EwalletPaymentBo.UpdateDepositBank
        if (depositBank?.succeeded) {
            yield put({
                type: types.UPDATE_BANK_DEPOSIT.SUCCESS,
            });
            callback && callback(true, depositBank);
        } else {
            yield put({
                type: types.UPDATE_BANK_DEPOSIT.FAILURE,
            });

            callback && callback(false, depositBank);
        }
    } catch (err) {
        yield put({
            type: types.UPDATE_BANK_DEPOSIT.FAILURE,
        });
    }
}


export default function* watchAction() {
    yield takeLatest(types.UPDATE_BANK_DEPOSIT.REQUEST, updateDeposit)
}