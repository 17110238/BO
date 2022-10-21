import { callGraphql } from 'api/graphql';
import { MerchantFeeItem, SagaAction } from 'models';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MerchantFeeItem> {
  type?: typeof types.CREATE_MANUAL_CROSSCHECK_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation createSettlement($input:CreateManualCrosscheckInput!){
    Merchant{
      CreateManualCrosscheck(input: $input){
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

    const created = data?.data?.Merchant?.CreateManualCrosscheck;
    if (created?.succeeded) {
      callback && callback(true, created);
    } else {
      callback && callback(false, created);
    }
  } catch (error) {
    console.log('error saga: ', error);
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}

export default function* watchAction() {
  yield takeEvery(types.CREATE_MANUAL_CROSSCHECK_MERCHANT.REQUEST, doAction);
}
