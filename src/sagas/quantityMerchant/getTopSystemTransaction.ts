import { getListTransaction } from 'redux/actions';
import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
    type?: typeof types.GET_LIST_REPORT_SYSTEM_TRANSACTION.REQUEST;
}
// query REPORT_AGENT($input: ReportAgentInput!){
//     ReportMerchant {
//         ReportAgent (input: $input) {
//             data {
//                 date
//                 mcNewRegister
//                 mcApproved
//                 mcRejected
//                 mcBlocked
//                 mcActive
//                 mcActiveIndividual
//                 mcActiveEnterprise
//                 mcHasTransaction
//                 numberOfTransactions
//               }
//               sumData {
//                 totalMcNewRegister
//                 totalMcApproved
//                 totalMcRejected
//                 totalMcBlocked
//                 totalNumberOfTransactions
//               }
//       }
//     }
//   }
const SQL_QUERY = `query REPORT_SYSTEM_TRANSACTION ($input:ReportSystemTransactionInput!) {
    ReportMerchant {
      ReportSystemTransaction (input:$input){
        data {
          date
          amountTotal
          total
          totalBalance
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

        const getListTransaction = data?.data?.ReportMerchant?.ReportSystemTransaction;
        if (Array.isArray(getListTransaction.data)) {
            yield put({
                type: types.GET_LIST_REPORT_SYSTEM_TRANSACTION.SUCCESS,
                payload: getListTransaction,
            });
            callback && callback(true, getListTransaction);
        } else {
            yield put({
                type: types.GET_LIST_REPORT_SYSTEM_TRANSACTION.FAILURE,
            });
            callback && callback(false, getListTransaction);
        }
    } catch (error) {
        console.log('error get changed message info: ', error);
        yield put({
            type: types.GET_LIST_REPORT_SYSTEM_TRANSACTION.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_REPORT_SYSTEM_TRANSACTION.REQUEST, doAction);
}
