import { callGraphql } from 'api/graphql';
import { MerchantFeeItem, SagaAction } from 'models';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MerchantFeeItem> {
  type?: typeof types.DISABLE_MAIL_SETTLEMENT_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation disableMailSettlement($input:NotifyStopCrosscheckInput!){
    Merchant{
      NotifyStopCrosscheck(input: $input){
        message
        succeeded
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    delete payload?.paymentMethodName;
    const { data, code } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const updated = data?.data?.Merchant?.NotifyStopCrosscheck;
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
  yield takeEvery(types.DISABLE_MAIL_SETTLEMENT_MERCHANT.REQUEST, doAction);
}
