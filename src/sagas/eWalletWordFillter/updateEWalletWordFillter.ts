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
mutation updateWordFillter($input:UpdateEwalletWordfilterInput!){
    EwalletWordfilter{
        Update(input:$input){   
            message
            succeeded
         }
       
     }
  } `

 


function*updateEWalletFillter({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    }); 
   
    const eWalletWordFillter = data?.data?.EwalletWordfilter?.Update;

    if (eWalletWordFillter?.succeeded) {
        yield put({
        type: types.UPDATE_EWALLET_WORD_FILLTER.SUCCESS,
        });
        callback && callback(true, eWalletWordFillter ?? {});
    } else {
        yield put({
            type: types.UPDATE_EWALLET_WORD_FILLTER.FAILURE,
        });

        callback && callback(false, eWalletWordFillter ?? {});
    }
    } catch (error) {
        yield put({
            type: types.UPDATE_EWALLET_WORD_FILLTER.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.UPDATE_EWALLET_WORD_FILLTER.REQUEST,updateEWalletFillter);
}
