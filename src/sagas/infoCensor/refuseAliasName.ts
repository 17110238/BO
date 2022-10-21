import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { SagaAction, ProfileAliasInput } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<ProfileAliasInput> {
    type?: typeof types.REFUSE_ALIASNAME.REQUEST;
}

const SQL_QUERY = `
    mutation refuseAliasName($input: ProfileAliasInput!) {
        EwalletAccount {
            ProfileAlias(input: $input) {
            message
            succeeded
        }
    }
}
`
function* refuseAliasName({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload }
        });
        const res = data?.data?.EwalletAccount?.ProfileAlias;
        if (res?.succeeded) {
            yield put({
                type: types.REFUSE_ALIASNAME.SUCCESS,
            });
            callback && callback(true, res ?? {});
        } else {
            yield put({
                type: types.REFUSE_ALIASNAME.FAILURE,
            });

            callback && callback(false, res);
        }
    } catch (error) {
        yield put({
            type: types.REFUSE_ALIASNAME.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.REFUSE_ALIASNAME.REQUEST, refuseAliasName)
}
