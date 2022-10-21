import { CREATE_ACOUNTANT_CROSS_CHECK } from './../../redux/types/accountantTypes';
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
mutation CreateAccount($input: CreateCrossCheckInput!) {
    CrossCheck {
        CreateCrossCheck(input: $input) 
      {
        message
        succeeded
      }
    }
  }
  `

//   mutation createCrossCheck{
//     CrossCheck{
//       CreateCrossCheck(input:{
//         merchantId:22
//         amount:40000
//         methodList:["PAYME","Ví"]
//         description:"Bùng kèo nhưng không được"
//       }){
//         message
//         succeeded
//       }
//     }
//   }

function*createAccountantCrossCheck({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    });
    // data:
    // data:
    // CrossCheck:
    // CreateCrossCheck
    const crossCheck = data?.data?.CrossCheck?.CreateCrossCheck;
   
    if (crossCheck?.succeeded) {
        yield put({
        type: types.CREATE_ACOUNTANT_CROSS_CHECK.SUCCESS,
        });
        callback && callback(true, crossCheck);
    } else {
        yield put({
            type: types.CREATE_ACOUNTANT_CROSS_CHECK.FAILURE,
        });

        callback && callback(false, crossCheck ?? {});
    }
    } catch (error) {
        yield put({
            type: types.CREATE_ACOUNTANT_CROSS_CHECK.FAILURE,
        });
    }
}
export default function* watchAction() {
    yield takeLatest(types.CREATE_ACOUNTANT_CROSS_CHECK.REQUEST,createAccountantCrossCheck);
}
