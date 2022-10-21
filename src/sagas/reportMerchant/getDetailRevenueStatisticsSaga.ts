import { callGraphql } from 'api/graphql';
import { PayloadDetailMerchantRevenue, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadDetailMerchantRevenue> {
  type?: string;
}

const SQL_QUERY = `
      query getDetailReportMerchant($input: GetDetailMerchantIncomeInput!){
        ReportMerchant{
          GetDetailMerchantIncome(input: $input) {
              succeeded,
              message,
              data {
                method
                total
                amount
                fee
                count
                succeededCount
                canceledCount
                refundedCount
                succeededAmount
                canceledAmount
                refundedAmount
                succeededTotal
                succeededFee
                refundedTotal
                refundedFee
                canceledTotal
                canceledFee
                crossCheckFee
                crossCheckTotal
                crossCheckCount
                crossCheckAmount
              }
              total{
                total
                amount
                fee
                count
                succeededCount
                succeededAmount
                succeededTotal
                succeededFee
                refundedCount
                refundedAmount
                refundedTotal
                refundedFee
                crossCheckAmount
                crossCheckFee
                crossCheckTotal
                crossCheckCount
                canceledCount
                canceledAmount
                canceledTotal
                canceledFee
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
    const details = data?.data?.ReportMerchant?.GetDetailMerchantIncome;
    if (details?.succeeded) {
      callback && callback(true, details);
    } else {
      callback && callback(false, { data: [], total: {} });
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DETAIL_REVENUE_STATISTICS.REQUEST, doAction);
}
