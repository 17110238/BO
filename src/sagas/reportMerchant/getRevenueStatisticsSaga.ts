import { callGraphql } from 'api/graphql';
import { PayloadSearchMerchantRevenue, SagaAction } from 'models';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadSearchMerchantRevenue> {
  type?: string;
}

const SQL_QUERY = `
    query getRevenueReport($input: GetMerchantIncomeInput!, $sumInput: GetMerchantIncomeInput){
      ReportMerchant{
        GetMerchantIncome(input: $input) {
            succeeded,
            message,
            data {
              merchantId,
              title,
              count,
              email
              totalTopup,
              totalPayment,
              fee,
              crossCheckAmount
              crossCheckFee
              crossCheckTotal
              crossCheckCount
            }
        }
        GetSumIncome(input: $sumInput) {
          succeeded,
          message,
          data {
            totalMerchant
            totalTopup,
            totalPayment,
            fee
            count
            crossCheckAmount
            crossCheckCount
            crossCheckTotal
          }
        }
      }
    }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
      sumInput: {
        ...payload,
        paging: { start: payload?.paging?.start, limit: payload?.paging?.limit! - 1 },
      },
    });
    const reports = data?.data?.ReportMerchant?.GetMerchantIncome;
    const sumReports = data?.data?.ReportMerchant?.GetSumIncome;

    if (reports?.succeeded) {
      yield delay(500);
      yield put({
        type: types.GET_REVENUE_STATISTICS.SUCCESS,
        payload: reports?.data,
      });
      yield put({
        type: types.GET_SUM_REVENUE_STATISTICS.SUCCESS,
        payload: sumReports.data,
      });
      callback && callback(true, reports);
    } else {
      yield put({
        type: types.GET_REVENUE_STATISTICS.FAILURE,
      });
      callback && callback(false, reports);
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REVENUE_STATISTICS.REQUEST, doAction);
}
