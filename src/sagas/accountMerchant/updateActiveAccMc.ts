import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import {UpdateActiveAccMcInput } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaUpdate extends SagaAction<UpdateActiveAccMcInput>{
    type?: typeof types.UPDATE_ACTIVE_ACCOUNT_MC.REQUEST;
}

const SQL_QUERY = `
    mutation UpdateActive($input : UpdateActiveAccMcInput) {
        AccountMerchant {
            UpdateActiveAccMc(input : $input){
                message
                succeeded
            }
        }
    }
`;

function* updateActiveAccountMc({ payload, callback }: SagaUpdate) {
    try {

    console.log('payload', payload)
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const accountMerchant = data.data.AccountMerchant?.UpdateActiveAccMc;

    if (accountMerchant?.succeeded) {
        yield put({
            type: types.UPDATE_ACTIVE_ACCOUNT_MC.SUCCESS,
        });
        callback && callback(true, accountMerchant);
    } else {
        yield put({
            type: types.UPDATE_ACTIVE_ACCOUNT_MC.FAILURE,
        });

        callback && callback(false, accountMerchant);
    }
    } catch (error) {
        yield put({
            type: types.UPDATE_ACTIVE_ACCOUNT_MC.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UPDATE_ACTIVE_ACCOUNT_MC.REQUEST, updateActiveAccountMc);
}