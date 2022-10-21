
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
    type?: typeof types.GET_LIST_ACOUNTANT_CROSS_CHECK.REQUEST;
}
const SQL_QUERY = `
    mutation BoContinuePauseCrossCheck($input: BoCancelInput!){
    CrossCheck{
        BoContinueCrossCheck(input: $input){
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
function*ContinuePauseCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });
       
    const crossCheck = data?.data?.CrossCheck?.BoContinueCrossCheck;
   
    if (crossCheck?.succeeded) {
        yield put({
        type: types.BO_CONTINUE_PAUSE_CROSS_CHECK.SUCCESS,
        });
        callback && callback(true, crossCheck ?? {});
    } else {
        yield put({
            type: types.BO_CONTINUE_PAUSE_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck ?? {});
    }
    } catch (error) {
        yield put({
            type: types.BO_CONTINUE_PAUSE_CROSS_CHECK.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.BO_CONTINUE_PAUSE_CROSS_CHECK.REQUEST,ContinuePauseCrossCheck);
}
