import { callGraphql } from 'api/graphql';
import { MerchantDefaultFeeItem, SagaAction } from 'models';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MerchantDefaultFeeItem[]> {
  type?: string;
}

const SQL_QUERY = `
    mutation updateEcommerceFeeDefault($input:[UpdatePaymentFeeInput]){
      Utility{
        UpdatePaymentFeeDefault(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: payload });
    const fees = data?.data?.Utility?.UpdatePaymentFeeDefault;

    if (fees?.succeeded) {
      callback && callback(true, fees ?? {});
    } else {
      callback && callback(false, fees);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeEvery(types.UPDATE_ECOMMERCE_FEE_DEFAULT.REQUEST, doAction);
}
