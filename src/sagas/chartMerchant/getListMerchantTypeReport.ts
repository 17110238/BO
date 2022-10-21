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
query getMerchantTypeReport($input: ReportInput){
    ReportMerchant{
        GetMerchantTypeReport(input: $input) {
        succeeded
        message
        data {
            merchantType,
            result {
                month,
                count,
                amount
            }
        }
      }
    }
  }
`;
function* getMerchantTypeReport({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
   
      input: { ...payload },
    });
    if (data?.data.ReportMerchant?.GetMerchantTypeReport.succeeded ) {
      yield put({
          type: types.GET_MERCHANT_TYPE_REPORT.SUCCESS,
          payload: data?.data.ReportMerchant?.GetMerchantTypeReport.data,
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.GET_MERCHANT_TYPE_REPORT.FAILURE,
      });

      callback && callback(false, data ?? {});
    }
  } catch (error) {
    console.log("error GETMC saga: ", error);
    yield put({
      type: types.GET_MERCHANT_TYPE_REPORT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_TYPE_REPORT.REQUEST, getMerchantTypeReport);
}
