import { callGraphql } from 'api/graphql';
import { MerchantAccount, OperatorType, SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MerchantAccount> {
  type?: typeof types.REQUEST_UPDATE_INFO.REQUEST;
}

const SQL_QUERY = `
  mutation requestUpdateInfo($input:UpdateMcInput!){
    Merchant{
      RequestUpdateMc (input: $input) {
        message
        succeeded
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const newFormatPaymentMethodExtend = payload?.paymentMethodExtend?.map((ele) => ({
      ...ele,
      extraData: ele?.extraData || { isTransferNow: false },
    }));

    const input =
      payload?.paymentMethod || payload?.paymentMethodExtend
        ? {
            ...payload,
            paymentMethodExtend: JSON.stringify(newFormatPaymentMethodExtend) || '',
            paymentMethod: payload?.paymentMethod?.map((ele) => ele.referId),
          }
        : { ...payload };
    input.operator = payload?.operator?.map((sale) => (sale as OperatorType)?.accountId);

    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input,
    });
    const updated = data?.data?.Merchant?.RequestUpdateMc;
    if (updated?.succeeded) {
      callback && callback(true, updated);
    } else {
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_UPDATE_INFO.REQUEST, doAction);
}
