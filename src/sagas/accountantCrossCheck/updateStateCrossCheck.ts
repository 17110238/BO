import { GET_LIST_ACOUNTANT_CROSS_CHECK } from './../../redux/types/accountantTypes';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
    type?: typeof types.GET_LIST_ACOUNTANT_CROSS_CHECK.REQUEST;
}
const SQL_QUERY = `
    mutation updateState($input: UpdateStateInput!){
    CrossCheck{
        UpdateStateCrossCheck(input: $input){
        message
        succeeded  
        campaignId
        }
    }
}
`
function*updateStateCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });
    yield put({
        type: types.UPDATE_STATE_CROSS_CHECK.SUCCESS,
        });
    const crossCheck = data?.data?.CrossCheck?.UpdateStateCrossCheck;
    if (crossCheck?.succeeded) {
        yield put({
        type: types.UPDATE_STATE_CROSS_CHECK.SUCCESS,
        payload: crossCheck,
        });
        callback && callback(true, crossCheck ?? {});
    } else {
        yield put({
            type: types.UPDATE_STATE_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck ?? {});
    }
    } catch (error) {
        yield put({
            type: types.UPDATE_STATE_CROSS_CHECK.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UPDATE_STATE_CROSS_CHECK.REQUEST,updateStateCrossCheck);
}
