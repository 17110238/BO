import { callGraphql } from 'api/graphql';
import { PayloadRevenueMCFilterType } from 'components/RevenueStatistics/BoxSearchRevenueStatistics';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadRevenueMCFilterType> {
  type?: string;
}

const SQL_QUERY = `
    query getSumRevenueReport($input: GetMerchantIncomeInput){
      ReportMerchant{
        GetSumIncome(input: $input) {
            succeeded,
            message,
            data {
              totalMerchant
              total
              amount
              fee
              count
              crossCheckAmount
              crossCheckCount
            }

        }
      }
    }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const sumReports = data?.data?.ReportMerchant?.GetSumIncome;
    if (sumReports?.succeeded) {
      yield put({
        type: types.GET_SUM_REVENUE_STATISTICS.SUCCESS,
        payload: sumReports.data,
      });
      callback && callback(true, sumReports);
    } else {
      callback && callback(false, sumReports);
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_SUM_REVENUE_STATISTICS.REQUEST, doAction);
}
