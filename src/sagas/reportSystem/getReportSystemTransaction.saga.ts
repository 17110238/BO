import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.REPORT_SYSTEM_TRANSACTION.REQUEST;
}

const SQL_QUERY = `
query REPORT_SYSTEM_TRANSACTION($input:ReportSystemTransactionInput!) {
    ReportMerchant{
      ReportSystemTransaction(
        input: $input
      ) {
        data {
          date
          totalBalance
          amountTotal
          total
          feeTotal
          merchantFeeTotal
          transactionTotal
          refundedAmountTotal
          refundedTransactionTotal
          canceledTransactionTotal
          failedTransactionTotal
          expiredTransactionTotal
          waitingCrosscheckAmountTotal
          crossCheckAmountTotal
        }
        sumData {
          sumTotal
          sumAmountTotal
          sumFeeTotal
          sumMerchantFeeTotal
          sumTransactionTotal
          sumRefundedAmountTotal
          sumCanceledTransactionTotal
          sumRefundedTransactionTotal
          sumFailedTransactionTotal
          sumExpiredTransactionTotal
          sumWaitingCrosscheckAmountTotal
          sumCrossCheckAmountTotal
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
    const dataReportSystem = data?.data?.ReportMerchant?.ReportSystemTransaction;
    if (dataReportSystem) {
      callback && callback(true, dataReportSystem);
    } else {
      callback && callback(false, dataReportSystem);
    }
  } catch (error) {
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.REPORT_SYSTEM_TRANSACTION.REQUEST, doAction);
}
