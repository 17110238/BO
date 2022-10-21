import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { CreateMerchantInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<CreateMerchantInput>{
    type? : typeof types.CREATE_ACCOUNT_MERCHANT.REQUEST
}


const SQL_QUERY = `
  mutation CreateMerchant($input: CreateMerchantInput!) {
    Merchant{
      CreateMerchant(input : $input){
        message
        succeeded
      }
    }  
  }`;


function* doAction({payload, callback} : SagaSearch){
  try{
    console.log('payload', payload)
    const {data} = yield call<any>(callGraphql, SQL_QUERY, {
      input : { ... payload}
    })
    const accountMerchant = data.data.Merchant.CreateMerchant
    if (accountMerchant?.succeeded) {
      yield put({
          type: types.CREATE_ACCOUNT_MERCHANT.SUCCESS,
          payload: accountMerchant,
      });
      callback && callback(true, accountMerchant);
    } else {
      yield put({
          type: types.CREATE_ACCOUNT_MERCHANT.FAILURE,
      });

      callback && callback(false, accountMerchant);
    }
  }catch(err){
    yield put({
      type: types.CREATE_ACCOUNT_MERCHANT.FAILURE,
  });
  }
}


export default function* watchAction(){
  yield takeLatest(types.CREATE_ACCOUNT_MERCHANT.REQUEST, doAction)
}