import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_MERCHANT_FEE_CONFIG.REQUEST;
}

const SQL_QUERY = `query GetMerchantFeeConfig($input: MerchantFeeInput) {
      Merchant{
        MerchantFee(input:$input){
          data{
            ecommerceFeeList{
              paymentMethodId
              paymentMethodName
              gatewayFee{
                isDefault
                value
              }
              fixedGatewayFee{
                isDefault
                value
              }
              transactionFee{
                isDefault
                value
              }
              fixedTransactionFee{
                isDefault
                value
              }
            }
            poboFeeList{
              paymentMethodId
              paymentMethodName
              gatewayFee{
                isDefault
                value
              }
              fixedGatewayFee{
                isDefault
                value
              }
              transactionFee{
                isDefault
                value
              }
              fixedTransactionFee{
                isDefault
                value
              }
            }
            noteInfo{
              description
              images
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

    const merchant = data?.data?.Merchant?.MerchantFee;

    if (Object.keys(merchant?.data).length) {
      yield put({
        type: types.GET_MERCHANT_FEE_CONFIG.SUCCESS,
        payload: merchant?.data,
      });
      callback && callback(true, merchant);
    } else {
      yield put({
        type: types.GET_MERCHANT_FEE_CONFIG.FAILURE,
      });

      callback && callback(false, data?.errors[0]);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.GET_MERCHANT_FEE_CONFIG.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_FEE_CONFIG.REQUEST, doAction);
}
