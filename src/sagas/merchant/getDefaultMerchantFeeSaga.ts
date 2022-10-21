import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_DEFAULT_MERCHANT_FEE_CONFIG.REQUEST;
}

const SQL_QUERY = `query GetDefaultFee {
      Utility{
        PaymentFeeDefault{
          message
          succeeded
          data{
            ecommerceFeeList{
              paymentMethodId
              paymentMethodName
              gatewayFee
              fixedGatewayFee
              transactionFee
              fixedTransactionFee
            }
          }
        }
        PoboFeeDefault{
          message
          succeeded
          data{
            poboFeeList{
              paymentMethodId
              paymentMethodName
              gatewayFee
              fixedGatewayFee
              transactionFee
              fixedTransactionFee
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

    const utility = data?.data?.Utility;

    if (utility.PaymentFeeDefault.succeeded && utility.PoboFeeDefault.succeeded) {
      yield put({
        type: types.GET_DEFAULT_MERCHANT_FEE_CONFIG.SUCCESS,
        payload: {
          ecommerceFeeList: utility.PaymentFeeDefault.data.ecommerceFeeList,
          poboFeeList: utility.PoboFeeDefault.data.poboFeeList,
        },
      });
      callback && callback(true, utility);
    } else {
      yield put({
        type: types.GET_DEFAULT_MERCHANT_FEE_CONFIG.FAILURE,
      });

      callback && callback(false, data?.errors[0]);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.GET_DEFAULT_MERCHANT_FEE_CONFIG.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DEFAULT_MERCHANT_FEE_CONFIG.REQUEST, doAction);
}
