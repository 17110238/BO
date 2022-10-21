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
    mutation approveCrossCheck($input: UpdateApprovedInput!){
    CrossCheck{
        UpdateApprovedProcess(input: $input){
        message
        succeeded  
      }
    }
  }
  `
function* approveCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });
    const crossCheck = data?.data?.CrossCheck?.UpdateApprovedProcess;
    if (crossCheck?.succeeded) {
        yield put({
        type: types.APPROVE_CROSS_CHECK.SUCCESS,
        payload: crossCheck,
        });
        callback && callback(true, crossCheck ?? {});
    } else {
        yield put({
            type: types.APPROVE_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck ?? {});
    }
    } catch (error) {
        yield put({
            type: types.APPROVE_CROSS_CHECK.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.APPROVE_CROSS_CHECK.REQUEST,approveCrossCheck);
}
