import { GET_LIST_ACOUNTANT_CROSS_CHECK } from '../../redux/types/accountantTypes';
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
mutation crossCheckTransfer($input: TranferCrossCheckInput!) {
    CrossCheck{
    BoTranferCrossCheck(input:$input){
      message
      succeeded
    }
    }
  }
  `
function*TransferCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });
    const crossCheck = data?.data?.CrossCheck?.BoTranferCrossCheck;
    if (crossCheck?.succeeded) {
        yield put({
        type: types.BO_TRANSFER_CROSS_CHECK.SUCCESS,
        });
        callback && callback(true, crossCheck ?? {});
    } else {
        yield put({
            type: types.BO_TRANSFER_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck ?? {});
    }
    } catch (error) {
        yield put({
            type: types.BO_TRANSFER_CROSS_CHECK.FAILURE,
        });
        callback && callback(false,{});
    }
}

export default function* watchAction() {
    yield takeLatest(types.BO_TRANSFER_CROSS_CHECK.REQUEST,TransferCrossCheck);
}
