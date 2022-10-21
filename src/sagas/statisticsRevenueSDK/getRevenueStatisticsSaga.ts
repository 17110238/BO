import { callGraphql } from 'api/graphql';
import { SagaAction, SearchRevenuePayload } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<SearchRevenuePayload> {
  type?: string;
}

const SQL_QUERY = `
    query getRevenueReport($input: GetMerchantIncomeInput!){
      ReportMerchant{
        ReportSDKIncome(input: $input) {
          merchantId,
          appName,
          totalPayment,
          fee,
          count,
          crossCheckAmount,
          crossCheckCount
        }
        GetSumSDKIncome(input: $input) {
          totalPayment,
          fee,
          count,
          crossCheckAmount,
          crossCheckCount
        }
      }
    }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const statistics = data?.data?.ReportMerchant?.ReportSDKIncome;
    const totalStatistics = data?.data?.ReportMerchant?.GetSumSDKIncome;

    if (!!statistics && Array.isArray(statistics) && statistics.length > 0) {
      if (totalStatistics) {
        callback &&
          callback(true, {
            list: statistics,
            sum: totalStatistics,
          });
      } else {
        callback &&
          callback(false, {
            list: [],
            sum: null,
          });
      }
    } else {
      callback &&
        callback(false, {
          list: [],
          sum: null,
        });
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REVENUE_STATISTICS_SDK.REQUEST, doAction);
}
