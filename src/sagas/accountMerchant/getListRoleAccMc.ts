import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
    type?: typeof types.GET_LIST_ROLE_ACCOUNT_MC.REQUEST;
}

const SQL_QUERY = `
query ListRoles {
    AccountMerchant {
        ListRoleAccMc {
        message
        succeeded
        data {
            key
            name
        }
    }
    }
}
`;

function* getListRolesAccMc({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload }
    });
    
    const accountMerchant = data?.data?.AccountMerchant?.ListRoleAccMc;

    if (accountMerchant?.succeeded) {
        yield put({
        type: types.GET_LIST_ROLE_ACCOUNT_MC.SUCCESS,
        payload: accountMerchant?.data,
        });
        callback && callback(true, accountMerchant?.data ?? {});
    } else {
        yield put({
            type: types.GET_LIST_ROLE_ACCOUNT_MC.FAILURE,
        });

        callback && callback(false, accountMerchant?.data ?? {});
    }
    } catch (error) {
        yield put({
            type: types.GET_LIST_ROLE_ACCOUNT_MC.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_ROLE_ACCOUNT_MC.REQUEST, getListRolesAccMc);
}
