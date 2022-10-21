import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterLogTransactionFeeInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterLogTransactionFeeInput> {
  type?: typeof types.GET_TRANSACTION_FEE_LOG.REQUEST;
}

const SQL_QUERY = `
query getLogTransactionFee ($input: FilterLogTransactionFeeInput){
    LogTransactionFee{
        GetLogTransactionFee(input:$input){
            data{
                paymentMethodId
                merchantId
                username
                fullname
                gateway
                type
                description
                images
                createdAt
                jsonBeforeParams{
                  gateway
                  fixedGateway
                  transaction
                  fixedTransaction
                },
                jsonAfterParams{
                  gateway
                  fixedGateway
                  transaction
                  fixedTransaction
                }
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
    const feeLog = data?.data?.LogTransactionFee?.GetLogTransactionFee?.data;
    if (Array.isArray(feeLog)) {
      callback && callback(true, feeLog);
    } else {
      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    callback?.(false, { message: 'Lỗi kết nối Server' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TRANSACTION_FEE_LOG.REQUEST, doAction);
}
