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
    mutation completeCrossCheck($input: BoCompleteInput!){
    CrossCheck{
        BoCompleteCrossCheck(input: $input){
        message
        succeeded  
      }
    }
  }
  `
//   mutation completeCrossCheck{
//     CrossCheck{
//       BoCompleteCrossCheck(input:{
//         crossCheckId:2894
//         approvedAccountId:5789587639
//         withdrawTransaction:"HK2732323SSD"
        
//       }){
//         succeeded
//         message
//       }
      
//     }
//   }
function*completeCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });
       // yield put({  type:types.BO_COMPLETE_CROSS_CHECK.REQUEST,})
        
    const crossCheck = data?.data?.CrossCheck?.BoCompleteCrossCheck;
    if (crossCheck?.succeeded) {
        yield put({
        type: types.BO_COMPLETE_CROSS_CHECK.SUCCESS,
        payload: crossCheck,
        });
        callback && callback(true, crossCheck ?? {});
    } else {
        yield put({
            type: types.BO_COMPLETE_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck?.data ?? {});
    }
    } catch (error) {
        yield put({
            type: types.BO_COMPLETE_CROSS_CHECK.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.BO_COMPLETE_CROSS_CHECK.REQUEST,completeCrossCheck);
}
