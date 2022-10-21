import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import { FilterSearchAccountMc, PasswordTemporaryInput, UpdateAccMcInput } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

// interface SagaSearch extends SagaAction<FilterSearchAccountMc> {
//     type?: typeof types.SEARCH_ACCOUNT_MERCHANT.REQUEST;
// }

interface SagaUpdate extends SagaAction<PasswordTemporaryInput>{
    type?: typeof types.PASSWORD_TEMPORARY_ACC_MC.REQUEST;
}

const SQL_QUERY = `
    mutation PasswordTemporary($input : PasswordTemporaryInput) {
        AccountMerchant {
            PasswordTemporary(input : $input){
                message
                succeeded
                password
            }
        }
    }
`;

function* UpdateAccountMc({ payload, callback }: SagaUpdate) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const accountMerchant = data.data.AccountMerchant?.PasswordTemporary;

    if (accountMerchant?.succeeded) {
        yield put({
            type: types.PASSWORD_TEMPORARY_ACC_MC.SUCCESS,
            payload: accountMerchant?.password,
        });
        callback && callback(true, accountMerchant);
    } else {
        yield put({
            type: types.PASSWORD_TEMPORARY_ACC_MC.FAILURE,
        });

        callback && callback(false, accountMerchant);
    }
    } catch (error) {
        yield put({
            type: types.PASSWORD_TEMPORARY_ACC_MC.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.PASSWORD_TEMPORARY_ACC_MC.REQUEST, UpdateAccountMc);
}