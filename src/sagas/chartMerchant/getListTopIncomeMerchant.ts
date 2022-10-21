import { call, put, takeLatest } from "redux-saga/effects";
import * as types from "redux/types";
import { SagaAction } from "models";
import { FilterSearchAccountMc } from "models/account/accountMerchant";
import { callGraphql } from "api/graphql";
import { createUserType } from 'models/user/userState';


interface SagaSearch extends SagaAction<createUserType> {
  type?: typeof types.SEARCH_USER_MERCHANT.REQUEST;
}

const SQL_QUERY = `
query getTopIncomeMerchant($input: ReportInput){
    ReportMerchant{
        GetTopIncomeMerchant(input: $input) {
        succeeded
        message
        data {
            month,
            year,
            result{
              merchantId
            merchantTitle 
                count
                amount
                total
              }
          }
      }
    }
  }
`;

function* getTopIncomeMerchant({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
   
 
      input: { ...payload },
    });
    
    if (data?.data.ReportMerchant?.GetTopIncomeMerchant.succeeded ) {
      yield put({
          type: types.GET_TOP_INCOME_MERCHANT.SUCCESS,
          payload: data?.data.ReportMerchant?.GetTopIncomeMerchant.data,
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.GET_TOP_INCOME_MERCHANT.FAILURE,
      });

      callback && callback(false, data ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_TOP_INCOME_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TOP_INCOME_MERCHANT.REQUEST, getTopIncomeMerchant);
}
