import { callGraphql } from 'api/graphql';
import { MerchantAccount, OperatorType, SagaAction } from 'models';
import { element } from 'prop-types';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { sample } from 'rxjs';

interface SagaSearch extends SagaAction<MerchantAccount> {
  type?: typeof types.UPDATE_INFO_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation UpdateInfo($input:UpdateMcInput!){
    Merchant{
      UpdateMc (input: $input) {
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

    const input: any =
      payload?.paymentMethod || payload?.paymentMethodExtend
        ? {
            ...payload,
            paymentMethodExtend: JSON.stringify(newFormatPaymentMethodExtend) || '',
            paymentMethod: payload?.paymentMethod?.map((ele) => ele.referId),
          }
        : {
            ...payload,
          };

    input.operator = payload?.operator?.map((sale) => (sale as OperatorType)?.accountId);

    if (payload?.businessDetails) {
      input.businessDetails = {
        ...payload?.businessDetails,
        merchantContract: payload?.businessDetails?.merchantContract?.url,
      };
    }

    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input,
    });
    const updated = data?.data?.Merchant?.UpdateMc;
    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_INFO_MERCHANT.SUCCESS,
        payload: updated?.message,
      });
      callback && callback(true, updated);
    } else {
      yield put({
        type: types.UPDATE_INFO_MERCHANT.FAILURE,
      });

      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.UPDATE_INFO_MERCHANT.FAILURE,
    });
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_INFO_MERCHANT.REQUEST, doAction);
}
