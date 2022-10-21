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
    mutation BoCancelCrossCheck($input: BoCancelInput!){
    CrossCheck{
        BoCancelCrossCheck(input: $input){
        message
        succeeded  
      }
    }
  }
  `
//   mutation Boreject{
//     CrossCheck{
//       BoRejectCrossCheck(input:{
//         campaignId:"130511"
//         approvedAccountId:5789587639
        
//       }){
//         succeeded,
//         message
//       }
//     }
//   }
function*CancelCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });
      
    const crossCheck = data?.data?.CrossCheck?.BoCancelCrossCheck;
   
    if (crossCheck?.succeeded) {
        yield put({
        type: types.BO_CANCEL_CROSS_CHECK.SUCCESS,
        });
        callback && callback(true, crossCheck ?? {});
    } else {
        yield put({
            type: types.BO_CANCEL_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck ?? {});
    }
    } catch (error) {
        yield put({
            type: types.BO_CANCEL_CROSS_CHECK.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.BO_CANCEL_CROSS_CHECK.REQUEST,CancelCrossCheck);
}
