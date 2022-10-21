import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';

import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_MERCHANT_REPORT_CROSS_CHECK.REQUEST;
}

const SQL_QUERY = `
query getMerchantReportCrossCheck($input: FilterMerchantReportCrossCheckInput!){
    CrossCheck{
      GetMerchantReportCrossCheck(input:$input){
        data{
          paymentList{
            method
            issuer{
              name
            }
            supplier {
              name
            }
            supplierTransaction
            paymentId
            amount
            fee
            total
            state
            description
            transactionId
            partnerTransaction
            createdAt
            finishedAt
            merchantName
            storeName
            methodName
          }
          transferedReport {
            count
            amount
            fee
            total
            merchantId
            paymentPartner
          }
          currentReport {
            paymentRefunded{
              count
              amount
              fee
              total
            }
            paymentSucceeded{
              methodName
              count
              amount
              fee
              total
            }
          }
          beginBalanceData{
            count
            amount
            fee
            total
            merchantId
            paymentPartner
          }
          finalBalanceData{
            count
            amount
            fee
            total
            merchantId
            paymentPartner
          }
          currentReportIncrease {
            count
            amount
            fee
            total
            merchantId
            paymentPartner
          }
          currentReportBalance {
            count
            amount
            fee
            total
            merchantId
            paymentPartner
          }
        }
      }
    }
  }`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const crossCheck = data?.data?.CrossCheck?.GetMerchantReportCrossCheck?.data;

    if (crossCheck.hasOwnProperty('paymentList') && crossCheck.hasOwnProperty('transferedReport') && crossCheck.hasOwnProperty('finalBalanceData') && crossCheck.hasOwnProperty('beginBalanceData') && crossCheck.hasOwnProperty('currentReport')) {
      yield put({
        type: types.GET_MERCHANT_REPORT_CROSS_CHECK.SUCCESS,
        payload: crossCheck,
      });
      callback && callback(true, crossCheck ?? {});
    } else {
      yield put({
        type: types.GET_MERCHANT_REPORT_CROSS_CHECK.FAILURE,
      });

      callback && callback(false, crossCheck ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_MERCHANT_REPORT_CROSS_CHECK.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_REPORT_CROSS_CHECK.REQUEST, doAction);
}
