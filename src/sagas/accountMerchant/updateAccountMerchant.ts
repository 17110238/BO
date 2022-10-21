import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import { FilterSearchAccountMc, UpdateAccMcInput } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

// interface SagaSearch extends SagaAction<FilterSearchAccountMc> {
//     type?: typeof types.SEARCH_ACCOUNT_MERCHANT.REQUEST;
// }

interface SagaUpdate extends SagaAction<UpdateAccMcInput>{
    type?: typeof types.UPDATE_ACCOUNT_MERCHANT.REQUEST;
}

const SQL_QUERY = `
    mutation UpdateAccountMc($input : UpdateAccMcInput!) {
        AccountMerchant {
            UpdateAccMc(input : $input){
                message
                succeeded
            }
        }
    }
`;

function* UpdateAccountMc({ payload, callback }: SagaUpdate) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const accountMerchant = data?.data?.AccountMerchant?.UpdateAccMc;
        if (accountMerchant?.succeeded) {
            yield put({
            type: types.UPDATE_ACCOUNT_MERCHANT.SUCCESS,
            payload: accountMerchant,
            });
            callback && callback(true, data);
        } else {
            yield put({
                type: types.UPDATE_ACCOUNT_MERCHANT.FAILURE,
            });

            callback && callback(false, data);
        }
    } catch (error) {
        console.log('error searchMC saga: ', error);
        yield put({
            type: types.UPDATE_ACCOUNT_MERCHANT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UPDATE_ACCOUNT_MERCHANT.REQUEST, UpdateAccountMc);
}
