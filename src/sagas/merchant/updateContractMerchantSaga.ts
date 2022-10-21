import { callGraphql } from 'api/graphql';
import { MerchantAccount, MerchantFeeItem, SagaAction } from 'models';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MerchantFeeItem> {
  type?: typeof types.UPDATE_CONTRACT_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation updateContractMC($input:UpdateContractInput!){
    Merchant{
      UpdateContract(input:$input){
        message
        succeeded
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    delete payload?.paymentMethodName;
    const { data, errors } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const updated = data?.data?.Merchant?.UpdateFeeMc;
    if (updated?.succeeded) {
      callback && callback(true, updated);
    } else {
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}

export default function* watchAction() {
  yield takeEvery(types.UPDATE_CONTRACT_MERCHANT.REQUEST, doAction);
}
