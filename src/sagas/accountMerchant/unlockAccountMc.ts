import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import { FilterSearchAccountMc, PasswordTemporaryInput, UnlockAccMcInput, UpdateAccMcInput } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaUpdate extends SagaAction<UnlockAccMcInput>{
    type?: typeof types.UNLOCK_ACCOUNT_MC.REQUEST;
}

const SQL_QUERY = `
        mutation UnlockAccountMc($input : UnlockAccMcInput ) {
            AccountMerchant {
                UnlockAccMc(input : $input){
                message
                succeeded
                }
            }
        }
`;

function* unlockAccountMc({ payload, callback }: SagaUpdate) {
    try {

    console.log('payload', payload)
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const accountMerchant = data.data.AccountMerchant?.UnlockAccMc;

    if (accountMerchant?.succeeded) {
        yield put({
            type: types.UNLOCK_ACCOUNT_MC.SUCCESS,
            payload: accountMerchant,
        });
        callback && callback(true, accountMerchant);
    } else {
        yield put({
            type: types.UNLOCK_ACCOUNT_MC.FAILURE,
        });

        callback && callback(false, accountMerchant);
    }
    } catch (error) {
        yield put({
            type: types.UNLOCK_ACCOUNT_MC.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UNLOCK_ACCOUNT_MC.REQUEST, unlockAccountMc);
}