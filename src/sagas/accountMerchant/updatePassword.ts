import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import { ChangePassAccMcInput} from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaUpdate extends SagaAction<ChangePassAccMcInput>{
    type?: typeof types.UPDATE_PASSWORD_MC.REQUEST;
}

const SQL_QUERY = `
    mutation ChangePassAccountMc($input : ChangePassAccMcInput) {
        AccountMerchant {
            ChangePassAccMc(input : $input){
                message
                succeeded
            }
        }
    }
`;

function* updatePassword({ payload, callback }: SagaUpdate) {
    try {
    console.log('payload', payload)
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const accountMerchant = data.data.AccountMerchant?.ChangePassAccMc;

    if (accountMerchant?.succeeded) {
        yield put({
            type: types.UPDATE_PASSWORD_MC.SUCCESS,
            payload: accountMerchant?.password,
        });
        callback && callback(true, accountMerchant);
    } else {
        yield put({
            type: types.UPDATE_PASSWORD_MC.FAILURE,
        });

        callback && callback(false, accountMerchant);
    }
    } catch (error) {
        yield put({
            type: types.UPDATE_PASSWORD_MC.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UPDATE_PASSWORD_MC.REQUEST, updatePassword);
}