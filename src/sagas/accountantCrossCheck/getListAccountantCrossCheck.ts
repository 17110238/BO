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
query getListCrossCheck($input: GetFiterCrossCheckInput){
    CrossCheck{
      GetCrossCheck(input:$input){
        data{
            crossCheckId
            transaction
            username
            merchantName
            receiveAccount {
                issuer
                accountNumber
                accountName
            }
            totalTransaction
            amount
            amountCrossCheck
            note
            description
            extraData {
                campaignId
                depositTransaction
                depositInfo
            }
            state
            type
            isTransferWeekend
            crossCheckNum
            paymentMethod
            crossCheckMethod
            createdAt
            approvedAt
            isTransferWeekend
            finishedAt
        },
        message
        succeeded
      }
    }
  }`

function*getListAccountantCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });

//         data:
// CrossCheck:
// GetCrossCheck: {data: Array(21), message: 'Lấy thông tin đối soát thành công', succeeded: true}
    const crossCheck = data?.data?.CrossCheck?.GetCrossCheck;

    if (crossCheck?.succeeded) {
        yield put({
        type: types.GET_LIST_ACOUNTANT_CROSS_CHECK.SUCCESS,
        payload: crossCheck?.data || [],
        });
        callback && callback(true, crossCheck?.data ?? {});
    } else {
        yield put({
            type: types.GET_LIST_ACOUNTANT_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck?.data ?? {});
    }
    } catch (error) {
        yield put({
            type: types.GET_LIST_ACOUNTANT_CROSS_CHECK.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_ACOUNTANT_CROSS_CHECK.REQUEST,getListAccountantCrossCheck);
}
