import { ReportInput } from './../../models/index';
//import { CreateUser } from 'components/User/CreateUser';

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
query GetPayments($input: ReportInput){
    ReportMerchant{
      GetMerchantsReport(input: $input) {
        succeeded
        message
        data {
            month
            total
            newMerchants
            activeMerchants
          }
      }
    }
  }
`;

function* getReportMerchant({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
   
      input: { ...payload },
    });
    if (data?.data.ReportMerchant?.GetMerchantsReport.succeeded ) {
      yield put({
          type: types.GET_MERCHANTS_REPORT.SUCCESS,
          payload: data?.data.ReportMerchant?.GetMerchantsReport.data,
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.GET_MERCHANTS_REPORT.FAILURE,
      });

      callback && callback(false, data ?? {});
    }
  } catch (error) {
    console.log("error GETMC saga: ", error);
    yield put({
      type: types.GET_MERCHANTS_REPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANTS_REPORT.REQUEST, getReportMerchant);
}
